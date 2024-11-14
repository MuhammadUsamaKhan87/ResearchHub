import express from 'express'
import { Document } from '../Model/Document.js'

const router = express.Router()

// Get all documents
router.get('/documentfetch', async (req, res) => {
    try {
        const documents = await Document.find()
        res.json(documents)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get  document according to userId
router.get('/documentfetch/:id', async (req, res) => {
    try {
        const documents = await Document.find({ userId: req.params.id })
        res.json(documents)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// put api that can change the value of like dislike and download
router.put('/document/:id', async (req, res) => {
    const { likes, dislikes, download } = req.body;
    try {
        const document = await Document.findByIdAndUpdate(req.params.id, { likes, dislikes, download }, { new: true });
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update like count' });
    }
});

router.delete('/document/delete/:id', async (req, res) => {
    try {
        const document = await Document.findByIdAndDelete(req.params.id);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete document' });
    }
});

router.put('/document/like/:docId', async (req, res) => {
    const { docId } = req.params;
    const { userId } = req.body;

    try {
        const doc = await Document.findById(docId);
        if (doc.usersDisliked.includes(userId)) {
            // Remove from dislikes if previously disliked
            doc.usersDisliked = doc.usersDisliked.filter(id => id.toString() !== userId);
            doc.dislikes -= 1;
        }

        if (!doc.usersLiked.includes(userId)) {
            doc.usersLiked.push(userId);
            doc.likes += 1;
        }

        await doc.save();
        res.status(200).json(doc);
    } catch (error) {
        res.status(500).json({ message: 'Error liking document' });
    }
});

// Undo like
router.put('/document/undolike/:docId', async (req, res) => {
    const { docId } = req.params;
    const { userId } = req.body;

    try {
        const doc = await Document.findById(docId);
        doc.usersLiked = doc.usersLiked.filter(id => id.toString() !== userId);
        doc.likes -= 1;

        await doc.save();
        res.status(200).json(doc);
    } catch (error) {
        res.status(500).json({ message: 'Error undoing like' });
    }
});

// Adding a dislike to the document
router.put('/document/dislike/:docId', async (req, res) => {
    const { docId } = req.params;
    const { userId } = req.body;

    try {
        const doc = await Document.findById(docId);
        if (doc.usersLiked.includes(userId)) {
            // Remove from likes if previously liked
            doc.usersLiked = doc.usersLiked.filter(id => id.toString() !== userId);
            doc.likes -= 1;
        }

        if (!doc.usersDisliked.includes(userId)) {
            doc.usersDisliked.push(userId);
            doc.dislikes += 1;
        }

        await doc.save();
        res.status(200).json(doc);
    } catch (error) {
        res.status(500).json({ message: 'Error disliking document' });
    }
});

// Undo dislike
router.put('/document/undodislike/:docId', async (req, res) => {
    const { docId } = req.params;
    const { userId } = req.body;

    try {
        const doc = await Document.findById(docId);
        doc.usersDisliked = doc.usersDisliked.filter(id => id.toString() !== userId);
        doc.dislikes -= 1;

        await doc.save();
        res.status(200).json(doc);
    } catch (error) {
        res.status(500).json({ message: 'Error undoing dislike' });
    }
});

export { router as documentRouter }