const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            maxlength: 500,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
            index: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
        upVotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        downVotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        replies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);

