require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(async () => {
        console.log("Connected to MongoDB...");
        const users = await User.find({});
        
        console.log("\n--- USER LIST ---");
        if (users.length === 0) {
            console.log("No users found in database.");
        } else {
            users.forEach(user => {
                console.log(`Name: ${user.name}`);
                console.log(`Email: ${user.email}`);
                console.log(`Role: ${user.role}`);
                console.log(`Password (Hashed): ${user.password.substring(0, 20)}...`);
                console.log("-------------------");
            });
        }
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
