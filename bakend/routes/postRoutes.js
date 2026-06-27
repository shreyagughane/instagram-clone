const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const upload = require("../uploads/middleware/upload");
const verifyToken = require("../uploads/middleware/authMiddleware");

// CREATE POST
router.post(
  "/create",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const newPost = new Post({
        userId: req.user.id,
        caption: req.body.caption,
        image: req.file ? `/uploads/${req.file.filename}` : ""
      });

      await newPost.save();
      res.status(201).json(newPost);
    } catch (err) {
      console.log("CREATE POST ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// GET ALL POSTS
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    console.log("POST FETCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// LIKE / UNLIKE POST
router.put("/like/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({ $push: { likes: req.user.id } });
      return res.json("Post liked");
    } else {
      await post.updateOne({ $pull: { likes: req.user.id } });
      return res.json("Post unliked");
    }
  } catch (err) {
    console.log("LIKE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ADD COMMENT
router.put("/comment/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = {
      userId: req.user.id,
      text: req.body.text
    };

    post.comments.push(newComment);
    await post.save();

    res.json(post);
  } catch (err) {
    console.log("COMMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET POSTS OF SINGLE USER
router.get("/user/:id", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id });
    res.json(posts);
  } catch (err) {
    console.log("USER POSTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;