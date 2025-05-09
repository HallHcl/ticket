const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ฟังก์ชันสุ่ม ID ที่ไม่ซ้ำ
async function generateUniqueId() {
    let id;
    let exists = true;

    while (exists) {
        id = Math.floor(Math.random() * 900000) + 100000; // สุ่ม 6 หลัก
        const user = await User.findOne({ id });
        if (!user) exists = false;
    }

    return id;
}

// Register route
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newId = await generateUniqueId(); // สร้าง id ใหม่แบบไม่ซ้ำ

        const newUser = new User({ id: newId, username, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', id: newId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // ✅ Update lastLogin
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
            {
                id: user._id,
                userId: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            token,
            user: {
                userId: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});



module.exports = router;
