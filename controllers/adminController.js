const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Admin dashboard
// @route   GET /admin
exports.getAdminDashboard = async (req, res) => {
    try {
        const users = await User.find().sort('-createdAt');
        const jobs = await Job.find().populate('employer', 'name').sort('-createdAt');
        const applications = await Application.find()
            .populate('job', 'title company')
            .populate('applicant', 'name email')
            .sort('-appliedAt');
            
        res.render('dashboard/admin', { users, jobs, applications, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Admin dashboard failed' });
    }
};

// @desc    Delete user
// @route   POST /admin/users/:id/delete
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        res.status(500).render('error', { message: 'Failed to delete user' });
    }
};

// @desc    Seed sample jobs
// @route   POST /admin/seed-jobs
exports.seedJobs = async (req, res) => {
    try {
        const sampleJobs = [
            {
                title: 'Data Scientist',
                company: 'DeepMind Labs',
                location: 'Paris, France',
                type: 'Full-time',
                category: 'Technology',
                salary: '$130k - $180k',
                experience: '3-5 years',
                description: 'Solve complex data problems using advanced machine learning models.',
                requirements: ['Python', 'SQL', 'Deep Learning', 'PyTorch'],
                status: 'Open',
                employer: req.session.user.id
            },
            {
                title: 'Cloud Architect',
                company: 'Sky Solutions',
                location: 'Seattle, USA',
                type: 'Full-time',
                category: 'Technology',
                salary: '$160k - $210k',
                experience: '8+ years',
                description: 'Design and manage scalable cloud infrastructure on AWS and Azure.',
                requirements: ['AWS', 'Terraform', 'Kubernetes', 'BASH'],
                status: 'Open',
                employer: req.session.user.id
            },
            {
                title: 'Executive Assistant',
                company: 'Global Ventures',
                location: 'Singapore',
                type: 'Full-time',
                category: 'Finance',
                salary: '$60k - $80k',
                experience: '2+ years',
                description: 'Provide high-level support to the executive team.',
                requirements: ['Communication', 'Scheduling', 'Office Suite', 'Detail-oriented'],
                status: 'Open',
                employer: req.session.user.id
            }
        ];

        await Job.insertMany(sampleJobs);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Failed to seed jobs' });
    }
};
