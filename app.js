const express = require("express");
const connectDB = require("./src/config/database.js");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./src/routes/auth.js");
const profileRouter = require("./src/routes/profile.js");
const requestsRouter = require("./src/routes/requests.js");
const userRouter = require("./src/routes/user.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
