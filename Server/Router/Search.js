import express from 'express';
import mongoose from 'mongoose';
import { Blog } from '../Model/Blog.js';
import { Discussion } from '../Model/Discussion.js';
import { Document } from '../Model/Document.js';
import { User } from '../Model/User.js';

const router = express.Router();

// Search API Endpoint
router.get('/search', async (req, res) => {
    const { query } = req.query; // Search query from request
    if (!query) {
        return res.status(400).json({ message: 'Search query is required.' });
        console.log('Search query is required.');
    }

    try {
        // Search in Blogs
        const blogs = await Blog.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { interestedTopics: { $in: [query] } }
            ]
        });

        // Search in Discussions
        const discussions = await Discussion.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Search by title (case insensitive)
                { description: { $regex: query, $options: 'i' } }, // Search by description (case insensitive)
                { tags: { $in: [query] } } // Search by tag
            ]
        });

        // Search in Documents
        const documents = await Document.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Search by title (case insensitive)
                { description: { $regex: query, $options: 'i' } }, // Search by description (case insensitive)
                { relatedField: { $in: [query] } }, // Search by related field
                { author: { $regex: query, $options: 'i' } }, // Search by author
            ]
        });

        // Search in Users (by username)
        const users = await User.find({
            name: { $regex: query, $options: 'i' } // Search by username (case insensitive)
        });

        // Send response with all the search results
        return res.status(200).json({
            blogs,
            discussions,
            documents,
            users
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

export { router as SearchRouter };