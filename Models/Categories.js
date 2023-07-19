let mongoose = require('mongoose');
let slugify = require('slugify');

const categoriesSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
}, { timestamps: true });

// Generate slug before saving the tag


module.exports = mongoose.model('Categories',categoriesSchema)