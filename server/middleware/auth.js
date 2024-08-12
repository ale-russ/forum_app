const jwt = require("jsonwebtoken");
const User = require("../models/user_models");

const verifyToken = (req, res, next) => {
  // const token = req.header("x-auth-token");
  const token = req.header("Authorization").replace("Bearer ", "");
  // const token = req.header("Authorization");
  console.log("token: ", token);
  try {
    if (!token) return res.status(401).json({ msg: "Access Denied" });
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log("req.user: ", verified);
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid Token" });
  }
};

module.exports = { verifyToken };
