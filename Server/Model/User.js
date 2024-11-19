import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationCode: { type: String },
    isVerify: { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export const User = mongoose.model('Users', UserSchema);
