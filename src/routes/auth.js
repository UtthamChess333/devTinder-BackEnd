const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added Sucessfully");
  } catch (error) {
    res.status(400).send("Error saving the user:" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).send("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid Credentials");
    }
    const token = await user.getJWT();
    res.cookie("token", token, { httpOnly: true });
    res.send("Login Successful");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.post(".logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expiresIn: new Date(Date.now()),
    });
    res.send("Logout SucessFul");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = authRouter;
