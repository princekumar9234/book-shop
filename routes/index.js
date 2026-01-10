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

module.exports = router;
