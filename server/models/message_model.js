const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
    unique: function () {
      return this.name !== "";
    },
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

module.exports = mongoose.model("Message", MessageSchema);
module.exports = mongoose.model("Room", RoomSchema);
