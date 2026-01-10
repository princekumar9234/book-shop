require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const methodOverride = require('method-override');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Session Config
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secretkey',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/onlinebookstore' }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
    })
);

// View Engine
app.set('view engine', 'ejs');

// Global Variables (for middleware/templates)
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success_msg = null; // Add flash message logic if needed
    res.locals.error_msg = null;
    // In a real app, use connect-flash for messages
    next();
});

// Routes (Placeholders for now)
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/books', require('./routes/books'));
app.use('/cart', require('./routes/cart'));
app.use('/orders', require('./routes/orders'));
app.use('/admin', require('./routes/admin'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
