const express = require("express");

const { verifyToken } = require("../middleware/auth");
const Post = require("../models/post_model");
const Comment = require("../models/comments_model");
const User = require("../models/user_models");

const router = express.Router();
// Create Post
router.post("/post", verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(400).json({ message: "User ID is missing" });

    const post = new Post({
      ...req.body,
      author: req.user.id || req.user._id,
    });

    await post.save();

    const user = await User.findById(post?.author);
    user?.posts?.push(post);
    await user.save();

    res.status(201).json(post);
  } catch (err) {
    // console.log("Error: ", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.msg });
  }
});

// Get All Posts
router.get("/posts", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: "comments",
        populate: { path: "author", select: "userName" },
      })
      .populate("author", "userName profileImage")
      .sort({ createdAt: 1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.msg });
  }
});

// Get a single post
router.get("/posts/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (req.user?._id && !post.views.includes(req.user?._id)) {
      post.views.push(req.user?._id);
      await post.save();
    }

    if (!post) return res.status(404).json({ msg: "Post not found" });

    const populatedPost = await (await post.populate("author", "userName"))
      .populate("views", "userName")
      .populate({
        path: "comments",
        populate: { path: "author", select: "userName" },
      });

    res.status(200).json(populatedPost);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.msg });
  }
});

router.get("/search", verifyToken, async (req, res) => {
  // console.log("in search backend");
  const { query } = req.query;
  try {
    if (!query)
      return res.status(400).json({ msg: "Search Query is required" });

    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    }).populate("author", "userName");

    res.status(200).json(posts);
  } catch (err) {
    // console.log("Err: ", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
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
router.delete("/post/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    console.log("user: ", req.user);
    const user = await User.findById(req.user.id);

    if (post.author.toString() !== user.id && user.role !== "admin") {
      console.log("Unable to delete post.");
      res.status(401).json({ msg: "Unauthorized" });
      return;
    }

    await Post.findByIdAndDelete(post._id);

    await User.findByIdAndUpdate(
      post.author,
      { $pull: { posts: post._id } },
      { new: true }
    ).select("-password");

    return res.status(200).json({ msg: "Post deleted" });
  } catch (err) {
    // console.log("Error: ", err);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: err.message });
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
    const user = await User.findById(req.user.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const userIndex = post.likes.indexOf(req.user.id);
    const postLikedIndex = user.likedPosts.indexOf(post._id);

    if (userIndex !== -1) {
      post.likes.splice(userIndex, 1);
      if (postLikedIndex !== -1) {
        user.likedPosts.splice(postLikedIndex, 1);
      }
    } else {
      post.likes.push(req.user.id);
      if (postLikedIndex === -1) {
        user.likedPosts.push(post);
      }
    }

    await post.save();
    await user.save();
    // console.log("User: ", user);
    res.status(200).json(post);
  } catch (err) {
    // console.log("ERROR: ", err);
    res.status(400).json({ msg: err.message });
  }
});

//add view count route
router.post("/post/:id/view", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user.id;

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.views.includes(userId)) {
      post.views.push(userId);
      await post.save();
    } else {
      // console.log("User already viewed the post");
      return;
    }

    res.status(200).json({ views: post.views.length });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//following route
router.post("/post/follow/:userId", verifyToken, async (req, res) => {
  try {
    let isFollowing;
    let currentUser = await User.findById(req.user.id).select("-password"); // Currently logged in user
    const { userId } = req.params; //ID of  the user to follow
    let followedUser = await User.findById(userId).select("-password"); //followed user

    if (currentUser?.following?.includes(userId)) {
      // Unfollow the user
      currentUser = await User.findByIdAndUpdate(
        currentUser._id,
        { $pull: { following: userId } },
        { new: true }
      );
      followedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { followers: currentUser._id } },
        { new: true }
      );
      isFollowing = false;
    } else {
      // Follow the user
      currentUser = await User.findByIdAndUpdate(
        currentUser._id,
        { $addToSet: { following: userId } },
        { new: true }
      );
      followedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { followers: currentUser._id } },
        { new: true }
      );
      isFollowing = true;
    }

    //fetch posts from followed users
    const posts = await Post.find({
      author: { $in: currentUser.following },
    }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ msg: "Success", isFollowing, posts });
  } catch (err) {
    // console.log("Error: ", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// const saveComment = async (commentText, postId, authorId) => {
//   const mentionPattern = /@(\w+)/g;
//   const mentions = [...commentText.matchAll(mentionPattern)].map(
//     (match) => match[1]
//   );

//   const userMentioned = await User.find({ userName: { $in: mentions } });

//   //save comment to the database
// };

module.exports = router;
