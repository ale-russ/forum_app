const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const User = require("../models/user_models");
const Post = require("../models/post_model");

const { verifyToken } = require("../middleware/auth");
const { uploadImage, uploadFile } = require("../middleware/utils");

dotenv.config();

const mongoUrl = process.env.MONGODB_URL;
const baseUrl = process.env.APPWRITE_ENDPOINT;
const bucketId = process.env.APPWRITE_BUCKET_ID;
const projectId = process.env.APPWRITE_PROJECT_ID;

const router = express.Router();

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  userName: Joi.string().required(),
});

const client = new MongoClient(mongoUrl);

const db = client.db("forum");
const userCollection = db.collection("users");

// Check if email exists in the db
async function checkEmailStatus(userCollection, email) {
  const user = await userCollection.findOne({ email });
  return user !== null;
}

//fetch user data by ID
async function fetchUserData(userCollection, id) {
  const objectId = ObjectId.createFromHexString(id);
  const user = await userCollection.findOne({ _id: objectId });
  return user;
}

// register route
router.post("/register", uploadFile.single("image"), async (req, res) => {
  try {
    const validationResult = userSchema.validate(req.body);

    if (validationResult.error)
      return res
        .status(400)
        .json({ msg: validationResult.error.details[0].message });

    const { email, password, userName, profileImage } = req.body;

    if (!userName || !email || !password)
      return res.status(400).json({ msg: "Please enter all fields" });

    // check if profile image is provided
    // if (!req.file)
    //   return res.status(400).json({ msg: "Profile Image is required" });

    const emailExists = await checkEmailStatus(userCollection, email);
    if (emailExists)
      return res.status(409).json({ msg: "Email already exists" });

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profileImageUrl;
    if (req.file) {
      try {
        const fileId = await uploadImage(
          req.file.buffer,
          req.file.originalname
        );
        profileImageUrl = `${baseUrl}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}&mode=public`;
      } catch (err) {
        return res.status(500).json({ msg: "Internal Server Error" });
      }
    }

    const newUser = {
      userName,
      email,
      password: hashedPassword,
      profileImage: profileImageUrl,
    };
    await userCollection.insertOne(newUser);
    delete newUser.password;
    return res.json({ msg: "User registered successfully", user: newUser });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "All fields are required" });

  try {
    const user = await User.findOne({ email })
      .populate("posts")
      .populate("roomsJoined")
      .populate("roomsCreated");

    if (!user)
      return res.status(401).json({ msg: "Invalid Email or Password" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ msg: "Invalid Email or Password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    // delete user.password;
    user.password = undefined;
    // console.log("User logged in successfully", user);

    if (res.statusCode === 200) {
      return res.status(200).json({
        msg: "User successfully Logged In",
        token,
        ...user._doc,
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

//fetch all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// route to get user information
router.get("/user-info", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("posts")
      .populate({ path: "roomsCreated", select: "-messages" })
      .populate({ path: "roomsJoined", select: "-messages" })
      .populate("likedPosts")
      .populate({ path: "followers", select: "-password" })
      .populate({ path: "following", select: "-password" });

    // check if user exist
    if (!user) return res.status(400).json({ msg: "User Not Found" });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/:userId/followers", verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId)
      .populate("followers", "userName email _id")
      .select("-password");

    res.status(200).json({ followers: user.followers });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch Followers", error: err });
  }
});

router.get("/:userId/following", verifyToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId)
      .populate("following", "userName email _id")
      .select("-password");

    res.status(200).json({ following: user.following });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch Following", error: err });
  }
});

router.post("/signout", (req, res) => {
  // res.clearCookie("token");
  return res.status(200).json({ msg: "Successfully signed out" });
});

//reset password link
router.post("/request-password-reset-link", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("email: ", email);
    const user = await User.findOne({ email }).select("-password");

    if (!user) return res.status(400).json({ msg: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

    const mailOptions = {
      from: "alemr905@gmail.com",
      to: email,
      subject: "Password Reset Link",
      html: `<h1>Password Reset Link</h1>
      <p>Please use this link to reset your password</p>
      <a href="${resetUrl}" style="background-color: #BE0027; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link is valid for 1 hour only</p>`,
    };
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "alemr905@gmail.com",
        pass: "rxyv nnal wbal lhfe",
      },
    });

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ msg: "Reset Password Link has been sent to your email" });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

//reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!password || !token)
      return res.status(400).json({ msg: "Token and Password are required" });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(404)
        .json({ msg: "Password reset token is invalid or expired" });

    // user.password = await bcrypt.genSalt(password, 10);
    user.password = await bcrypt.hash(password, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res
      .status(200)
      .json({ msg: "Password has been updated successfully" });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
