import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const Chat = mongoose.model('Chat', chatSchema);
