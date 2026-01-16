const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/create', protect, authorize('employer', 'admin'), (req, res) => res.render('jobs/create', { error: null, formData: {} }));
router.post('/', protect, authorize('employer', 'admin'), createJob);

router.get('/:id', getJob);
router.get('/:id/edit', protect, authorize('employer', 'admin'), async (req, res) => {
    const Job = require('../models/Job');
    const job = await Job.findById(req.params.id);
    res.render('jobs/edit', { error: null, job, jobId: req.params.id });
});
router.post('/:id/edit', protect, authorize('employer', 'admin'), updateJob);
router.post('/:id/delete', protect, authorize('employer', 'admin'), deleteJob);

module.exports = router;
