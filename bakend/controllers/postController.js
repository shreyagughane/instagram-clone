const Post = require("../models/Post");

exports.createPost = async (req, res) => {
    try {
        const { user, caption, image } = req.body;

        const post = new Post({
            user,
            caption,
            image
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "username profilePic")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.likePost = async (req, res) => {
    try {
        const { userId } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
            await post.save();
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.commentPost = async (req, res) => {
    try {
        const { user, text } = req.body;

        const post = await Post.findById(req.params.id);

        post.comments.push({ user, text });
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
