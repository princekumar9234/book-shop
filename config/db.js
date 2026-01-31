const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/onlinebookstore';
    
    try {
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        if (mongoURI.includes('localhost') && process.env.NODE_ENV === 'production') {
            console.error('CRITICAL: Attempting to connect to localhost in production!');
        }
        // In production, we might want to exit if DB is essential
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
