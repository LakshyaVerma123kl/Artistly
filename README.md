Artistly
This is a Next.js project bootstrapped with create-next-app.
Getting Started
First, run the development server:

npm run dev

# or

yarn dev

# or

pnpm dev

# or

bun dev

Open https://artistly-henna.vercel.app/ with your browser to see the result.
You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.
This project uses next/font to automatically optimize and load Geist, a new font family for Vercel.
🖌️ Artistly Overview
Artistly is a full-stack web application for discovering and onboarding artists. It features a modern UI, server-side artist management, and supports image uploads.
✨ Features

🔍 Filter artists by category, location, or price
🧑‍🎨 Multi-step artist onboarding form
📷 Image uploads with preview and validation
🧵 Fully responsive UI with Tailwind + shadcn/ui
💾 MongoDB Atlas for scalable database storage
🌐 Deployed on Vercel (frontend) and Render (backend)

📁 Project Structure
Frontend (artistly-frontend)
Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui
Located under src/:
├── app/ # Pages (routing)
│ ├── artists/ # Artists list
│ ├── dashboard/ # (Optional) Admin area
│ └── onboarding/ # Artist onboarding form
├── components/ # UI components (buttons, cards, forms)
├── lib/ # API functions, types, utils
└── globals.css # Tailwind + custom styles

Backend (artistly-backend)
Built with Node.js, Express.js, and MongoDB
API endpoints for artist management and image upload
├── src/
│ ├── models/ # Mongoose schema (Artist)
│ ├── routes/ # /artists, /upload, etc.
│ ├── middleware/ # Error handling and 404
│ └── server.ts # Entry point
├── uploads/ # Uploaded images

🛠️ Environment Setup
Backend .env
PORT=3001
MONGODB_URI=<your_mongodb_atlas_uri>

Frontend .env.local
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api

💻 Running Locally

Start the Backend

cd artistly-backend
npm install
npm run dev

# ➜ Server running at (https://artistly-1jpx.onrender.com/)

Start the Frontend

cd artistly-frontend
npm install
npm run dev

# ➜ App running at (https://artistly-henna.vercel.app/)

Make sure the backend is running before testing any API integrations like onboarding or artist listings.
Learn More
To learn more about Next.js, take a look at the following resources:

Next.js Documentation - learn about Next.js features and API.
Learn Next.js - an interactive Next.js tutorial.

You can check out the Next.js GitHub repository - your feedback and contributions are welcome!
Deploy on Vercel
The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.
Check out the Next.js deployment documentation for more details.
🌍 Backend Deployment on Render

Push artistly-backend to a GitHub repo
Create a Web Service on Render
Set MONGODB_URI as an environment variable
Define the build and start scripts in package.json

Example:
"scripts": {
"build": "tsc",
"start": "node dist/server.js",
"dev": "ts-node-dev src/server.ts"
}

📬 Contact
Made with ❤️ by Lakshya Verma
