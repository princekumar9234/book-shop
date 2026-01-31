const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// All Books with Search
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }
        if (req.query.category) {
            query.category = req.query.category;
        }
        const books = await Book.find(query);
        const categories = await Book.distinct('category');
        res.render('books/index', { books, categories, search: req.query.search || '' });
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Server Error' });
    }
});

// Book Details
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.render('error', { error: 'Book not found' });
        res.render('books/details', { book });
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Server Error' });
    }
});

module.exports = router;
