// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model('Message', messageSchema);
