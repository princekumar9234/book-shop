const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

router.get('/register', (req, res) => res.render('auth/register', { error: null, formData: {} }));
router.post('/register', register);

router.get('/login', (req, res) => res.render('auth/login', { error: null }));
router.post('/login', login);

router.get('/logout', logout);

module.exports = router;
