**Job Board Website**

Overview

This is a job board website where users can register as candidates or recruiters. The platform supports authentication via **Clerk**, enabling users to log in with Google or email. The platform features premium membership plans with tiered pricing, allowing recruiters to post jobs and candidates to apply. All data is securely stored using MongoDB, resumes are stored in **Supabase**, and payments are processed through the **Cashfree payment gateway**.

**Features**

**Authentication**

Users can authenticate via Clerk using:

Google

Email and password

Users must first register and then log in.

**User Roles**

Candidate:

Can apply for jobs.

Access to premium plans for applying to jobs:

Tier 1: Apply for up to 5 jobs.

Tier 2: Apply for up to 10 jobs.

Tier 3: Apply for unlimited jobs.

Can update their account information and resume.

View the status of their job applications (selected/rejected).

**Recruiter:**

Can post jobs with the following limits based on premium plans:

Tier 1: Post up to 5 jobs.

Tier 2: Post up to 10 jobs.

Tier 3: Post unlimited jobs.

Can view, select, and reject applied candidates for jobs.

Selection or rejection decisions are final and cannot be changed.

**Premium Membership Plans**

Plans for Candidates:

Tier 1: Apply for up to 5 jobs.

Tier 2: Apply for up to 10 jobs.

Tier 3: Apply for unlimited jobs.

**Plans for Recruiters:**

Tier 1: Post up to 5 jobs.

Tier 2: Post up to 10 jobs.

Tier 3: Post unlimited jobs.

Payments for premium plans are integrated with Cashfree.

**Job Application Workflow**

Candidates apply for jobs based on their membership tier.

Recruiters can view applicants and either select or reject them.

Selected or rejected status is visible to candidates.

**Account Management**

Users can update their account details.

Candidates can update their resumes (stored in Supabase).

**Tech Stack**

**Frontend**

Next.js with server actions for data management.

Tailwind CSS for styling.

**Backend**

MongoDB for data storage.

Supabase for storing resumes.

Clerk for authentication.

Cashfree for payment processing.

**Routes**

Authentication:

Sign In: https://job-board-one-gold.vercel.app/sign-in

Sign Up: https://job-board-one-gold.vercel.app/sign-up

Main Pages:

Home: https://job-board-one-gold.vercel.app/

Jobs: https://job-board-one-gold.vercel.app/jobs

Membership: https://job-board-one-gold.vercel.app/membership

Account: https://job-board-one-gold.vercel.app/account

**Installation**

Prerequisites

Node.js installed on your system.

MongoDB connection string.

Supabase API keys.

Clerk and Cashfree API keys.

**Setup**

Clone the repository:

https://github.com/NHactivite/job-board.git

Navigate to the project directory:

cd job-board

**Install dependencies:**

npm install

**Set up environment variables in a .env.local file:**

**MONGO_URL**=your_mongodb_connection_string<br/>
**NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**=your_clerk_publishable_key<br/>
**CLERK_SECRET_KEY**=your_clerk_secret_key<br/>
**CLIENT_ID**=your_cashfree_client_id<br/>
**CLIENT_SECRET**=your_cashfree_client_secret<br/>
**NEXT_PUBLIC_CLERK_SIGN_IN_URL**=/sign-in<br/>
**NEXT_PUBLIC_CLERK_SIGN_UP_URL**=/sign-up<br/>
**NEXT_PUBLIC_SUPABASE_URL**=your_supabase_url<br/>
**NEXT_PUBLIC_SUPABASE_ANON_KEY**=your_supabase_anon_key<br/>

Start the development server:

**npm run dev**

Open the app in your browser at http://localhost:3000.

**Future Enhancements**

Admin Dashboard: Add an admin panel for managing users, jobs, and plans.

Analytics: Provide analytics for recruiters to track job performance.

Job Search Filters: Add advanced filtering options for candidates.

Notifications: Implement email notifications for application updates.

Integration: Add LinkedIn or other social login options.

**License**

Distributed under the MIT License. See LICENSE for more information.

Contact

For queries, reach out to:

**Nikhil Hazarika**

**LinkedIn**  https://www.linkedin.com/in/nikhilhazarika/

**Email**  nikhilhazarika9@gmail.com
