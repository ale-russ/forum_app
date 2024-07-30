var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  profileImage: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

UserSchema.methods.comparePassword = function (userPassword) {
  return bcrypt.compareSync(userPassword, this.password);
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
