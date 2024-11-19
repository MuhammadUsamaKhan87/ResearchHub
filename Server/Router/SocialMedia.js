import express from 'express';
import { User } from '../Model/User.js';

const router = express.Router();

// Follow User
router.put('/follow/:id', async (req, res) => {
    const { currentUserId } = req.body;
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        const currentUser = await User.findById(currentUserId);

        if (!user || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.followers.includes(currentUserId)) {
            user.followers.push(currentUserId);
            await user.save();

            currentUser.following.push(id);
            await currentUser.save();
        }

        res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error following user', error });
    }
});

// Unfollow User
router.put('/unfollow/:id', async (req, res) => {
    const { currentUserId } = req.body;
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        const currentUser = await User.findById(currentUserId);

        if (!user || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.followers = user.followers.filter(followerId => followerId.toString() !== currentUserId);
        await user.save();

        currentUser.following = currentUser.following.filter(followingId => followingId.toString() !== id);
        await currentUser.save();

        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error unfollowing user', error });
    }
});

export { router as SocialMediaRouter };
