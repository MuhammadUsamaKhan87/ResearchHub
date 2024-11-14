import exprss from 'express';
import { Discussion } from '../Model/Discussion.js';
import { User } from '../Model/User.js';

const Router = exprss.Router();

Router.get('/discussionFetch', async (req, res) => {
    try {
        const discussions = await Discussion.find();
        res.status(200).json(discussions);
    } catch (error) {
        console.error('Error fetching discussions:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

Router.get('/discussion/:id', async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id).populate('userId');
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }
        res.status(200).json(discussion);
    } catch (error) {
        console.error('Error fetching discussion:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export { Router as discussionRouter };