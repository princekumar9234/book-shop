const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Book = require('../models/Book');
const { ensureAuthenticated } = require('../middleware/auth');

// View Cart
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.session.user.id }).populate('items.book');
        if (!cart) {
            cart = { items: [], total: 0 };
        }
        
        // Calculate total manually since it's not stored
        let total = 0;
        if (cart.items) {
           cart.items.forEach(item => {
               total += item.quantity * item.book.price;
           });
        }
        
        res.render('cart/index', { cart, total });
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Server Error' });
    }
});

// Add to Cart
router.post('/add', ensureAuthenticated, async (req, res) => {
    const { bookId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.session.user.id });
        if (!cart) {
            cart = new Cart({ user: req.session.user.id, items: [] });
        }
        
        const existingItem = cart.items.find(item => item.book.toString() === bookId);
        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
        } else {
            cart.items.push({ book: bookId, quantity: parseInt(quantity) });
        }
        
        await cart.save();
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.redirect('/books/' + bookId); // Redirect back on error
    }
});

// Update Cart Quantity
router.post('/update', ensureAuthenticated, async (req, res) => {
    const { itemId, quantity } = req.body; // itemId here refers to the bookId usually or the subdocument id
    // Logic might differ depending on how form is sent. Assuming itemId is bookId for simplicity or subdoc id
    // Actually, usually easier to use bookId if unique in cart
    try {
        let cart = await Cart.findOne({ user: req.session.user.id });
        if (cart) {
           const item = cart.items.find(item => item._id.toString() === itemId || item.book.toString() === itemId);
           if (item) {
               item.quantity = parseInt(quantity);
               if (item.quantity <= 0) {
                   cart.items = cart.items.filter(i => i !== item);
               }
           }
           await cart.save();
        }
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.redirect('/cart');
    }
});

// Remove from Cart
router.post('/remove', ensureAuthenticated, async (req, res) => {
    const { itemId } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.session.user.id });
        if (cart) {
            cart.items = cart.items.filter(item => item._id.toString() !== itemId && item.book.toString() !== itemId);
            await cart.save();
        }
        res.redirect('/cart');
    } catch (err) {
         console.error(err);
         res.redirect('/cart');
    }
});

module.exports = router;
