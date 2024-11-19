// models/Comment.js
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    blogId: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const BlogComment = mongoose.model('BlogComment', CommentSchema);
