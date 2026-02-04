const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/onlinebookstore')
    .then(async () => {
        console.log('Connected to DB for Admin Check');
        
        const email = 'princechouhan9939@gmail.com';
        try {
            let admin = await User.findOne({ email });

            if (!admin) {
                console.log('Admin not found. Creating...');
                admin = new User({
                    name: 'Admin User',
                    email: email,
                    password: '2008',
                    role: 'admin'
                });
                await admin.save();
                console.log('Admin created successfully.');
            } else {
                console.log('Admin already exists.');
                admin.password = '2008';
                await admin.save();
                console.log('Admin password reset.');
            }
            process.exit(0);
        } catch (innerErr) {
            console.error("INNER ERROR:", innerErr);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error("CONNECTION ERROR:", err);
        process.exit(1);
    });
