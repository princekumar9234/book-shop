const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Book = require('./models/Book');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/onlinebookstore')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.log(err));

const seedData = async () => {
    try {
        await User.deleteMany();
        await Book.deleteMany();

        // Create Admin
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123', // Will be hashed by pre-save hook
            role: 'admin'
        });
        await adminUser.save();

        // Create Customer
        const customerUser = new User({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123', 
            role: 'customer'
        });
        await customerUser.save();

        // Create Books
        const books = [
            {
                title: 'Clean Code',
                author: 'Robert C. Martin',
                description: 'A Handbook of Agile Software Craftsmanship.',
                price: 35.00,
                category: 'Programming',
                stock: 10,
                image: 'https://images-na.ssl-images-amazon.com/images/I/41jEbK-jG+L._SX374_BO1,204,203,200_.jpg'
            },
            {
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                description: 'The story of the mysteriously wealthy Jay Gatsby.',
                price: 15.00,
                category: 'Fiction',
                stock: 20,
                image: 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781524879761/the-great-gatsby-9781524879761_hr.jpg'
            },
            {
                title: 'JavaScript: The Good Parts',
                author: 'Douglas Crockford',
                description: 'Unearthing the texture of the JavaScript language.',
                price: 25.00,
                category: 'Programming',
                stock: 5,
                image: 'https://images-na.ssl-images-amazon.com/images/I/5131OWtQRaL._SX381_BO1,204,203,200_.jpg'
            }
        ];

        await Book.insertMany(books);

        console.log('Data Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
