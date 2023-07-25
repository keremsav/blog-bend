const express = require('express');
const router = express.Router();
const Categories = require('../Models/Categories');
const {isAdmin} = require("./authMiddleware");

// Create a new tag
router.post('/categories', async (req, res) => {
    try {
        const { name} = req.body;

        // Check if the tag name already exists
        const existingCategory = await Categories.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ error: 'Category name already exists' });
        }

        let category = new Categories({name});
        await category.save();

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create a category' });
    }
});

// Get all tags
router.get('/categories', async (req, res) => {
    try {
        const categories = await Categories.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve categories' });
    }
});

// Get a specific tag
router.get('/categories/:id', async (req, res) => {
    try {
        const category = await Categories.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve the category' });
    }
});

// Update a tag
router.put('/categories/:id', async (req, res) => {
    try {
        const { name } = req.body;
        const updatedCategories = await Categories.findByIdAndUpdate(
            req.params.id,
            {   name :name
            },
            { new: true }
        );
        if (!updatedCategories) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(updatedCategories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update the category' });
    }
});

// Delete a tag
router.delete('/categories/:id', async (req, res) => {
    try {
        const deletedCategory = await Categories.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the category' });
    }
});

module.exports = router;