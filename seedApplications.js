const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');
const Application = require('./models/Application');
const dotenv = require('dotenv');

dotenv.config();

const seedApplications = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for application seeding...');

        const seeker = await User.findOne({ role: 'job_seeker' });
        if (!seeker) {
            console.error('No job seeker found. Please register as a seeker first!');
            process.exit(1);
        }

        const jobs = await Job.find({ status: 'Open' }).limit(3);
        if (jobs.length === 0) {
            console.error('No open jobs found. Please run seedJobs.js first!');
            process.exit(1);
        }

        const appsData = jobs.map(job => ({
            job: job._id,
            applicant: seeker._id,
            resume: 'resume-sample.pdf',
            status: 'Pending'
        }));

        // Delete existing apps for this seeker to avoid duplicates for the demo
        await Application.deleteMany({ applicant: seeker._id });
        
        await Application.insertMany(appsData);
        console.log(`${appsData.length} applications seeded for seeker: ${seeker.name}`);
        process.exit();
    } catch (err) {
        console.error('Error seeding applications:', err.message);
        process.exit(1);
    }
};

seedApplications();
