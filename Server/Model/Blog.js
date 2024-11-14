import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    interestedTopics: {
        type: [String],
        default: [],
    },
    view: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    usersDisliked: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Blog = mongoose.model('Blog', blogSchema);
