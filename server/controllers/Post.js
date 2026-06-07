const Post = require("../models/Post");

exports.createPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { turfId, sport, time, date, playersNeeded, description } = req.body;

        if (!turfId || !sport || !time || !date || !playersNeeded) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newPost = await Post.create({
            user: userId,
            turf: turfId,
            sport,
            time,
            date,
            playersNeeded,
            description
        });

        const populatedPost = await Post.findById(newPost._id)
            .populate("user", "firstName lastName image")
            .populate("turf", "turfName area city");

        return res.status(200).json({ success: true, message: "Post created successfully", data: populatedPost });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to create post" });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        // Find posts that haven't expired (MongoDB handles expiry, but we ensure we fetch active ones)
        const posts = await Post.find({})
            .populate("user", "firstName lastName image")
            .populate("turf", "turfName area city image")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to fetch posts" });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Check if user owns post
        if (post.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this post" });
        }

        await Post.findByIdAndDelete(postId);
        return res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to delete post" });
    }
};
