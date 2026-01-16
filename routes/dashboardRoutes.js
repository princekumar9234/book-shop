const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getDashboard, getProfile, updateProfile } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', protect, getDashboard);
router.get('/profile', protect, getProfile);
router.post('/profile', protect, upload.single('resume'), updateProfile);

module.exports = router;
