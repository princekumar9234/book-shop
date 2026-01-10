try {
    require('dotenv').config();
    const express = require('express');
    const mongoose = require('mongoose');
    const session = require('express-session');
    const MongoStore = require('connect-mongo');
    const methodOverride = require('method-override');
    
    console.log("Imports success");
    
    const User = require('./models/User');
    const Book = require('./models/Book');
    const Cart = require('./models/Cart');
    const Order = require('./models/Order');
    
    console.log("Models success");
    
    require('./routes/index');
    require('./routes/auth');
    require('./routes/books');
    require('./routes/cart');
    require('./routes/orders');
    require('./routes/admin');
    
    console.log("Routes success");

} catch (e) {
    console.error(e);
}
