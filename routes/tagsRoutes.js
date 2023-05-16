const express = require('express');
const router = express.Router();
const Tag = require('../Models/Tags');
let slugify = require('slugify');

// Create a new tag
router.post('/tags', async (req, res) => {
    try {
        const { name, description } = req.body;

        // Check if the tag name already exists
        const existingTag = await Tag.findOne({ name });
        if (existingTag) {
            return res.status(400).json({ error: 'Tag name already exists' });
        }

        let tag = new Tag({ name, description });
        await tag.save();

        res.status(201).json(tag);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create a tag' });
    }
});

// Get all tags
router.get('/tags', async (req, res) => {
    try {
        const tags = await Tag.find();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tags' });
    }
});

// Get a specific tag
router.get('/tags/:id', async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        res.json(tag);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve the tag' });
    }
});

// Update a tag
router.put('/tags/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedTag = await Tag.findByIdAndUpdate(
            req.params.id,
            {   name :name,
                description : description,
                slug : slugify(req.body.name, { lower: true })
            },
            { new: true }
        );
        if (!updatedTag) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        res.json(updatedTag);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update the tag' });
    }
});

// Delete a tag
router.delete('/tags/:id', async (req, res) => {
    try {
        const deletedTag = await Tag.findByIdAndDelete(req.params.id);
        if (!deletedTag) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the tag' });
    }
});

module.exports = router;