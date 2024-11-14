import mongoose from "mongoose";
const discussionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    tags: {
        type: [String],
        required: true,
    },
    fileUrl: {
        type: String,
        required: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    usersDisliked: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    }
});

export const Discussion = mongoose.model('Discussion', discussionSchema);
