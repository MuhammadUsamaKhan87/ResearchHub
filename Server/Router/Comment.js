// routes/comments.js
import express from 'express';
import Comment from '../Model/Comment.js';

const router = express.Router();
// Add a new comment
router.post('/comment', async (req, res) => {
    const { postId, userId, text } = req.body;
    try {
        const newComment = new Comment({ postId, userId, text });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add comment' });
        console.error(error);
    }
});

// Add a reply to an existing comment
router.post('/reply', async (req, res) => {
    const { commentId, postId, userId, text } = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        const reply = { userId, postId, text };
        comment.replies.push(reply);
        await comment.save();

        res.status(201).json(reply);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add reply' });
    }
});

// Fetch comments and replies for a specific post
router.get('/comments/:postId', async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await Comment.find({ postId });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

export { router as commentRouter };
