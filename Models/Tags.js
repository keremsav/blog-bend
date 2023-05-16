let mongoose = require('mongoose');
let slugify = require('slugify');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String},
    description: { type: String, minlength: 5, maxlength: 100 },
}, { timestamps: true });

// Generate slug before saving the tag

tagSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});



module.exports = mongoose.model('Tags',tagSchema)