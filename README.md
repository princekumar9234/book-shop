# JobHub - Premium Job Portal Application

JobHub is a modern, high-performance job portal web application built with Node.js, Express, and MongoDB. It features a premium LinkedIn-inspired design with real-time application tracking, interactive maps, and a powerful administrative control panel.

## 🚀 Key Features

- **LinkedIn-Inspired Profile**: Professional seeker dashboard with experience, education, and skills sections.

- **Global Application Tracking**: Admin-only oversight to manage (Accept/Reject) all applications on the platform.

- **Interactive Job Search**: Advanced filtering by location and category with a modern, icon-driven search bar.

- **Live Maps Integration**: View the physical location of hiring companies directly on the job details page via Google Maps.
- **Role-Based Access**: 

  - **Admin**: Full control over users, jobs, and global applications.
  - **Employer**: Post jobs and manage applicants for specific postings.
  - **Job Seeker**: Create a professional profile and apply for jobs.
- **One-Click Seeding**: Easy-to-use admin tools to populate the platform with 100+ sample jobs and applications.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Session Management**: express-session with connect-mongo
- **Frontend**: EJS Templating, Vanilla CSS (Glassmorphism design)
- **File Uploads**: Multer (PDF Resume handling)

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd box

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_secret_key
   NODE_ENV=development
   ```

4. **Run the Application**
   ```bash
   npm run dev
   ```

## 🧪 Seeding Demo Data

Pre-populate the application with users and jobs:

- **Create Admin Account**: `node seedAdmin.js` (Credentials: `admin@jobhub.com` / `adminpassword123`)
- **Seed 100 Jobs**: `node seed100Jobs.js`
- **Seed Dashboard Data**: `node seedApplications.js`

## 📂 Project Structure

- `/controllers`: Backend logic for auth, jobs, and admin.
- `/models`: Mongoose schemas for Users, Jobs, and Applications.
- `/public`: Static CSS and assets.
- `/routes`: Application routing.
- `/views`: EJS templates (Dashboards, Auth, Job Listings).
- `/uploads`: Storage for seeker resumes.

---
Built with ❤️ for a seamless hiring experience.
