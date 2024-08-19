const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: false,
  },
  content: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("Message", MessageSchema);
