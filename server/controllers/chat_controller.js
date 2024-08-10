const express = require("express");
const { verifyToken } = require("../middleware/auth");

const Messages = require("../models/message_model.js");
const Room = require("../models/room_model.js");

const router = express.Router();

// Fetch all messages
router.get("/messages", async (req, res) => {
  try {
    const messages = await Messages.find()
      .populate("author", "userName")
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// update a message
router.post("/message/:id", async (req, res) => {
  try {
    const { content } = req.body.content;
    const message = await Messages.findById(req.params.id);
    if (!message) return res.status(404).json({ msg: "Message Not Found" });

    message.content = content;
    message.updatedAt = Date.now();
    await message.save();

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
});

// delete a message
router.delete("/message/:id", async (req, res) => {
  try {
    const message = await Messages.findById(req.params.id);

    if (!message) return res.status(404).json({ msg: "Message Not Found" });
    // await post.remove();
    await message.remove();
    res.status(200).json({ msg: "Message Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
});

// Fetch all rooms
router.get("/chat-rooms", async (req, res) => {
  try {
    const rooms = await Room.find(req.params.id)
      .populate({
        path: "messages",
        model: "Message",
        populate: { path: "author", select: "userName" },
      })
      .populate({ path: "users", model: "User" });
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/chat-room/:id/messages", async (req, res) => {
  try {
    const messages = await Room.findById();
    res.status(200).json(messages);
  } catch (err) {}
});

module.exports = router;
