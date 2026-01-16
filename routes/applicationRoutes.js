const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { applyToJob, getJobApplications, updateStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// File Filter (Only PDF)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF resumes are allowed!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/:jobId', protect, authorize('job_seeker'), upload.single('resume'), applyToJob);
router.get('/job/:jobId', protect, authorize('employer', 'admin'), getJobApplications);
router.post('/:id/status', protect, authorize('employer', 'admin'), updateStatus);

module.exports = router;
