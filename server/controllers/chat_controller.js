const express = require("express");
const { verifyToken } = require("../middleware/auth");

const Messages = require("../models/message_model.js");

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
    console.log("message ", message);
    if (!message) return res.status(404).json({ msg: "Message Not Found" });
    // await post.remove();
    await message.remove();
    res.status(200).json({ msg: "Message Deleted Successfully" });
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
});

module.exports = router;
