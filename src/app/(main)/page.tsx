"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Star, Shield, Zap, Clock, HeadphonesIcon,
  BadgeCheck, ChevronRight, Building2, Users, TrendingUp, ArrowRight,
  User, ShieldCheck,
} from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";

/* ─── HERO CAROUSEL IMAGES ─── */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop&q=85",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&h=1080&fit=crop&q=85",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&h=1080&fit=crop&q=85",
];

/* ─── IMAGE POOLS ─── */
const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=450&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=450&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=450&fit=crop&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=450&fit=crop&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=450&fit=crop&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=450&fit=crop&q=80",
  "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=450&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=450&fit=crop&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=450&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&h=450&fit=crop&q=80",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=450&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=450&fit=crop&q=80",
];

const CITY_IMAGES: Record<string, string> = {
  Mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop&q=80",
  Delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop&q=80",
  Bangalore: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&h=600&fit=crop&q=80",
  Pune: "https://images.unsplash.com/photo-1589629041152-fb71b9c5dbcd?w=800&h=600&fit=crop&q=80",
  Hyderabad: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?w=800&h=600&fit=crop&q=80",
  Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop&q=80",
};

/* ─── DEMO DATA ─── */
const CITIES_DATA = [
  { name: "Mumbai", count: 280, tagline: "The City of Dreams" },
  { name: "Delhi", count: 210, tagline: "Heart of India" },
  { name: "Bangalore", count: 340, tagline: "Silicon Valley of India" },
  { name: "Pune", count: 190, tagline: "Oxford of the East" },
  { name: "Hyderabad", count: 160, tagline: "City of Pearls" },
  { name: "Goa", count: 120, tagline: "Pearl of the Orient" },
];

const FEATURED_PROPERTIES = Array.from({ length: 12 }, (_, i) => ({
  id: `fp-${i}`,
  name: [
    "Urban Nest Co-Living", "Skyline Residency", "The Backpacker's Hub", "Metro Heights PG",
    "Sunrise Dormitory", "Golden Leaf Hostel", "City View Rooms", "Traveler's Haven",
    "Comfort Zone PG", "The Study Hub", "Royal Stay Inn", "Pacific Lodge"
  ][i],
  type: ["Hostel", "PG", "Hotel", "PG", "Hostel", "Hostel", "Hotel", "Hostel", "PG", "PG", "Hotel", "Hostel"][i],
  city: ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Goa", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Goa"][i],
  area: ["Andheri West", "Hauz Khas", "Koramangala", "Viman Nagar", "Banjara Hills", "Calangute", "Bandra", "Connaught Place", "HSR Layout", "Kothrud", "Madhapur", "Panjim"][i],
  price: [8500, 12000, 6500, 9000, 7500, 5500, 15000, 7000, 10000, 8000, 11000, 6000][i],
  rating: [4.6, 4.8, 4.3, 4.5, 4.7, 4.4, 4.9, 4.2, 4.6, 4.5, 4.8, 4.1][i],
  verified: [true, true, false, true, true, false, true, false, true, false, true, false][i],
  reviews: [128, 89, 234, 67, 156, 312, 45, 198, 92, 78, 201, 143][i],
  image: PROPERTY_IMAGES[i],
}));

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    city: "Bangalore",
    text: "Found an amazing PG through StayEase within a day of landing in Bangalore. The AI recommendations were spot on — exactly my budget and location preference.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Rahul Verma",
    role: "College Student",
    city: "Delhi",
    text: "As a student, budget was my priority. StayEase helped me find a great hostel near my college with all meals included. The booking process was super smooth.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Ananya Iyer",
    role: "Digital Nomad",
    city: "Goa",
    text: "I've used StayEase in 4 different cities now. Every property was exactly as described. The verified badge gives real confidence. Best platform for budget stays.",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
  },
];

const POPULAR_CITIES = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Goa"];

