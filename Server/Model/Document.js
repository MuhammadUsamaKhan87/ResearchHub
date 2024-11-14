import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    file: { type: String, required: true },
    author: { type: String },
    relatedField: { type: [String], default: [] },
    download: { type: Number, default: 0 },
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
}, {
    timestamps: true
});

export const Document = mongoose.model('documents', DocumentSchema);
