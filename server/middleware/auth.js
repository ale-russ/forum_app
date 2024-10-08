const jwt = require("jsonwebtoken");
const User = require("../models/user_models");

const verifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "Access Denied" });
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ msg: "Token expired. Please log in again." });
    }
    res.status(400).json({ msg: "Invalid Token" });
  }
};

const getUserIdFromToken = (token) => {
  console.log("JWT_SECRET: ", process.env.JWT_SECRET);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded ", decoded);
    return decoded.id;
  } catch (err) {
    console.error("Error in getUserIdFromToken", err);
    return null;
  }
};

module.exports = { verifyToken, getUserIdFromToken };