/* ─── ANIMATION ─── */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/properties?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/properties");
    }
  };

  return (
    <div className="w-full">
      {/* ════════ HERO ════════ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Carousel Background */}
        <div className="absolute inset-0">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={heroIdx}
              src={HERO_IMAGES[heroIdx]}
              alt="StayEase hero"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />

          {/* Animated Background Blobs for Hero */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-30">
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-purple-500/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
            <div className="absolute top-1/2 -right-20 w-[600px] h-[600px] bg-violet-500/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000" />
            <div className="absolute -bottom-20 left-1/3 w-[550px] h-[550px] bg-fuchsia-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000" />
          </div>
        </div>

        {/* Carousel dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === heroIdx ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-panel text-white text-sm font-bold mb-8 shadow-xl">
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              AI-Powered Smart Booking
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 drop-shadow-lg">
              Find Your{" "}
              <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent filter drop-shadow-sm">
                Perfect Stay
              </span>
              <br />
              in India
            </h1>

            <p className="text-lg text-white leading-relaxed mb-10 max-w-lg font-semibold drop-shadow-md">
              Discover verified hostels, PGs & budget hotels across 25+ cities.
              AI-powered recommendations, instant booking, and secure payments.
            </p>

            {/* Glass Search Bar (Water Drop Style) */}
            <div className="glass-panel !rounded-full p-3 sm:p-2 sm:pl-6 flex flex-col sm:flex-row gap-4 sm:gap-2 max-w-xl items-center relative z-20 transition-transform hover:scale-[1.01] duration-300">
              <div className="relative flex-1 w-full flex items-center">
                <MapPin className="absolute left-2 w-5 h-5 text-indigo-500 dark:text-indigo-300" />
                <input
                  type="text"
                  placeholder="Enter city, area, or landmark..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium border-none outline-none focus:ring-0"
                />
              </div>
              <button
                onClick={handleSearch}
                className="glass-btn-primary w-full sm:w-auto shadow-xl"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>

            {/* Quick City Pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="text-sm text-slate-200 font-medium mr-1 drop-shadow-md">Popular:</span>
              {POPULAR_CITIES.map((city) => (
                <Link
                  key={city}
                  href={`/properties?city=${city}`}
                  className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-medium text-sm transition-colors border border-white/10 backdrop-blur-sm"
                >
                  {city}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════ STATS BAR ════════ */}
      <section className="relative z-20 -mt-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp}
          className="max-w-4xl mx-auto glass-panel rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "50K+", label: "Happy Users", icon: Users },
            { value: "8", label: "Cities", icon: MapPin },
            { value: "1,200+", label: "Properties", icon: Building2 },
            { value: "4.8★", label: "Avg Rating", icon: Star },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
              <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ════════ FEATURED PROPERTIES ════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Featured Properties</h2>
              <p className="text-[var(--text-secondary)]">Hand-picked stays across India</p>
            </div>
            <Link href="/properties" className="hidden sm:flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {FEATURED_PROPERTIES.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <PropertyCard
                  property={{
                    _id: p.id,
                    name: p.name,
                    type: p.type,
                    city: p.city,
                    area: p.area,
                    price: p.price,
                    rating: p.rating,
                    reviews: p.reviews,
                    image: p.image,
                    verified: p.verified,
                  }}
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/properties" className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
              View All Properties <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ POPULAR CITIES ════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Popular Cities</h2>
            <p className="text-[var(--text-secondary)]">Explore stays in India&rsquo;s top destinations</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CITIES_DATA.map((city, i) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link href={`/properties?city=${city.name}`} className="group block">
                  <div className="relative h-64 rounded-2xl overflow-hidden glass-panel p-1">
                    <img
                      src={CITY_IMAGES[city.name]}
                      alt={city.name}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    {/* Glass Overlay Text */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-md bg-black/45 border border-white/20">
                      <h3 className="text-xl font-bold text-white mb-0.5 drop-shadow-md">{city.name}</h3>
                      <p className="text-sm text-white/85 font-medium">{city.tagline} · {city.count}+ stays</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ HOW IT WORKS (Image-First) ════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-20">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">How It Works</h2>
            <p className="text-lg text-[var(--text-secondary)]">Your journey from search to stay</p>
          </motion.div>

          <div className="space-y-24">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative h-[400px] rounded-[2rem] overflow-hidden shadow-2xl glass-panel p-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1080&q=80"
                  alt="Search"
                  className="w-full h-full object-cover rounded-[1.5rem] hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:pl-10"
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-4">01. Search & Filter</h3>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
                  Browse thousands of verified listings. Filter by price, location, amenities, and more to find a place that feels like home.
                </p>
                <ul className="space-y-3">
                  {['Smart Filters', 'Map View', 'Verified Badges'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:order-2 relative h-[400px] rounded-[2rem] overflow-hidden shadow-2xl glass-panel p-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1080&q=80"
                  alt="Virtual Tour"
                  className="w-full h-full object-cover rounded-[1.5rem] hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:pr-10 md:order-1"
              >
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                  <BadgeCheck className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-4">02. Take a Virtual Tour</h3>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
                  Check out high-resolution photos and 360° views. Every property is verified by our team so what you see is what you get.
                </p>
              </motion.div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative h-[400px] rounded-[2rem] overflow-hidden shadow-2xl glass-panel p-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1080&q=80"
                  alt="Move In"
                  className="w-full h-full object-cover rounded-[1.5rem] hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:pl-10"
              >
                <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mb-6 text-pink-600 dark:text-pink-400">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-4">03. Instant Move-In</h3>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
                  Book instantly and get your digital move-in pass. No waiting, no paperwork hell. Just grab your keys and settle in.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ WHY STAYEASE (Image Cards) ════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Why StayWithUs?</h2>
            <p className="text-lg text-[var(--text-secondary)]">More than just a booking platform.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer glass-panel border-white/20 p-1"
            >
              <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1080&q=80"
                  alt="Community"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <Users className="w-10 h-10 mb-4 text-indigo-400" />
                  <h3 className="text-2xl font-bold mb-2">Vibrant Community</h3>
                  <p className="text-slate-200">Connect with like-minded students and professionals in our community lounges.</p>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer glass-panel border-white/20 p-1"
            >
              <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=1080&q=80"
                  alt="Support"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <HeadphonesIcon className="w-10 h-10 mb-4 text-pink-400" />
                  <h3 className="text-2xl font-bold mb-2">24/7 Human Support</h3>
                  <p className="text-slate-200">Real people, always ready to help you settle in or resolve issues.</p>
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer glass-panel border-white/20 p-1"
            >
              <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&q=80&w=2000"
                  alt="Best Price"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <Shield className="w-10 h-10 mb-4 text-emerald-400" />
                  <h3 className="text-2xl font-bold mb-2">Best Price Guarantee</h3>
                  <p className="text-slate-200">We match any lower price you find. No hidden fees, ever.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS (Marquee with Real Avatars) ════════ */}
      <section className="py-16 sm:py-24 px-0 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">Loved by Students & Pros</h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)]">Don&apos;t just take our word for it.</p>
        </div>

        {/* Marquee Container */}
        <div className="relative flex overflow-x-hidden group marquee-container">
          <div className="flex gap-4 py-4 marquee-track">
            {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-64 sm:w-80 md:w-96 glass-panel backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-white/50">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)] text-sm">{t.name}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)]">{t.role} · {t.city}</p>
                  </div>
                </div>
                <div className="flex mb-2">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`w-3 h-3 ${s < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ OWN A PROPERTY (Modern Asymmetric Redesign - Forced Light Mode) ════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Deep Depth Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Modern Interior"
            className="w-full h-full object-cover opacity-20 dark:opacity-5 scale-105"
          />
          <div className="absolute inset-0" />

          {/* Animated Mesh Gradients */}
          <div className="absolute top-0 right-0 w-2/3 h-full bg-indigo-500/10 blur-[120px] rounded-full animate-blob pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-purple-500/10 blur-[120px] rounded-full animate-blob animation-delay-2000 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 text-sm font-black uppercase tracking-[0.2em] mb-8">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                Partner with StayEase
              </div>

              <h2 className="text-5xl sm:text-7xl font-black mb-8 leading-[1] tracking-tight text-[var(--text-primary)]">
                Monetize <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Your Space</span>
              </h2>

              <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-lg leading-relaxed font-medium">
                Transform your vacant property into a high-revenue asset.
                We handle the heavy lifting—marketing, verified bookings, and instant payments—while you watch your returns grow.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  href="/register?role=owner"
                  className="glass-btn-primary !px-10 !py-4 !text-lg shadow-2xl"
                >
                  List Property
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="glass-btn-ghost !px-10 !py-4 !text-lg"
                >
                  Talk to Sales
                </Link>
              </div>

              {/* Stats Indicators */}
              <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">98%</div>
                  <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">Occupancy</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">10k+</div>
                  <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">Verified Hosts</div>
                </div>
                <div className="sm:col-span-1 col-span-2">
                  <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">Instant</div>
                  <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">Payouts</div>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Column (Floating Glass Dashboard) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative perspective-1000 hidden lg:block"
            >
              <div className="relative z-10 group cursor-default">
                {/* Main Dashboard Card */}
                <div className="glass-panel !bg-white/30 backdrop-blur-[60px] rounded-[3rem] p-8 border-white/40 shadow-2xl transition-all duration-700 group-hover:rotate-x-6 group-hover:rotate-y-[-6deg] group-hover:scale-[1.02]">

                  {/* Mock Dashboard Content */}
                  <div className="flex items-center justify-between mb-8 border-b border-slate-900/5 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-indigo-600">Total Revenue</div>
                        <div className="text-2xl font-black text-slate-900">₹24,50,000</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-black">+12.5%</div>
                  </div>

                  {/* Mock Graph Layout */}
                  <div className="space-y-6">
                    {[
                      { label: "Bookings", value: "w-[85%]", color: "bg-indigo-500" },
                      { label: "Inquiries", value: "w-[65%]", color: "bg-purple-500" },
                      { label: "Reviews", value: "w-[90%]", color: "bg-blue-500" }
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                          <span>{item.label}</span>
                          <span>{item.value.replace('w-[', '').replace('%]', '')}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-900/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: item.value.split('[')[1].split(']')[0] }}
                            transition={{ duration: 1.5, delay: idx * 0.2 }}
                            className={`h-full ${item.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                      <TrendingUp className="w-6 h-6 text-indigo-600 mb-2" />
                      <div className="text-xs font-bold text-slate-500">Analytics</div>
                      <div className="font-black text-slate-900">Active</div>
                    </div>
                    <div className="p-4 rounded-3xl bg-purple-500/5 border border-purple-500/10">
                      <ShieldCheck className="w-6 h-6 text-purple-600 mb-2" />
                      <div className="text-xs font-bold text-slate-500">Security</div>
                      <div className="font-black text-slate-900">Verified</div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements for Depth */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 blur-[60px] rounded-full animate-blob pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/20 blur-[60px] rounded-full animate-blob animation-delay-4000 pointer-events-none" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ════════ RECENT LISTINGS (Preserved) ════════ */}

    </div>
  );
}
