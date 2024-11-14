import express from "express";
import { User } from "../Model/User.js";
import { Profile } from '../Model/Profile.js';

const router = express.Router();

router.put('/users/:id', async (req, res) => {
    const { description, name, profilePicture, interestedTopics, role, dateOfBirth, gender, introduction, github, linkedin, twitter } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profileData = {
            userId: user._id,
            name,
            email: user.email,
            description,
            profilePicture,
            interestedTopics,
            role,
            dateOfBirth,
            gender,
            introduction,
            github,
            linkedin,
            twitter,
        };

        const profile = await Profile.findOneAndUpdate(
            { userId: user._id },
            profileData,
            { new: true, upsert: true }
        );

        user.profileCompleted = true;
        await user.save();

        res.json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile', error });
    }
});
router.get('/fetch/:userId', async (req, res) => {
    try {
        const user = await Profile.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

router.get('/friend/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const users = await Profile.find({ userId: { $ne: userId } });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export { router as ProfileRouter };
