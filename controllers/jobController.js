const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs
// @route   GET /jobs
exports.getJobs = async (req, res) => {
    try {
        const { location, category, type } = req.query;
        let query = { status: 'Open' };

        if (location) query.location = new RegExp(location, 'i');
        if (category) query.category = category;
        if (type) query.type = type;

        const jobs = await Job.find(query).sort('-createdAt');
        res.render('jobs/index', { jobs, user: req.session.user });
    } catch (err) {
        res.status(500).render('error', { message: 'Failed to fetch jobs' });
    }
};

// @desc    Get single job
// @route   GET /jobs/:id
exports.getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('employer', 'name');
        if (!job) {
            return res.status(404).render('error', { message: 'Job not found' });
        }
        
        let hasApplied = false;
        if (req.session.user && req.session.user.role === 'job_seeker') {
            const application = await Application.findOne({
                job: req.params.id,
                applicant: req.session.user.id
            });
            if (application) hasApplied = true;
        }

        res.render('jobs/show', { job, user: req.session.user, hasApplied });
    } catch (err) {
        res.status(500).render('error', { message: 'Server Error' });
    }
};

// @desc    Create job
// @route   POST /jobs
exports.createJob = async (req, res) => {
    try {
        req.body.employer = req.session.user.id;
        if (req.body.requirements) {
            req.body.requirements = req.body.requirements.split(',').map(r => r.trim()).filter(r => r !== '');
        } else {
            req.body.requirements = [];
        }
        
        await Job.create(req.body);
        res.redirect('/dashboard');
    } catch (err) {
        res.render('jobs/create', { error: err.message, formData: req.body });
    }
};

// @desc    Update job
// @route   POST /jobs/:id/edit
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job || job.employer.toString() !== req.session.user.id) {
            return res.status(401).render('error', { message: 'Not authorized' });
        }

        if (req.body.requirements) {
            req.body.requirements = req.body.requirements.split(',').map(r => r.trim()).filter(r => r !== '');
        }
        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.redirect('/dashboard');
    } catch (err) {
        res.render('jobs/edit', { error: err.message, job: req.body, jobId: req.params.id });
    }
};

// @desc    Delete job
// @route   POST /jobs/:id/delete
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job || job.employer.toString() !== req.session.user.id) {
            return res.status(401).render('error', { message: 'Not authorized' });
        }

        await job.deleteOne();
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).render('error', { message: 'Failed to delete job' });
    }
};
