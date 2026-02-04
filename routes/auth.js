const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Login Page
router.get('/login', (req, res) => res.render('auth/login'));

// Register Page
router.get('/register', (req, res) => res.render('auth/register'));

// Register Logic
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.render('auth/register', { error_msg: 'Email already exists' });
        }
        
        // Default role is customer. Admin creation should be done via seed or database access.
        const role = 'customer';
        
        const newUser = new User({ name, email, password, role });
        // Password hashing is handled in pre-save hook in User model
        await newUser.save();
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.render('auth/register', { error_msg: 'Server Error' });
    }
});

// Login Logic
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : '';
    console.log(`Login attempt for: '${normalizedEmail}'`);
    
    try {
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            console.log(`User not found for email: '${normalizedEmail}'`);
            return res.render('auth/login', { error_msg: 'Invalid Credentials' });
        }
        
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            console.log(`Password mismatch for user: ${user.email}`);
            return res.render('auth/login', { error_msg: 'Invalid Credentials' });
        }
        
        // simple session handling
        const userSession = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        req.session.user = userSession;
        console.log(`Session set for user: ${user.email} with role: ${user.role}`);

        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.render('auth/login', { error_msg: 'Session Error' });
            }
            if (user.role === 'admin') {
                console.log("Redirecting to /admin");
                res.redirect('/admin');
            } else {
                console.log("Redirecting to /");
                res.redirect('/');
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.render('auth/login', { error_msg: 'Server Error' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.log(err);
        res.redirect('/auth/login');
    });
});

// Forgot Password Page
router.get('/forgot-password', (req, res) => res.render('auth/forgot_password'));

// Forgot Password Logic
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('auth/forgot_password', { error_msg: 'No account with that email found.' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOTP = otp;
        user.resetOTPExpires = Date.now() + 600000; // 10 minutes
        await user.save();

        // Simulate OTP SMS/Email
        console.log(`\n[OTP SIMULATION] To: ${email}\n[OTP SIMULATION] Your 6-digit code is: ${otp}\n`);

        res.render('auth/verify_otp', { email, success_msg: 'A 6-digit OTP has been sent to your email (Check server console).' });
    } catch (err) {
        console.error(err);
        res.render('auth/forgot_password', { error_msg: 'Server Error' });
    }
});

// Verify OTP Page (GET redirect fallback)
router.get('/verify-otp', (req, res) => res.redirect('/auth/forgot-password'));

// Verify OTP Logic
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({
            email,
            resetOTP: otp,
            resetOTPExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.render('auth/verify_otp', { email, error_msg: 'Invalid or expired OTP.' });
        }

        res.render('auth/reset_password', { email });
    } catch (err) {
        console.error(err);
        res.render('auth/forgot_password', { error_msg: 'Server Error' });
    }
});

// Reset Password Logic
router.post('/reset-password', async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.render('auth/reset_password', { email, error_msg: 'Passwords do not match.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('auth/forgot_password', { error_msg: 'User not found.' });
        }

        // Set New Password
        user.password = password; // Pre-save hook will hash it
        user.resetOTP = undefined;
        user.resetOTPExpires = undefined;
        await user.save();

        res.render('auth/login', { success_msg: 'Password has been updated! You can now login.' });
    } catch (err) {
        console.error(err);
        res.render('auth/forgot_password', { error_msg: 'Server Error' });
    }
});

module.exports = router;
