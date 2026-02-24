# StayEase 🏠

**Smart Hostel, PG & Budget Hotel Booking Platform**

A full-stack Next.js application for booking hostels, PGs, co-living spaces, and budget hotels — with AI-powered recommendations, real-time availability, and Razorpay payments.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YawarHussain672/StayEase)

---

## Features

- 🔐 **JWT Authentication** — Register, Login, Role-based access (User / Owner / Admin)
- 🏨 **Property Listings** — Browse, filter by city, type, gender, price
- 📅 **Booking System** — Book rooms, manage bookings, cancel with confirmation
- 💳 **Razorpay Payments** — Real & mock payment support
- 🤖 **AI Assistant** — OpenRouter-powered chat for property recommendations
- 📊 **Owner Dashboard** — Manage properties, rooms, bookings, and complaints
- 📝 **Reviews & Complaints** — Tenant feedback system
- 🌙 **Dark Mode** — Full dark/light mode with glassmorphism design

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcryptjs |
| Payments | Razorpay |
| AI | OpenRouter API |
| Styling | Tailwind CSS v4 + Custom CSS |
| State | Zustand |
| Animations | Framer Motion, GSAP |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Razorpay account (test keys)
- OpenRouter API key

### Local Setup

```bash
# Clone the repo
git clone https://github.com/YawarHussain672/StayEase.git
cd StayEase/frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Fill in your values (see Environment Variables below)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create `frontend/.env` with the following:

```env
NEXT_PUBLIC_API_URL=/api

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/stayease

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# AI (OpenRouter)
OPENROUTER_API_KEY=sk-or-v1-xxxx
```

> ⚠️ Never commit your `.env` file. It is excluded by `.gitignore`.

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Set **Root Directory** to `frontend`
4. Add all environment variables from `.env` in Vercel's dashboard
5. Deploy 🚀

---

## Project Structure

```
StayEase/
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── api/          # Next.js API Routes (backend)
    │   │   │   ├── auth/     # Login, Register, Profile
    │   │   │   ├── bookings/ # Booking CRUD, cancel, status
    │   │   │   ├── properties/
    │   │   │   ├── reviews/
    │   │   │   ├── complaints/
    │   │   │   ├── payments/ # Razorpay integration
    │   │   │   ├── dashboard/
    │   │   │   └── ai/       # OpenRouter AI chat
    │   │   └── (main)/       # UI pages
    │   ├── lib/
    │   │   ├── db.ts         # MongoDB connection + model registration
    │   │   ├── auth.ts       # JWT auth middleware (withAuth HOC)
    │   │   └── api.ts        # Axios client
    │   ├── models/           # Mongoose schemas
    │   └── store/            # Zustand global state
    └── public/
```

---

## License

MIT
