let mongoose = require('mongoose');
const slugify = require("slugify");

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug : {type:String},
    author: { type: String,  required: true },
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    createdAt: { type: Date, default: Date.now },
    tags: [{ type: String}],
    image : {type:String}
});

postSchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

module.exports = mongoose.model('Posts',postSchema);

