const User = require('../models/User');
const bcrypt = require('bcryptjs');

const ensureAdminExists = async () => {
    try {
        const email = 'princechouhan9939@gmail.com';
        const adminPassword = 'PRINCE@18';
        
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
                console.log('Admin user found. Ensuring password is set to requested one...');
                existingAdmin.password = adminPassword; // Pre-save hook will hash it
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('Admin password reset successfully.');
        }
    } catch (err) {
        console.error('Error ensuring admin exists:', err.message);
    }
};

module.exports = ensureAdminExists;
