let mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    tags: [{ type: String}],
    image : {type:String}
});

module.exports = mongoose.model('Posts',postSchema);

