import express from 'express'
import { User } from '../Model/User.js'

const router = express.Router()

router.put('/follow/:id', async (req, res) => {
    try {
        const { id } = req.params; // User to follow
        const currentUserId = req.body.currentUserId; // ID of the user performing the follow action

        if (currentUserId === id) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        // Find both users in the database
        const userToFollow = await User.findById(id);
        const currentUser = await User.findById(currentUserId);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if already following
        if (!currentUser.following.includes(id)) {
            currentUser.following.push(id);
            userToFollow.followers.push(currentUserId);

            await currentUser.save();
            await userToFollow.save();

            res.status(200).json({ message: "User followed successfully" });
        } else {
            res.status(400).json({ message: "Already following this user" });
            console.log("Already following this user");
        }
    } catch (error) {
        res.status(500).json({ message: "Error following user" });
    }
});

router.put('/unfollow/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.body.currentUserId;

        if (currentUserId === id) {
            return res.status(400).json({ message: "You cannot unfollow yourself" });
        }

        const userToUnfollow = await User.findById(id);
        const currentUser = await User.findById(currentUserId);

        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if currently following
        if (currentUser.following.includes(id)) {
            currentUser.following.pull(id);
            userToUnfollow.followers.pull(currentUserId);

            await currentUser.save();
            await userToUnfollow.save();

            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            res.status(400).json({ message: "Not following this user" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error unfollowing user" });
    }
});

export { router as SocialMediaRouter }