"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Building2, Users, Calendar, CreditCard, TrendingUp, AlertTriangle,
    Star, DollarSign, ArrowUpRight, ArrowDownRight, BarChart3, Eye,
    Clock, CheckCircle2, XCircle, Bell, Loader2, PlusCircle
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";

const DEMO_STATS = {
    totalProperties: 5, totalRooms: 48, totalBookings: 156, activeBookings: 23,
    totalRevenue: 485000, monthlyRevenue: 68000, avgRating: 4.5, totalReviews: 89,
    occupancyRate: 82, pendingComplaints: 3, revenueGrowth: 12.5,
};

const DEMO_RECENT_BOOKINGS = [
    { _id: "rb1", user: { name: "Rahul Sharma" }, property: { name: "Urban Nest" }, room: { name: "Double AC" }, amount: { total: 9240 }, status: "confirmed", checkIn: "2026-03-01" },
    { _id: "rb2", user: { name: "Priya Kapoor" }, property: { name: "Urban Nest" }, room: { name: "Single AC" }, amount: { total: 18000 }, status: "pending", checkIn: "2026-03-05" },
    { _id: "rb3", user: { name: "Amit Desai" }, property: { name: "Silicon Stay" }, room: { name: "Dormitory" }, amount: { total: 4500 }, status: "checked-in", checkIn: "2026-02-20" },
    { _id: "rb4", user: { name: "Sneha Patel" }, property: { name: "Green Meadows" }, room: { name: "Double AC" }, amount: { total: 12000 }, status: "confirmed", checkIn: "2026-03-10" },
    { _id: "rb5", user: { name: "Vikram Singh" }, property: { name: "Silicon Stay" }, room: { name: "Single AC" }, amount: { total: 7200 }, status: "cancelled", checkIn: "2026-02-25" },
];

const STATUS_COLORS: Record<string, string> = {
    pending: "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/15",
    confirmed: "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/15",
    "checked-in": "text-indigo-600 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-500/15",
    cancelled: "text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-500/15",
    "checked-out": "text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-500/15",
};

export default function DashboardPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || (user.role !== "owner" && user.role !== "admin")) {
            router.push("/login");
            return;
        }
        fetchDashboard();
    }, [user]);

    const fetchDashboard = async () => {
        try {
            const { data } = await api.get("/dashboard/stats");
            setStats(data.stats);
            const bRes = await api.get("/dashboard/bookings/analytics");
            setRecentBookings(bRes.data.recentBookings || []);
        } catch {
            setStats(DEMO_STATS);
            setRecentBookings(DEMO_RECENT_BOOKINGS);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
        );
    }

    const statCards = [
        {
            label: "Total Properties", value: stats?.totalProperties || 0,
            icon: Building2, gradient: "from-indigo-500 via-indigo-600 to-purple-600",
            bg: "rgba(79,70,229,0.12)", accent: "#818cf8",
        },
        {
            label: "Active Bookings", value: stats?.activeBookings || 0,
            icon: Calendar, gradient: "from-cyan-500 via-sky-500 to-blue-600",
            bg: "rgba(6,182,212,0.12)", accent: "#38bdf8",
        },
        {
            label: "Total Revenue", value: `₹${((stats?.totalRevenue || 0) / 1000).toFixed(0)}K`,
            icon: DollarSign, gradient: "from-emerald-500 via-emerald-500 to-teal-600",
            bg: "rgba(16,185,129,0.12)", accent: "#34d399",
        },
        {
            label: "Occupancy Rate", value: `${stats?.occupancyRate || 0}%`,
            icon: TrendingUp, gradient: "from-amber-400 via-orange-500 to-rose-500",
            bg: "rgba(245,158,11,0.12)", accent: "#fbbf24",
        },
    ];

    const secondaryStats = [
        { label: "Total Bookings", value: stats?.totalBookings || 0, icon: Calendar },
        { label: "Total Rooms", value: stats?.totalRooms || 0, icon: Building2 },
        { label: "Avg Rating", value: `${stats?.avgRating || 0} ★`, icon: Star },
        { label: "Reviews", value: stats?.totalReviews || 0, icon: Eye },
        { label: "Monthly Revenue", value: `₹${((stats?.monthlyRevenue || 0) / 1000).toFixed(0)}K`, icon: CreditCard },
        { label: "Pending Complaints", value: stats?.pendingComplaints || 0, icon: AlertTriangle },
    ];

    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                            Welcome, {user?.name?.split(" ")[0]} 👋
                        </h1>
                        <p className="text-[var(--text-secondary)] mt-1">
                            Here's what's happening with your properties
                        </p>
                    </div>
                    <Link href="/dashboard/add-property" className="btn-primary !text-sm flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Add Property
                    </Link>
                </div>

                {/* Revenue Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-6 rounded-[2rem] bg-gradient-to-tr from-indigo-500/90 to-purple-600/90 backdrop-blur-xl border border-white/20 shadow-2xl text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
                    <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <p className="text-indigo-100 text-sm mb-1">This Month's Revenue</p>
                            <p className="text-3xl font-bold">₹{(stats?.monthlyRevenue || 0).toLocaleString()}</p>
                        </div>
                        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${(stats?.revenueGrowth || 0) >= 0 ? "bg-emerald-400/20 text-emerald-200" : "bg-red-400/20 text-red-200"
                            }`}>
                            {(stats?.revenueGrowth || 0) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {Math.abs(stats?.revenueGrowth || 0)}% vs last month
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className={`relative p-5 rounded-2xl bg-gradient-to-br ${stat.gradient} overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-default`}
                        >
                            {/* Decorative watermark icon */}
                            <stat.icon className="absolute -right-3 -bottom-3 w-20 h-20 text-white/10" />
                            {/* Top accent line */}
                            <div className="absolute top-0 left-6 right-6 h-px bg-white/30 rounded-full" />

                            <div className="relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
                                <p className="text-sm font-semibold text-white/80 mt-1">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Secondary row + recent bookings */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Secondary Stats */}
                    <div className="lg:col-span-1">
                        <h2 className="font-semibold text-lg mb-4">Quick Stats</h2>
                        <div className="space-y-3">
                            {secondaryStats.map((s) => (
                                <div key={s.label} className="flex items-center justify-between p-3 rounded-xl glass-panel !shadow-none">
                                    <div className="flex items-center gap-3">
                                        <s.icon className="w-4 h-4 text-[var(--primary)]" />
                                        <span className="text-sm text-[var(--text-secondary)]">{s.label}</span>
                                    </div>
                                    <span className="text-sm font-bold text-[var(--text-primary)] dark:text-white">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Bookings Table */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-lg">Recent Bookings</h2>
                            <Link href="/bookings" className="text-sm text-[var(--primary)] font-medium hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="rounded-2xl glass-panel overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-black/5 dark:bg-white/5 text-left text-sm text-[var(--text-muted)]">
                                            <th className="px-4 py-3 font-medium">Guest</th>
                                            <th className="px-4 py-3 font-medium">Property</th>
                                            <th className="px-4 py-3 font-medium">Amount</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)]">
                                        {recentBookings.map((b) => (
                                            <tr key={b._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                                                            {b.user.name.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-medium">{b.user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm text-[var(--text-primary)] dark:text-white">{b.property.name}</p>
                                                    <p className="text-xs text-[var(--text-secondary)]">{b.room.name}</p>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-bold text-[var(--text-primary)] dark:text-white">₹{b.amount.total.toLocaleString()}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[b.status] || ""}`}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
