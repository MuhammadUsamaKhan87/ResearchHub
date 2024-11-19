import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    assignedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export const Task = mongoose.model('Task', taskSchema);