let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let isAdmin = require('./authMiddleware').isAdmin;
let Posts = require('../Models/Posts');
let User = require('../Models/User');


// Get Users
router.get('/users',async (req,res) => {
    try {
        let email = req.query.email;
        if(!email) {
            let users = await User.find();
            res.status(200).json(users);
        } else {
            let users = await User.find({email: { $regex: email, $options: 'i' }},{},{lean:true})
            res.status(200).json(users);
        }
    } catch (err) {
        res.status(500).json('Cant get the users data.')
    }
});

//Update User
router.put('/users/:id',async (req,res) => {
    try {
        let id = req.params.id;
        let {username,email,isVerified,isAdmin } = req.body;
        let updatedUser = await User.findByIdAndUpdate(id, {username,email,isVerified,isAdmin},{new:true});
        if(!updatedUser) {
            res.status(404).json({error:'User Not found.'})
        }
        res.json(updatedUser);


    }catch (err) {
        res.status(500).json({error : 'User cant update.'})
    }
})

//Delete User
router.delete('/users/:id', async(req,res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if(!deletedUser) {
            return res.status(404).json({error: 'User not found.'})
        }
        res.status(200).json({message : 'User deleted successfully'});
    } catch (err) {
        res.status(500).json({error : 'Failed to delete the user.'})
    }
})


// Creat blog post
router.post('/posts', async (req, res) => {
    try {
        const { title, content, tags,image,categoryIds,author } = req.body;

        const post =  new Posts({ title ,content, author,categoryIds, tags ,image});
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
        let title = req.query.title || '';


        const totalCount = await Posts.countDocuments(); // Get the total number of records in the "Posts" collection

        const totalPages = Math.ceil(totalCount / limit); // Calculate the total number of pages

        const skip = (page - 1) * limit; // Calculate the offset value

        let posts;
        if(title) {
             posts = await Posts.find({title: { $regex: title, $options: 'i' }},{},{lean : true});
        } else {
             posts = await Posts.find().sort({createdAt: date}).skip(skip).limit(limit); // Fetch the paginated posts from the database
        }

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

// Get Posts By Category
router.get('/posts/category', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const date = parseInt(req.query.date) || -1;
        const categoryId = req.query.categoryId; // Get the categoryId from the request parameters
        // Fetch the total count of posts that match the specified categoryId
        const totalCount = await Posts.countDocuments({ categoryIds: categoryId });

        const totalPages = Math.ceil(totalCount / limit);
        const skip = (page - 1) * limit;

        // Fetch the paginated posts that match the specified categoryId and sort by createdAt
        const posts = await Posts.find({ categoryIds: categoryId }).sort({ createdAt: date }).skip(skip).limit(limit);

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
router.put('/posts/:id', async (req, res) => {
    try {
        const { title, content, author, tags ,image,slug,categoryIds} = req.body;
        const updatedPost = await Posts.findByIdAndUpdate(
            req.params.id,
            { title, content, tags ,image,author,slug,categoryIds},
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
router.delete('/posts/:id', async (req, res) => {
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

