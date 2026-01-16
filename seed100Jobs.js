const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const titles = ['Software Engineer', 'Product Manager', 'UX Designer', 'Data Analyst', 'Marketing Specialist', 'Sales Representative', 'HR Manager', 'Financial Analyst', 'Customer Success', 'Project Coordinator', 'Content Writer', 'DevOps Engineer', 'Security Analyst', 'Accountant', 'Operations Manager', 'Graphic Designer', 'QA Tester', 'Business Developer', 'Legal Counsel', 'Social Media Manager'];
const companies = ['TechNova', 'GlobalLink', 'SkyHigh Solutions', 'InnovaCorp', 'EcoSystems', 'FutureTech', 'Zenith Group', 'Apex Industries', 'SoftStream', 'BlueChip Inc', 'Vanguard Systems', 'Quest Media', 'Peak Performance', 'Dynamic Dynamics', 'Summit Services', 'Alpha & Omega', 'Bridges & Co', 'Stellar Software', 'Prime Realty', 'NextGen Logistics'];
const locations = ['New York, NY', 'San Francisco, CA', 'London, UK', 'Berlin, Germany', 'Sydney, Australia', 'Toronto, Canada', 'Remote', 'Paris, France', 'Tokyo, Japan', 'Singapore', 'Austin, TX', 'Dublin, Ireland', 'Amsterdam, Netherlands', 'Bangalore, India', 'Stockholm, Sweden'];
const categories = ['Technology', 'Marketing', 'Finance', 'Design', 'Customer Service'];
const types = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];

const seed100Jobs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const admin = await User.findOne({ role: 'admin' });
        
        if (!admin) {
            console.error('Admin user not found. Run seedAdmin.js first.');
            process.exit(1);
        }

        const jobs = [];
        for (let i = 1; i <= 100; i++) {
            const title = titles[Math.floor(Math.random() * titles.length)];
            const company = companies[Math.floor(Math.random() * companies.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            const category = categories[Math.floor(Math.random() * categories.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const minSal = 40 + Math.floor(Math.random() * 60);
            const maxSal = minSal + 20 + Math.floor(Math.random() * 40);

            jobs.push({
                title: `${title} - ${i}`,
                company: company,
                location: location,
                type: type,
                category: category,
                salary: `$${minSal}k - $${maxSal}k`,
                experience: `${Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 5) + 5} years`,
                description: `This is a randomly generated job posting for a ${title} position at ${company}. Joining our dynamic team means working on cutting-edge projects in the heart of ${location}.`,
                requirements: ['Teamwork', 'Good Communication', 'Problem Solving', 'Adaptability'],
                status: 'Open',
                employer: admin._id
            });
        }

        await Job.insertMany(jobs);
        console.log('Successfully seeded 100 diverse jobs!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed100Jobs();
