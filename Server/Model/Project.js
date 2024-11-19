import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ['ongoing', 'pending', 'complete'],
        default: 'ongoing',
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);
