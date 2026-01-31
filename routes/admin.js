const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Order = require('../models/Order');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// Multer Storage Configuration
const fs = require('fs');
const uploadDir = './public/uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
}).single('image');

// Apply Admin Check to all routes
router.use(ensureAuthenticated);
router.use(ensureAdmin);

// Dashboard
router.get('/', async (req, res) => {
    try {
        const bookCount = await Book.countDocuments();
        const orderCount = await Order.countDocuments();
        const userCount = await User.countDocuments();
        res.render('admin/dashboard', { bookCount, orderCount, userCount });
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Admin Error' });
    }
});

// Manage Books
router.get('/books', async (req, res) => {
    const books = await Book.find();
    res.render('admin/books', { books });
});

router.get('/books/add', (req, res) => {
    res.render('admin/add_book');
});

router.post('/books', upload, async (req, res) => {
    const body = req.body || {};
    const { title, author, description, price, category, stock } = body;
    
    if (!title) {
        return res.render('admin/add_book', { error: 'Required fields missing. Ensure form is multipart/form-data.' });
    }

    const image = req.file ? '/uploads/' + req.file.filename : '';

    try {
        const newBook = new Book({
            title, author, description, price, category, stock, image
        });
        await newBook.save();
        res.redirect('/admin/books');
    } catch (err) {
        console.error('DB Save Error:', err);
        res.render('admin/add_book', { error: 'Error adding book to database' });
    }
});

router.get('/books/edit/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render('admin/edit_book', { book });
});

router.put('/books/:id', upload, async (req, res) => {
    try {
        const body = req.body || {};
        const updateData = { ...body };
        if (req.file) {
            updateData.image = '/uploads/' + req.file.filename;
        }
        await Book.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/admin/books');
    } catch (err) {
        console.error('Update Error:', err);
        res.redirect('/admin/books');
    }
});

router.delete('/books/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect('/admin/books');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/books');
    }
});

// Manage Orders
router.get('/orders', async (req, res) => {
    const orders = await Order.find().populate('user', 'name email');
    res.render('admin/orders', { orders });
});

router.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.book');
        
        if (!order) {
            return res.render('error', { error: 'Order not found' });
        }
        
        res.render('admin/order_details', { order });
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Server Error' });
    }
});

router.put('/orders/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }).populate('user');
        
        // Simulating SMS Notification
        if (order && order.user) {
            console.log(`[SMS SIMULATION] To: ${order.user.name}, Message: Your order #${order._id} status has been updated to: ${status}.`);
        }
        
        res.redirect(`/admin/orders/${req.params.id}`);
    } catch (err) {
        console.error(err);
         res.redirect('/admin/orders');
    }
});

module.exports = router;
