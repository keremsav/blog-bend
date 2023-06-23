let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let isAdmin = require('./authMiddleware').isAdmin;
let Posts = require('../Models/Posts');
let User = require('../Models/User');

// Creat blog post
router.post('/posts', isAdmin, async (req, res) => {
    try {
        const { title, content, tags,image } = req.body;
        const author = req.user.username;

        const post = new Posts({ content,title, author, tags ,image});
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create a blog post' });
    }
});

// Get all blog posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Posts.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve blog posts' });
    }
});

// Get a specific blog post
router.get('/posts/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve the blog post' });
    }
});
//Update a blog post.
router.put('/posts/:id', isAdmin, async (req, res) => {
    try {
        const { title, content, tags ,image} = req.body;
        const author = req.user.username;
        const updatedPost = await Posts.findByIdAndUpdate(
            req.params.id,
            { title, content, tags ,image,author},
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update the blog post' });
    }
});

// Delete a blog post
router.delete('/posts/:id', isAdmin, async (req, res) => {
    try {
        const deletedPost = await Posts.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the blog post' });
    }
});

module.exports = router;

