const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Home Page
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().limit(6).sort({ createdAt: -1 });
        res.render('index', { books });
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Server Error' });
    }
});

const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Debug Route request handler
router.get('/debug-admin', async (req, res) => {
    try {
        const email = 'princechouhan9939@gmail.com';
        const user = await User.findOne({ email });
        
        let status = {
            message: "Debug Admin Check",
            db_connected: true,
            email_searched: email,
            user_found: !!user,
            environment: process.env.NODE_ENV || 'development'
        };

        if (user) {
            status.role = user.role;
            status.password_hash_exists = !!user.password;
            
            // Check default password '2008'
            const isMatch = await bcrypt.compare('2008', user.password);
            status.password_matches_2008 = isMatch;
        }

        res.json(status);
    } catch (err) {
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

module.exports = router;
