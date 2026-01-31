const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { ensureAuthenticated } = require('../middleware/auth');

// Checkout Page
router.get('/checkout', ensureAuthenticated, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.session.user.id }).populate('items.book');
        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart');
        }
        
        let total = 0;
        cart.items.forEach(item => {
            total += item.quantity * item.book.price;
        });

        res.render('orders/checkout', { cart, total });
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Server Error' });
    }
});

// Place Order
router.post('/place', ensureAuthenticated, async (req, res) => {
    const { shippingAddress } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.session.user.id }).populate('items.book');
        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart');
        }

        let totalAmount = 0;
        const orderItems = cart.items.map(item => {
            totalAmount += item.quantity * item.book.price;
            return {
                book: item.book._id,
                quantity: item.quantity,
                price: item.book.price
            };
        });

        const newOrder = new Order({
            user: req.session.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress
        });

        await newOrder.save();
        
        // Clear Cart
        cart.items = [];
        await cart.save();

        res.render('orders/success', { orderId: newOrder._id });
    } catch (err) {
        console.error(err);
        res.redirect('/orders/checkout');
    }
});

// Order History
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.session.user.id }).sort({ createdAt: -1 });
        res.render('orders/index', { orders });
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Server Error' });
    }
});

module.exports = router;
