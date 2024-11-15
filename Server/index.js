import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import multer from 'multer'
import bodyParser from 'body-parser';
import { authRouter } from './Router/UserAuth.js'
import { ProfileRouter } from './Router/Profile.js'
import { documentRouter } from './Router/Document.js'
import { Document } from './Model/Document.js'
import { User } from './Model/User.js'
import { blog } from './Router/Blog.js'
import { SocialMediaRouter } from './Router/SocialMedia.js'
import path from 'path';
import { fileURLToPath } from 'url';
import sanitize from 'sanitize-filename';
import { Profile } from './Model/Profile.js'
import { Discussion } from './Model/Discussion.js'
import { discussionRouter } from './Router/Discussion.js'
import { commentRouter } from './Router/Comment.js'

dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
app.use(express.json())
app.use(express.static('upload'))
app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

mongoose.connect(process.env.URL,)
    .then(() => { console.log('MongoDB connected successfully'); })
    .catch((err) => { console.error('MongoDB connection failed:', err.message); });

app.use('/api', authRouter)
app.use('/api', ProfileRouter)
app.use('/api', documentRouter)
app.use('/api', blog)
app.use('/api', SocialMediaRouter)
app.use('/api', discussionRouter)
app.use('/api', commentRouter)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Filename will be unique
    }
});
const upload = multer({ storage: storage });

app.post('/upload/:id', upload.single('profilePicture'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ imageUrl: `/${req.file.filename}` });
});
app.put('/api/user/:id/profile-picture', upload.single('profilePicture'), async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Profile.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.profilePicture) {
            const oldProfilePicturePath = path.join(__dirname, 'uploads/profile_pictures', user.profilePicture);
            fs.unlinkSync(oldProfilePicturePath); // Delete the old file
        }
        user.profilePicture = req.file.filename;
        await user.save();

        res.status(200).json({
            message: 'Profile picture updated successfully',
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
app.post('/api/documents/:id', upload.single('file'), async (req, res) => {
    const { title, description, author, relatedFields } = req.body;
    const filePath = req.file ? req.file.path : null;
    const parsedRelatedFields = JSON.parse(relatedFields);
    try {
        const user = await User.findById(req.params.id)
        const newDocument = new Document({
            userId: user._id,
            title,
            file: req.file.filename,
            description,
            author,
            relatedField: parsedRelatedFields,
            data: filePath
        });
        await newDocument.save();
        res.status(201).json({ message: 'Document uploaded successfully!' });
    } catch (error) {
        console.error('Error saving document:', error);
        res.status(500).json({ error: 'Failed to upload document' });
    }
});
app.post('/blog-posts', upload.fields([{ name: 'images' }, { name: 'videos' }]), async (req, res) => {
    try {
        const { title, content, relatedFields } = req.body;
        const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
        const videos = req.files['videos'] ? req.files['videos'].map(file => file.path) : [];
        const blogPost = new Blog({
            title,
            content,
            relatedFields: relatedFields ? relatedFields.split(',') : [],
            images,
            videos,
        });
        await blogPost.save();
        res.status(201).json({ message: 'Blog post created successfully', blogPost });
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/download/:id', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const sanitizedFileName = sanitize(document.file);
        const filePath = path.join(__dirname, '/upload', sanitizedFileName);

        res.download(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                if (!res.headersSent) {
                    res.status(500).json({ message: 'Error downloading the file', error: err.message });
                }
            }
        });
    } catch (error) {
        console.error('Error during file download:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error downloading the file', error: error.message });
        }
    }
});

app.post('/create/:id', upload.single('file'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { title, description, tags } = req.body;
        const fileUrl = req.file ? req.file.path : null;
        const tagsArray = JSON.parse(tags);

        const newDiscussion = new Discussion({
            title,
            description,
            tags: tagsArray,
            fileUrl,
            userId: req.params.id,
        });

        await newDiscussion.save();

        res.status(201).json({ message: 'Discussion created successfully', discussion: newDiscussion });
    } catch (error) {
        res.status(500).json({ message: 'Error creating discussion', error: error.message });
    }
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
