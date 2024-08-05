const express = require("express");

const { verifyToken } = require("../middleware/auth");
const Post = require("../models/post_model");
const Comment = require("../models/comments_model");

const router = express.Router();
// Create Post
router.post("/post", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!req.user || !req.user.id)
      return res.status(400).json({ message: "User ID is missing" });

    console.log("Creating post with author ID: ", req.user.id);
    const post = new Post({
      title,
      content,
      author: req.user.id || req.user._id,
    });

    await post.save();

    res.status(201).json(post);
  } catch (err) {
    console.log("ERror: ", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.msg });
  }
});

// Get All Posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "userName")
      .populate({
        path: "comments",
        populate: { path: "author", select: "userName" },
      });

    res.status(200).json(posts);
  } catch (err) {
    console.log("ERror: ", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.msg });
  }
});

// Get a single post
router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "userName")
      .populate({
        path: "comments",
        populate: { path: "author", select: "userName" },
      });

    if (!post) return res.status(404).json({ msg: "Post not found" });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.msg });
  }
});

// Update a post
router.put("/post/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.author.toString() != req.user.id)
      return res.status(401).json({ msg: "Unauthorized" });

    post.title = req.body.title;
    post.content = req.body.content || post.content;

    await post.save();
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
});

// Delete a post
router.delete("/posts/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.author.toString() != req.user.id)
      return res.status(401).json({ msg: "Unauthorized" });

    await post.remove();
    res.status(200).json({ msg: "Post deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
});

// Add comment to a post
router.post("/post/:id/comments", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const comment = new Comment({
      content: req.body.content,
      author: req.user.id,
      post: post._id,
    });
    await comment.save();
    post.comments.push(comment);
    await post.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
});

//Like a post
router.post("/post/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    if(post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter(id => id.toString() = req.user._id.toString())
    } else {
      post.likes.push(req.user._id)
    }

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;

