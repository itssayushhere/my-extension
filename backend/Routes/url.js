import Url from '../Schema/urlSchema.js';
import express from 'express';
import { isAuthenticated } from '../verifyauth.js';
import User from '../Schema/userSchema.js';

const router = express.Router();
// Create a new URL
router.post('/', isAuthenticated, async (req, res) => {
    const { link, nickname, tab } = req.body;
    const userId = req.userId; 
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const newUrl = new Url({ link, nickname, tab });
        await newUrl.save();
        user.url.push(newUrl._id);
        await user.save();
        res.status(201).json(newUrl);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
export default router;