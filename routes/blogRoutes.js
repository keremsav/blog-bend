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
        const page = parseInt(req.query.page) || 1; // Get the current page number from the query parameters
        const limit = parseInt(req.query.limit) || 6; // Get the number of records per page from the query parameters
        const date = parseInt(req.query.date) || -1;

        const totalCount = await Posts.countDocuments(); // Get the total number of records in the "Posts" collection

        const totalPages = Math.ceil(totalCount / limit); // Calculate the total number of pages

        const skip = (page - 1) * limit; // Calculate the offset value

        const posts = await Posts.find().sort({createdAt: date}).skip(skip).limit(limit); // Fetch the paginated posts from the database

        res.send({
            posts,
            page,
            totalPages,
            totalCount
        });
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

