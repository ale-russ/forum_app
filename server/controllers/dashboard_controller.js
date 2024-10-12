const express = require("express");

const router = express.Router();

const User = require("../models/user_models");
const Post = require("../models/post_model");
const Message = require("../models/message_model");
const Comment = require("../models/comments_model");
const Rooms = require("../models/room_model.js");
const ReportedContents = require("../models/reported_contents_model.js");

const { verifyToken } = require("../middleware/auth");

router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    // total users
    const totalUsers = await User.find()
      .sort({ userName: -1 })
      .select("-password -resetPasswordToken -resetPasswordExpires");

    //Active chats
    const activeChats = await Message.countDocuments({});

    //New posts (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newPosts = await Post.countDocuments({
      createdAt: { $gte: twentyFourHoursAgo },
    });

    //Reported Contents:
    const reportedContents = await ReportedContents.countDocuments({});

    // user growth
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).then((result) =>
      result.map(({ _id, count }) => ({
        month: new Date(0, _id - 1).toLocaleString("en", { month: "short" }),
        count,
      }))
    );

    const commentActivity = await Comment.find();

    const postActivity = await Post.find()
      .populate("likes", "userName")
      .populate("views", "userName")
      .select("title likes views")
      .exec();

    //Recent Activity
    const recentActivity = await Post.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("author", "userName")
      .select("author content createdAt")
      .then((posts) =>
        posts.map((post) => ({
          user: post.author.userName,
          action: `Created a new post: ${post.content.substring(0, 30)}...`,
          time: `${Math.floor((Date.now() - post.createdAt) / 60000)} minutes`,
        }))
      );

    const chatRooms = await Rooms.find().sort({ createdAt: -1 });

    //return json
    res.status(200).json({
      totalUsers,
      activeChats,
      newPosts,
      reportedContents,
      userGrowth,
      recentActivity,
      chatRooms,
      postActivity,
      commentActivity,
    });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
