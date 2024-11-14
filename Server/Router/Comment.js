import express from 'express'
import { Comment } from '../Model/Comment.js'

const router = express.Router()

// Get comments for a specific post
router.get('/comments/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId })
            .populate('userId', 'username') // Assuming user has a 'username' field
            .populate('parentId') // Populate parent comments for replies
            .sort({ createdAt: -1 }); // Sort by latest first
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching comments' });
    }
});

// Add a new comment
router.post('/comments', async (req, res) => {
    const { postId, userId, commentText, parentId } = req.body;

    try {
        const newComment = new Comment({
            postId,
            userId,
            commentText,
        });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ message: 'Error posting comment' });
        console.error('Error posting comment:', err);
    }
});

export { router as commentsRouter };
