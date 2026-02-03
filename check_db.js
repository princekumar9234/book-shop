require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
console.log("Testing connection to:", uri.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

mongoose.connect(uri)
    .then(() => {
        console.log("Successfully connected to MongoDB Atlas!");
        process.exit(0);
    })
    .catch(err => {
        console.error("Connection failed:", err.message);
        console.error("Full error:", err);
        process.exit(1);
    });
