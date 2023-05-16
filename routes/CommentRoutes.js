const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../Models/Comment');
const User = require('../Models/User');
let isAuth = require('./authMiddleware').isAuth;

// Create a comment
router.post('/comments',isAuth, async (req, res) => {
    try {
        const { content, post } = req.body;
        const author = req.user._id;
        const comment = new Comment({ content, author, post });
        await comment.save();

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create a comment' });
    }
});

// Get all comments for a specific post
router.get('/comments/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ post: postId }).populate('author', 'username');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve comments' });
    }
});

// Get a specific comment
router.get('/comments/:id', async (req, res) => {
    try {
        const commentId = req.params.id;
        console.log(commentId);
        const comment = await Comment.findById(commentId)
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve the comment' });
    }
});

// Update a comment
router.put('/comments/:id',isAuth, async (req, res) => {
    try {
        const commentId = req.params.id;
        const { content } = req.body;

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true }
        );
        if (!updatedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update the comment' });
    }
});

// Delete a comment
router.delete('/comments/:id',isAuth, async (req, res) => {
    try {
        const commentId = req.params.id;

        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the comment' });
    }
});

module.exports = router;