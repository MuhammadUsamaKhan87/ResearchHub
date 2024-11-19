import express from "express";
import { User } from "../Model/User.js";
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import { sendVerificationEmail } from '../utils/Sendemail.js'
import { sendResetPasswordEmail } from '../utils/Sendemail.js'

const router = express.Router()

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: 'User Already exist' });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationCode = crypto.randomBytes(4).toString('hex');
        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationCode
        })
        await user.save();
        await sendVerificationEmail(email, verificationCode);
        res.status(201).json({ id: user._id, message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})
router.post('/verify', async (req, res) => {
    const { email, verificationCode } = req.body;
    if (!email || !verificationCode) {
        return res.status(400).json({ message: 'Email and verification code are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        // Mark user as verified (you can add a `isVerified` field to your schema if needed)
        user.verificationCode = null;
        user.isVerify = true;
        await user.save();

        res.status(200).json({ message: 'User verified successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/user/:id', async (req, res) => {
    try {
        console.log(`Fetching user with ID: ${req.params.id}`);
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "invalid credentials" })
        }

        const match = await bcryptjs.compare(password, user.password)
        if (!match) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token, profileCompleted: user.profileCompleted, id: user._id, message: `User Sccuessfully LogIn ${user.name}` });

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await sendResetPasswordEmail(email, user._id);
        res.status(200).json({ message: 'Reset link has been sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending reset email' });
    }
});

router.post('/reset-password/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        // Find the user by ID and update the password
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password has been successfully reset" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password" });
    }
});

router.get('/fetchUsers', async (req, res) => {
    const { name } = req.query;
    try {
        const users = await User.find({
            name: { $regex: name, $options: 'i' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

export { router as authRouter }