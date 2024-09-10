var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  profileImage: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  roomsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
  roomsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

UserSchema.methods.comparePassword = function (userPassword) {
  return bcrypt.compareSync(userPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
