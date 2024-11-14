import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    role: { type: String, default: "student" },
    description: { type: String, default: '' },
    interestedTopics: { type: [String], default: [] },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    introduction: { type: String, default: '' },
    github: { type: String, default: '#' },
    linkedin: { type: String, default: '#' },
    twitter: { type: String, default: '#' },
});

export const Profile = mongoose.model('Profile', UserProfileSchema);