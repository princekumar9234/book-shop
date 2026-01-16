const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Please add a company name']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    type: {
        type: String,
        required: [true, 'Please add job type'],
        enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    salary: {
        type: String,
        required: [true, 'Please add a salary range']
    },
    experience: {
        type: String,
        required: [true, 'Please add experience level']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    requirements: {
        type: [String],
        required: [true, 'Please add requirements']
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
    employer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', jobSchema);
