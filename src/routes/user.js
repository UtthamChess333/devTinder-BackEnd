const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/view", userAuth, async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId query parameter is required",
      });
    }

    const user = await User.findById(userId).select(USER_SAFE_DATA);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        user: user,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error: " + err.message,
    });
  }
});

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({
      message: "Data fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find connection requests where THIS user is involved
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ]
    }).select("fromUserId toUserId");

    // Build array of users to exclude: self + users with existing requests with this user
    const usersToExclude = [loggedInUser._id];
    
    connectionRequests.forEach((conn) => {
      // If I sent the request, hide the recipient
      if (conn.fromUserId.toString() === loggedInUser._id.toString()) {
        usersToExclude.push(conn.toUserId);
      }
      // If I received the request, hide the sender
      else {
        usersToExclude.push(conn.fromUserId);
      }
    });

    // Get available users for feed
    const users = await User.find({
      _id: { $nin: usersToExclude }
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Data fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
module.exports = userRouter;
  