import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    filePath: { type: String, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    uploadedAt: { type: Date, default: Date.now },
});

export const File = mongoose.model("File", fileSchema);
