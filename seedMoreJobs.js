const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const moreJobs = [
    {
        title: 'Machine Learning Engineer',
        company: 'AI Research Lab',
        location: 'Toronto, Canada',
        type: 'Full-time',
        category: 'Technology',
        salary: '$140k - $190k',
        experience: '4+ years',
        description: 'Work on cutting edge LLM fine-tuning and computer vision models.',
        requirements: ['Python', 'PyTorch', 'NLP', 'TensorFlow', 'Scikit-learn'],
        status: 'Open'
    },
    {
        title: 'Project Manager',
        company: 'Skyline Construction',
        location: 'Dubai, UAE',
        type: 'Full-time',
        category: 'Finance',
        salary: '$100k - $130k',
        experience: '5+ years',
        description: 'Oversee multi-million dollar construction projects from planning to execution.',
        requirements: ['PMP Certification', 'Budgeting', 'Risk Management', 'Leadership'],
        status: 'Open'
    },
    {
        title: 'Security Operations Analyst',
        company: 'SecureNet Defenders',
        location: 'Remote',
        type: 'Full-time',
        category: 'Technology',
        salary: '$90k - $120k',
        experience: '2-4 years',
        description: 'Monitor network logs and respond to security incidents in real-time.',
        requirements: ['SIEM', 'Firewalls', 'Incident Response', 'Network Security'],
        status: 'Open'
    },
    {
        title: 'Creative Art Director',
        company: 'Vogue Media',
        location: 'Milan, Italy',
        type: 'Full-time',
        category: 'Design',
        salary: '€80k - €110k',
        experience: '7+ years',
        description: 'Lead the visual direction for our fashion campaigns and digital presence.',
        requirements: ['Art Direction', 'Typography', 'Visual Identity', 'Team Leadership'],
        status: 'Open'
    }
];

const seedMoreJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const employer = await User.findOne({ role: { $in: ['employer', 'admin'] } });
        const jobsWithEmployer = moreJobs.map(job => ({ ...job, employer: employer._id }));
        await Job.insertMany(jobsWithEmployer);
        console.log(`${moreJobs.length} more jobs added!`);
        process.exit();
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

seedMoreJobs();
