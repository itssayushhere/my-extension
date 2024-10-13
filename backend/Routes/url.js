import Url from '../Schema/urlSchema.js';
import express from 'express';
import { isAuthenticated } from '../verifyauth.js';
import User from '../Schema/userSchema.js';

const router = express.Router();
// Create a new URL
router.post('/', isAuthenticated, async (req, res) => {
    const { link, nickname, type } = req.body;
    const userId = req.userId; // Get the userId from the authenticated user
    try {
        const newUrl = new Url({ link, nickname, type });
        await newUrl.save();

        await User.findByIdAndUpdate(userId, { $push: { url: newUrl._id } });

        res.status(201).json(newUrl);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
export default router;