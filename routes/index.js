const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// @desc    Landing page
// @route   GET /
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'Open' }).sort('-createdAt').limit(6);
        res.render('index', { jobs });
    } catch (err) {
        res.status(500).render('error', { message: 'Server Error' });
    }
});

module.exports = router;
