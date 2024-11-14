import express from 'express';
import { Blog } from '../Model/Blog.js';
import { User } from '../Model/User.js';
import { Profile } from '../Model/Profile.js';

const router = express.Router();

router.post('/blog-posts/:id', async (req, res) => {
    const { title, content, interestedTopics } = req.body;

    try {
        const user = await User.findById(req.params.id);
        const blogPost = new Blog({
            userId: user._id,
            title,
            content,
            interestedTopics,
        });

        await blogPost.save();
        res.status(201).json({ message: 'Blog post created successfully' });
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/blogFetch/:id', async (req, res) => {
    try {
        const blogPosts = await Blog.find({ userId: req.params.id });
        res.status(200).json(blogPosts);
    } catch (error) {
        console.error('Error getting blog posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/blog/:id', async (req, res) => {
    try {
        const blogPost = await Blog.findById(req.params.id);
        res.status(200).json(blogPost);
    } catch (error) {
        console.error('Error getting blog post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/blog', async (req, res) => {
    try {
        const blogPosts = await Blog.find();
        res.status(200).json(blogPosts);
    } catch (error) {
        console.error('Error getting blog posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/userData/:id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.params.id });
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/blog/:id/increment-view', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        blog.view += 1;
        await blog.save();

        res.status(200).json({ message: "View count incremented" });
    } catch (error) {
        res.status(500).json({ message: "Error incrementing view count" });
    }
})


export { router as blog };


