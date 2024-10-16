import express from 'express';
import User from '../Schema/userSchema.js';
import { isAuthenticated } from '../verifyauth.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Create a new user
router.post('/register', async (req, res) => { 
    const { username, name, email, password } = req.body;
    try {
        if(!username || !name || !email || !password) return res.status(400).json({ message: "All fields are required" });
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: "Email already exists" });
        const existingUsername = await User.findOne({ username });
        if (existingUsername) return res.status(400).json({ message: "Username already exists" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User created successfully"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;
    try {
        const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
        if (!user) return res.status(404).json({ message: "Email or username doesn't exist" });

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Create a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' });
        res.status(200).json({ token, name: user.name, username: user.username , email:user.email , tabs : user.tabs});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all users
router.get('/all', async (req, res) => { 
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a user by ID
router.get('/details', isAuthenticated, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId).populate('url').select('-password').select('-tabs');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a user by ID
router.put('/', isAuthenticated, async (req, res) => { 
    const userId = req.userId;
    console.log(userId);
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a user by ID
router.delete('/', isAuthenticated, async (req, res) => { 
    const userId = req.userId;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
