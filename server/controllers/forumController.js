const express = require('express');

const { verifyToken } = require('../middleware/auth');
const Post = require('../models/post_model');
const Comment = require('../models/comments_model');

const router = express.Router();
// Create Post
router.post('/post', verifyToken, async (req, res) => {
  console.log('req.body: ', req.body);
  try {
    if (!req.user || !req.user.id) return res.status(400).json({ message: 'User ID is missing' });

    const post = new Post({
      ...req.body,
      author: req.user.id || req.user._id,
    });

    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', error: err.msg });
  }
});

// Get All Posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'userName' },
      })
      .populate('author', 'userName profileImage')
      .sort({ createdAt: 1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', error: err.msg });
  }
});

// Get a single post
router.get('/posts/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (req.user?._id && !post.views.includes(req.user?._id)) {
      post.views.push(req.user?._id);
      await post.save();
    }

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const populatedPost = await (await post.populate('author', 'userName')).populate('views', 'userName').populate({
      path: 'comments',
      populate: { path: 'author', select: 'userName' },
    });

    res.status(200).json(populatedPost);
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', error: err.msg });
  }
});

router.get('/search', verifyToken, async (req, res) => {
  console.log('in search backend');
  const { query } = req.query;
  try {
    if (!query) return res.status(400).json({ msg: 'Search Query is required' });

    const posts = await Post.find({
      $or: [{ title: { $regex: query, $options: 'i' } }, { content: { $regex: query, $options: 'i' } }],
    }).populate('author', 'userName');

    res.status(200).json(posts);
  } catch (err) {
    console.log('Err: ', err);
    res.status(500).json({ msg: 'Internal Server Error', error: err.message });
  }
});

// Update a post
router.put('/post/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    if (post.author.toString() != req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

    post.title = req.body.title;
    post.content = req.body.content || post.content;

    await post.save();
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', error: err.message });
  }
});

// Delete a post
router.delete('/posts/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    if (post.author.toString() != req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

    await post.remove();
    res.status(200).json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', error: err.message });
  }
});

// Add comment to a post
router.post('/post/:id/comments', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

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
    res.status(500).json({ msg: 'Internal Server Error', error: err.message });
  }
});

//Like a post
router.post('/post/:id/like', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const userIndex = post.likes.indexOf(req.user.id);

    if (userIndex !== -1) {
      post.likes.splice(userIndex, 1);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.log('ERROR: ', err);
    res.status(400).json({ msg: err.message });
  }
});

//add view count route
router.post('/post/:id/view', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user.id;

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!post.views.includes(userId)) {
      post.views.push(userId);
      await post.save();
    } else {
      console.log('User already viewed the post');
      return;
    }

    res.status(200).json({ views: post.views.length });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
