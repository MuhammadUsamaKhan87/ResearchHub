import express from 'express';
import { Project } from '../Model/Project.js';
import { User } from '../Model/User.js';
import { Task } from '../Model/Task.js';
import { Chat } from '../Model/Chat.js';
import { File } from '../Model/File.js';

const router = express.Router();

// Create a new project
router.post('/projectsCreate/:id', async (req, res) => {
    try {
        const { title, description, tags, members, status, startDate, endDate } = req.body;

        const newProject = new Project({
            title,
            description,
            tags,
            status,  // Include status
            startDate,  // Include startDate
            endDate,  // Include endDate
            admin: req.params.id,
            members,
        });

        await newProject.save();
        res.status(201).json({ message: 'Project created successfully!', project: newProject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating project', error });
    }
});

// Get all projects
router.get('/projects', async (req, res) => {
    try {
        // Fetch all projects without populating admin and members
        const projects = await Project.find();

        // Send the fetched projects back in the response
        res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching projects', error });
    }
});

router.get('/searchMember', async (req, res) => {
    const { query } = req.query; // Get search query parameter
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });

    try {
        // Use regex to perform case-insensitive search
        const users = await User.find({ name: { $regex: query, $options: 'i' } })
            .limit(10); // Limit results to 10 users to improve performance

        res.status(200).json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get a project by ID
router.get('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching project', error });
    }
});
// Update a project
router.put('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: 'Project updated successfully!', project: updatedProject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating project', error });
    }
});

// Delete a project
router.delete('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Project.findByIdAndDelete(id);
        res.status(200).json({ message: 'Project deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting project', error });
    }
});

router.post('/taskProject', async (req, res) => {
    try {
        const { projectId, title, description, deadline, status, assignedMembers } = req.body;

        if (!projectId || !title || !description || !deadline) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newTask = new Task({
            projectId,
            title,
            description,
            deadline,
            status,
            assignedMembers,
        });

        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

router.get('/FetchChat', async (req, res) => {
    const { projectId } = req.query;
    try {
        const comments = await Chat.find({ projectId });
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Add a new comment
router.post('/Chat', async (req, res) => {
    const { userId, projectId, comment, timestamp } = req.body;
    console.log(req.body);

    // Ensure all required fields are provided
    if (!userId || !projectId || !comment) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const chat = new Chat({
            userId,
            projectId,
            comment,
            timestamp,
        });

        const savedChat = await chat.save();
        res.status(201).json(savedChat);
    } catch (error) {
        console.error('Error saving comment:', error);
        res.status(500).json({ error: 'Failed to save the comment.' });
    }
});
router.get('/TimeLine/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const tasks = await Task.find({ projectId: id });
        const projects = await Project.find({ _id: id });

        res.json({
            success: true,
            data: {
                tasks,
                projects,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/filesPROJECTS/:id', async (req, res) => {
    try {
        const files = await File.find({ projectId: req.params.id });
        res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: 'Error fetching files' });
    }
});

export { router as ProjectRouter };
