const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const jobsData = [
    {
        title: 'Senior Frontend Developer',
        company: 'TechFlow Solutions',
        location: 'Remote',
        type: 'Full-time',
        category: 'Technology',
        salary: '$120k - $150k',
        experience: '5+ years',
        description: 'We are looking for a Senior Frontend Developer with expertise in React and modern CSS. You will be responsible for building premium user interfaces and leading a team of developers.',
        requirements: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Redux'],
        status: 'Open'
    },
    {
        title: 'Backend Engineer (Node.js)',
        company: 'DataStream Core',
        location: 'New York, USA',
        type: 'Full-time',
        category: 'Technology',
        salary: '$130k - $160k',
        experience: '3-5 years',
        description: 'Join our backend team to build scalable APIs and microservices. Experience with Node.js, Express, and MongoDB is a must.',
        requirements: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker'],
        status: 'Open'
    },
    {
        title: 'UI/UX Designer',
        company: 'Creative Pixel',
        location: 'London, UK',
        type: 'Contract',
        category: 'Design',
        salary: '£400 - £600 / day',
        experience: '3+ years',
        description: 'Looking for a designer who understands glassmorphism and modern web aesthetics. Work on exciting projects for international clients.',
        requirements: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        status: 'Open'
    },
    {
        title: 'Digital Marketing Manager',
        company: 'Growth Rocket',
        location: 'Remote',
        type: 'Full-time',
        category: 'Marketing',
        salary: '$80k - $100k',
        experience: '4+ years',
        description: 'Help us scale our SaaS product through SEO, SEM, and content marketing strategies.',
        requirements: ['Google Ads', 'SEO', 'Content Strategy', 'Analytics'],
        status: 'Open'
    },
    {
        title: 'Full Stack Intern',
        company: 'StartUp Lab',
        location: 'San Francisco, CA',
        type: 'Internship',
        category: 'Technology',
        salary: '$3000 / month',
        experience: 'Entry level',
        description: 'Exciting opportunity for students or fresh graduates to learn MERN stack in a fast-paced environment.',
        requirements: ['JavaScript', 'HTML/CSS', 'Basic React', 'Passion for Learning'],
        status: 'Open'
    },
    {
        title: 'Finance Analyst',
        company: 'Global Capital',
        location: 'Paris, France',
        type: 'Full-time',
        category: 'Finance',
        salary: '€70k - €90k',
        experience: '2-4 years',
        description: 'Manage financial reporting and market analysis for our European operations.',
        requirements: ['Excel Expert', 'Financial Modeling', 'English/French', 'Degree in Finance'],
        status: 'Open'
    },
    {
        title: 'Customer Success Specialist',
        company: 'HelpHero',
        location: 'Berlin, Germany',
        type: 'Full-time',
        category: 'Customer Service',
        salary: '€45k - €55k',
        experience: '1-2 years',
        description: 'Be the voice of our company and help our users get the most value out of our platform.',
        requirements: ['Native German', 'Communication Skills', 'CRM Software', 'Problem Solving'],
        status: 'Open'
    },
    {
        title: 'Product Manager',
        company: 'Innovate HQ',
        location: 'Remote',
        type: 'Full-time',
        category: 'Technology',
        salary: '$140k - $180k',
        experience: '6+ years',
        description: 'Define the product roadmap and work closely with engineering and design teams to deliver world-class products.',
        requirements: ['Agile', 'Product Vision', 'Stakeholder Management', 'Data Analysis'],
        status: 'Open'
    }
];

const seedJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for job seeding...');

        // Find an employer or admin to assign the jobs to
        const employer = await User.findOne({ role: { $in: ['employer', 'admin'] } });
        if (!employer) {
            console.error('No employer or admin found. Please run seedAdmin.js first!');
            process.exit(1);
        }

        const jobsWithEmployer = jobsData.map(job => ({
            ...job,
            employer: employer._id
        }));

        await Job.insertMany(jobsWithEmployer);
        console.log(`${jobsData.length} jobs seeded successfully!`);
        process.exit();
    } catch (err) {
        console.error('Error seeding jobs:', err.message);
        process.exit(1);
    }
};

seedJobs();
