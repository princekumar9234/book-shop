const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Apply for a job
// @route   POST /applications/:jobId
exports.applyToJob = async (req, res) => {
    try {
        if (!req.file) {
            const job = await Job.findById(req.params.jobId);
            return res.render('jobs/show', { 
                job, 
                user: req.session.user, 
                error: 'Please upload a resume (PDF)',
                hasApplied: false
            });
        }

        const existingApplication = await Application.findOne({
            job: req.params.jobId,
            applicant: req.session.user.id
        });

        if (existingApplication) {
            return res.redirect('/dashboard');
        }

        await Application.create({
            job: req.params.jobId,
            applicant: req.session.user.id,
            resume: req.file.filename
        });

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Application failed' });
    }
};

// @desc    Get job applications for employer
// @route   GET /applications/job/:jobId
exports.getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job || job.employer.toString() !== req.session.user.id) {
            return res.status(401).render('error', { message: 'Not authorized' });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email');

        res.render('dashboard/applicants', { applications, job, user: req.session.user });
    } catch (err) {
        res.status(500).render('error', { message: 'Server Error' });
    }
};

// @desc    Update application status
// @route   POST /applications/:id/status
exports.updateStatus = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('job');
        
        if (!application) {
            return res.status(404).render('error', { message: 'Application not found' });
        }

        // Allow if employer of the job OR admin
        const isEmployer = application.job.employer.toString() === req.session.user.id;
        const isAdmin = req.session.user.role === 'admin';

        if (!isEmployer && !isAdmin) {
            return res.status(401).render('error', { message: 'Not authorized' });
        }

        application.status = req.body.status;
        await application.save();

        // Redirect based on role
        if (isAdmin) {
            return res.redirect('/admin');
        }

        res.redirect(`/applications/job/${application.job._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Update failed' });
    }
};
