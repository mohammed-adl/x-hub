# x-hub – Social Media Platform

<p align="center">
  <img src="/frontend/public/main.gif" alt="Main Demo GIF" width="850"/>
</p>

A full-stack, real-time social media platform inspired by Twitter. x-hub provides robust authentication, advanced messaging, notifications, algorithms for feeding and searching, and a responsive, modern UI — all backed by scalable architecture and secure practices.

Live Demo: [https://xhubco.vercel.app](https://xhubco.vercel.app)

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture & Project Structure](#architecture--project-structure)
4. [Getting Started](#getting-started)
5. [Usage](#usage)
6. [Screenshots / Demo](#screenshots--demo)
7. [Future Improvements](#future-improvements)

---

## Features

### Authentication & Security

- Secure JWT-based authentication with refresh token rotation.
- **Selective logout** (log out from one device while keeping others active).
- **Device logs** — track and manage active sessions.
- Input validation and sanitization with Zod.
- **Rate limiting** to protect against brute-force attacks and abuse.

### Messaging System

- Complete **real-time messaging** system with seen/read indicators.
- Live conversations with Socket.IO.
- Optimized message pagination and smooth chat experience.

### Notifications

- Real-time notifications system similar to Facebook.
- Alerts for likes, replies, follows, retweets, and messages.
- Instant delivery with real-time syncing.

### Social Graph & Algorithms

- **Follow system** with retweets, replies, and engagement features.
- **Smart follow suggestions** powered by algorithms.
- **Search system** with scalable query handling.

### UX / UI Enhancements

- Fully responsive design with CSS Modules.
- Smooth infinite scrolling & pagination for feeds, messages, and notifications.
- Optimized image uploads with **Multer**.
- Clear feedback with toasts, spinners, and alerts.

### Realtime & Scalability

- Real-time alerts and updates across messaging, notifications, and feed.
- Infinite pagination for performance on large datasets.
- Modular, scalable backend built with Express and Prisma, leveraging optimized database indexes for performance and efficiency.

---

## Architecture & Project Structure

```text
x-hub/
├─ backend/
│  ├─ prisma/
│  ├─ .env
│  ├─ app.js
│  ├─ server.js
│  └─ src/
│     ├─ config/
│     ├─ controllers/
│     ├─ lib/
│     ├─ middlewares/
│     ├─ routes/
│     ├─ schemas/
│     ├─ services/
│     ├─ socket/
│     └─ utils/
│
├─ frontend/
│  ├─ public/
│  ├─ .env
│  ├─ src/
│  │  ├─ app/
│  │  ├─ assets/
│  │  ├─ components/
│  │  ├─ contexts/
│  │  ├─ fetchers/
│  │  ├─ hooks/
│  │  ├─ lib/
│  │  ├─ pages/
│  │  ├─ schemas/
│  │  ├─ services/
│  │  ├─ socket/
│  │  ├─ toasts/
│  │  └─ utils/
│  │
│  ├─ App.jsx
│  ├─ index.css
│  ├─ main.jsx
│  └─ index.html
│
├─ README.md

```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- PostgreSQL

### Clone the repository

```bash
git clone https://github.com/x-hub-social/x-hub.git
cd x-hub
```

### Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Configure environment variables

**Backend `.env`**

```bash
# Backend .env

NODE_ENV=development

ACCESS_SECRET=your_jwt_access_secret
REFRESH_SECRET=your_jwt_refresh_secret

BASE_URL=http://localhost:3000
ORIGIN=http://localhost:5173

DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
X_ACCOUNT_ID=<your_X_account_id>

```

**Frontend `.env`**

```bash
NODE_ENV=development

VITE_API_URL=http://localhost:3000/api/v1
VITE_API_BASE_URL=http://localhost:3000

VITE_SOURCE_URL=http://localhost:5173



```

### Run the application

```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
```

Open [http://http://localhost:5173](http://http://localhost:5173).

### Database Migrations

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

---

## Tech Stack

- **Frontend:** React, CSS Modules
- **Backend:** Express.js, Prisma ORM
- **Realtime / Data:** Socket.IO
- **Uploads:** Multer
- **Authentication & Security:** JWT, bcrypt, Zod, Helmet, CORS, Rate Limiting
- **Deployment:** Render (backend), Vercel (frontend)

---

## Usage

> ⚠️ **Warning:** You need to sign up with an account named **X** and post its **Id** in the `.env` file.

1. Sign up or log in.
2. Create posts, follow users, and engage with retweets and replies.
3. Chat in real-time with the built-in messaging system.
4. Receive live notifications for every interaction.
5. Explore suggested follows and search for people or content.

---

## Screenshots / Demo

<p align="center">
  <img src="/frontend/public/selective-logout.gif" alt="Logout Screenshot" width="800" ">
</p>

<p align="center">
  <img src="/frontend/public/notifications.PNG" alt="Logout Screenshot" width="800" ">
</p>

---

### Future Improvements

- **Media Handling:** Video uploads and previews.
- **UI Themes:** Light/dark mode toggle.
- **Testing:** Unit and end-to-end tests for backend & frontend.
- **API Resilience:** Retries for API calls to improve fault tolerance.
- **Caching Strategies:** Smarter caching layers to reduce unnecessary database calls.

---
