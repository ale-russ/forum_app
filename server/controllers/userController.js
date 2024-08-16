const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const User = require("../models/user_models");
const { verifyToken } = require("../middleware/auth");
const { uploadImage } = require("./utils");

dotenv.config();

const mongoUrl = process.env.MONGODB_URL;

const router = express.Router();

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  userName: Joi.string().required(),
});

// const uploadDir = "uploads";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       path.parse(file.originalname).name + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({ storage });

const client = new MongoClient(mongoUrl);

const db = client.db("test");
const userCollection = db.collection("users");

// Check if email exists in the db
async function checkEmailStatus(userCollection, email) {
  const user = await userCollection.findOne({ email });
  //   return !!user;
  return user !== null;
}

//fetch user data by ID
async function fetchUserData(userCollection, id) {
  const objectId = ObjectId.createFromHexString(id);
  const user = await userCollection.findOne({ _id: objectId });
  return user;
}

// register route
router.post("/register", async (req, res) => {
  const validationResult = userSchema.validate(req.body);

  // check for validation
  if (validationResult.error)
    return res
      .status(400)
      .json({ msg: validationResult.error.details[0].message });

  const { email, password, userName, profileImage } = req.body;

  // check if fields are not empty
  if (!userName || !email || !password)
    return res.status(400).json({ msg: "Please enter all fields" });

  // check if profile image is provided
  // if (!req.file)
  //   return res.status(400).json({ msg: "Profile Image is required" });

  // check if email exists
  const emailExists = await checkEmailStatus(userCollection, email);
  if (emailExists) return res.status(409).json({ msg: "Email already exists" });

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (req.file) {
    try {
      const fileId = await uploadImage(req.file.buffer, req.file.originalname);
      newUser.profileImage = fileId;
    } catch (err) {
      console.log("Error uploading profile image", err);
    }
  }

  // create a new user object and insert it to the db
  const newUser = {
    userName,
    email,
    password: hashedPassword,
    profileImage: req.file.path,
  };

  try {
    await userCollection.insertOne(newUser);
    delete newUser.password;
    return res.json({ msg: "User registered successfully", user: newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "All fields are required" });

  try {
    const user = await userCollection.findOne({ email });

    if (!user)
      return res.status(401).json({ msg: "Invalid Email or Password" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ msg: "Invalid Email or Password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const userId = user._id;
    const userEmail = user.email;
    const userName = user.userName;
    const userProfileImage = user.profileImage;

    delete user.password;

    if (res.statusCode === 200) {
      return res.status(200).json({
        msg: "User successfully Logged In",
        token,
        userId,
        userEmail,
        userName,
        // userProfileImage,
      });
    } else {
      return res.status(401).json({ msg: "Internal Server Error" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: err.message });
  }
});

// route to get user information
router.get("/user-info", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    // check if user exist
    if (!user) return res.status(400).json({ msg: "User Not Found" });
    console.log("USER: ", user);
    delete user.password;
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
