const mongoose = require('mongoose');

const localUri = 'mongodb://127.0.0.1:27017/onlinebookstore';

console.log("Testing connection to local MongoDB...");

mongoose.connect(localUri)
    .then(() => {
        console.log("Success! Connected to local MongoDB.");
        process.exit(0);
    })
    .catch(err => {
        console.log("Could not connect to local MongoDB.");
        console.log("Error:", err.message);
        process.exit(1);
    });
