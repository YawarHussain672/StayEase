# StayEase — Smart Hostel, PG & Budget Hotel Booking Platform

A production-ready, unified full-stack booking and management platform built with **Next.js 16**. Features AI-powered recommendations, real-time availability, Razorpay payments, and comprehensive owner/admin dashboards.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **API Architecture** | Next.js API Routes (Serverless) |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion, GSAP |
| **State Management** | Zustand |
| **Database** | MongoDB (Mongoose ODM with serverless caching) |
| **Auth** | JWT (bcryptjs) |
| **Payments** | Razorpay (UPI, cards, wallets) |
| **AI** | OpenAI GPT (via OpenRouter) |
| **Deployment** | Vercel (Frontend & Serverless API) |

---

## ✨ Features

### For Tenants / Guests
- 🔍 Smart search with city, amenity, price, and gender filters
- 🏠 Detailed property pages with image gallery, room selection, reviews
- 📅 Instant booking with date-based availability
- 💳 Razorpay-powered secure payments
- 🤖 AI chatbot for booking guidance
- 🌙 Dark / Light mode toggle
- 📱 Fully responsive mobile-first design

### For Property Owners
- 📋 5-step property listing wizard
- 📊 Revenue analytics & occupancy dashboard
- 🛏️ Room and pricing management
- 📈 AI-powered demand & pricing predictions

### For Admins
- 👥 User & owner management
- ✅ Property verification queue
- 🛡️ AI-assisted review moderation
- 📞 Complaint resolution workflow

---

## 📁 Project Structure

```
Overnight/
├── src/
│   ├── app/                 # Pages & API Routes (App Router)
│   │   ├── api/             # Integrated Backend API
│   │   │   ├── auth/        # Authentication handlers
│   │   │   ├── properties/  # CRUD & filtration
│   │   │   ├── bookings/    # Booking & availability
│   │   │   ├── ai/          # AI-powered features
│   │   │   └── ...
│   │   └── ...
│   ├── components/          # Reusable UI & Layouts
│   ├── lib/                 # Shared utilities, DB connection & AI services
│   ├── models/              # Mongoose schemas (Unified)
│   └── store/               # Zustand state stores
├── public/                  # Static assets
└── vercel.json              # Vercel deployment config
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js ≥ 20
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/stayease.git
cd stayease
```

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your credentials:
```bash
cp .env.example .env
```

### 4. Run Locally
```bash
npm run dev
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `RAZORPAY_KEY_ID` | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret |
| `OPENAI_API_KEY` | OpenAI API key (or OpenRouter key) |
| `NEXT_PUBLIC_API_URL` | Set to `/api` for internal routing |

---

## 📡 API Endpoints (Next.js Routes)

| Group | Path | Auth |
|-------|------|------|
| Auth | `/api/auth` | Public / Protected |
| Properties | `/api/properties` | Mixed |
| Bookings | `/api/bookings` | Protected |
| Reviews | `/api/reviews` | Mixed |
| Complaints | `/api/complaints` | Protected |
| Payments | `/api/payments` | Protected |
| Dashboard | `/api/dashboard` | Protected (Owner/Admin) |
| AI | `/api/ai` | Protected |

---

## 🚢 Deployment

### Vercel (All-in-One)
1. Import the repository on [vercel.com](https://vercel.com)
2. Add all environment variables listed above.
3. Deploy! Next.js will automatically handle the builds for both your UI and API serverless functions.

---

## 📜 License

MIT © StayEase

---

Built with ❤️ using Unified Next.js 16 + AI
