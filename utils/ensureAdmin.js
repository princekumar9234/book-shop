const User = require('../models/User');
const bcrypt = require('bcryptjs');

const ensureAdminExists = async () => {
    try {
        const email = 'princechouhan9939@gmail.com';
        const adminPassword = '2008';
        
        const existingAdmin = await User.findOne({ email });
        
        if (!existingAdmin) {
            console.log('Admin user not found. Creating default admin...');
            const newAdmin = new User({
                name: 'Admin User',
                email: email,
                password: adminPassword,
                role: 'admin'
            });
            await newAdmin.save();
            console.log('Default Admin created successfully.');
        } else {
            console.log('Admin user check: Found.');
            // Optional: Check if role is correct
            if (existingAdmin.role !== 'admin') {
                 existingAdmin.role = 'admin';
                 await existingAdmin.save();
                 console.log('Fixed Admin Role.');
            }
        }
    } catch (err) {
        console.error('Error ensuring admin exists:', err.message);
    }
};

module.exports = ensureAdminExists;
