const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const Room = mongoose.model("Room", roomSchema);
const Message = mongoose.model("Message", MessageSchema);

module.exports = { Room, Message };
