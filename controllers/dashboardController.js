const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    User dashboard
// @route   GET /dashboard
exports.getDashboard = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const user = await User.findById(userId); // Fetch full user with profile

        if (user.role === 'employer') {
            const jobs = await Job.find({ employer: user.id }).sort('-createdAt');
            // Get application counts for each job
            const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
                const count = await Application.countDocuments({ job: job._id });
                return { ...job._doc, applicantCount: count };
            }));
            res.render('dashboard/employer', { user, jobs: jobsWithCounts });
        } else {
            const applications = await Application.find({ applicant: user.id })
                .populate('job')
                .sort('-appliedAt');
            res.render('dashboard/seeker', { user, applications });
        }
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Dashboard failed to load' });
    }
};

// @desc    Get profile page
// @route   GET /dashboard/profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        res.render('dashboard/profile', { user });
    } catch (err) {
        res.status(500).render('error', { message: 'Profile failed to load' });
    }
};

// @desc    Update profile
// @route   POST /dashboard/profile
exports.updateProfile = async (req, res) => {
    try {
        const { bio, experience, education, skills } = req.body;
        const profileFields = {
            'profile.bio': bio,
            'profile.experience': experience,
            'profile.education': education,
            'profile.skills': skills ? skills.split(',').map(s => s.trim()).filter(s => s !== '') : []
        };

        if (req.file) {
            profileFields['profile.resume'] = req.file.filename;
        }

        await User.findByIdAndUpdate(req.session.user.id, { $set: profileFields });
        res.redirect('/dashboard/profile');
    } catch (err) {
        res.status(500).render('error', { message: 'Update failed' });
    }
};
