const mongoose = require('mongoose');
const User = require('./models/User');
const fs = require('fs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/onlinebookstore')
    .then(async () => {
        try {
            console.log('Connected.');
            const admin = new User({
                name: 'Admin',
                email: 'test@admin.com',
                password: 'password',
                role: 'admin'
            });
            console.log('User created in memory');
            await admin.save();
            console.log('User saved');
            process.exit(0);
        } catch (e) {
            console.log('ERROR:', e.message);
            fs.writeFileSync('debug_error.txt', e.toString());
            process.exit(1);
        }
    })
    .catch(e => {
        console.log('CONN ERROR:', e.message);
        process.exit(1);
    });
