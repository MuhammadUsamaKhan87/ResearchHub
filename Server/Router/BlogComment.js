import express from 'express'
import { BlogComment } from '../Model/BlogComment.js'

const router = express.Router()

router.post('/BlogComment', async (req, res) => {
    try {
        const { userId, blogId, comment } = req.body;
        const newComment = new BlogComment({ userId, blogId, comment });
        await newComment.save(); res.status(201).json(newComment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding comment' });
        console.log('Error adding comment:', error);
    }
});

router.get('/Blogcomments', async (req, res) => {
    try {
        const comments = await BlogComment.find();
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching comments' });
        console.log('Error fetching comments:', error);
    }
});

export { router as commentBlogRouter }