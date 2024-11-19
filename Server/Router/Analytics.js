import express from 'express'
import { Blog } from '../Model/Blog.js'
import { Document } from '../Model/Document.js'
import { Discussion } from '../Model/Discussion.js'
import { User } from '../Model/User.js'
import { BlogComment } from '../Model/BlogComment.js'
import Comment from '../Model/Comment.js'

const router = express.Router()

router.get('/analytics/:id', async (req, res) => {

    try {
        const blog = await Blog.find({ userId: req.params.id })
        const document = await Document.find({ userId: req.params.id })
        const discussion = await Discussion.find({ userId: req.params.id })
        const user = await User.findById(req.params.id)
        const blogComment = await BlogComment.find({ userId: req.params.id })
        const comment = await Comment.find({ userId: req.params.id })
        res.json({ user, blog, document, discussion, blogComment, comment })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export { router as AnalyticsRouter }
