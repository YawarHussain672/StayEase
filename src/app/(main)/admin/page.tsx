"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Building2, Users, Calendar, CreditCard, TrendingUp, AlertTriangle,
    Star, BarChart3, Shield, CheckCircle2, XCircle, Eye, Search,
    ChevronRight, Loader2, UserCheck, UserX, Flag, MessageSquare
} from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

const ADMIN_TABS = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "properties", label: "Properties", icon: Building2 },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "complaints", label: "Complaints", icon: AlertTriangle },
];

const DEMO_ADMIN_STATS = {
    totalUsers: 1250, totalOwners: 85, totalProperties: 320, pendingVerifications: 12,
    totalBookings: 4580, totalRevenue: 12500000, flaggedReviews: 8, openComplaints: 15,
};

const DEMO_USERS = [
    { _id: "u1", name: "Rahul Sharma", email: "rahul@example.com", role: "user", createdAt: "2025-08-15", status: "active" },
    { _id: "u2", name: "Priya Kapoor", email: "priya@example.com", role: "owner", createdAt: "2025-09-20", status: "active" },
    { _id: "u3", name: "Amit Desai", email: "amit@example.com", role: "user", createdAt: "2025-10-05", status: "active" },
    { _id: "u4", name: "Sneha Patel", email: "sneha@example.com", role: "owner", createdAt: "2025-11-12", status: "active" },
    { _id: "u5", name: "Vikram Singh", email: "vikram@example.com", role: "user", createdAt: "2025-12-01", status: "suspended" },
];

const DEMO_PENDING_PROPS = [
    { _id: "pp1", name: "Sunrise PG", type: "pg", owner: { name: "Arjun M." }, location: { city: "Mumbai" }, createdAt: "2026-02-10", verified: false },
    { _id: "pp2", name: "Green Valley Hostel", type: "hostel", owner: { name: "Ravi K." }, location: { city: "Pune" }, createdAt: "2026-02-12", verified: false },
    { _id: "pp3", name: "BlueStar Lodge", type: "budget-hotel", owner: { name: "Deepa S." }, location: { city: "Chennai" }, createdAt: "2026-02-14", verified: false },
];

const DEMO_FLAGGED_REVIEWS = [
    { _id: "fr1", user: { name: "Anon User" }, property: { name: "Urban Nest" }, rating: 1, text: "Terrible place, fake photos everywhere!", flagged: true, flagReason: "Potentially abusive", createdAt: "2026-02-08" },
    { _id: "fr2", user: { name: "Bot123" }, property: { name: "Silicon Stay" }, rating: 5, text: "Best best best best amazing amazing", flagged: true, flagReason: "Suspected fake", createdAt: "2026-02-11" },
];

const DEMO_COMPLAINTS = [
    { _id: "c1", user: { name: "Rahul S." }, property: { name: "Urban Nest" }, category: "maintenance", priority: "high", status: "open", title: "AC not working for 3 days", createdAt: "2026-02-13" },
    { _id: "c2", user: { name: "Priya K." }, property: { name: "Green Meadows" }, category: "hygiene", priority: "medium", status: "in-progress", title: "Washroom cleaning issue", createdAt: "2026-02-12" },
    { _id: "c3", user: { name: "Amit D." }, property: { name: "Silicon Stay" }, category: "security", priority: "critical", status: "open", title: "Main gate lock broken", createdAt: "2026-02-14" },
];

export default function AdminDashboardPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [pendingProps, setPendingProps] = useState<any[]>([]);
    const [flaggedReviews, setFlaggedReviews] = useState<any[]>([]);
    const [complaints, setComplaints] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!user || user.role !== "admin") {
            router.push("/login");
            return;
        }
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get("/dashboard/stats"),
                api.get("/auth/users"),
            ]);
            setStats(statsRes.data.stats);
            setUsers(usersRes.data.users || []);
        } catch {
            setStats(DEMO_ADMIN_STATS);
            setUsers(DEMO_USERS);
            setPendingProps(DEMO_PENDING_PROPS);
            setFlaggedReviews(DEMO_FLAGGED_REVIEWS);
            setComplaints(DEMO_COMPLAINTS);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyProperty = async (id: string) => {
        try {
            await api.put(`/properties/${id}`, { verified: true });
            toast.success("Property verified");
            setPendingProps(prev => prev.filter(p => p._id !== id));
        } catch {
            toast.success("Property verified (demo)");
            setPendingProps(prev => prev.filter(p => p._id !== id));
        }
    };

    const handleApproveReview = async (id: string) => {
        try {
            await api.put(`/reviews/${id}/flag`, { flagged: false });
            toast.success("Review approved");
            setFlaggedReviews(prev => prev.filter(r => r._id !== id));
        } catch {
            toast.success("Review approved (demo)");
            setFlaggedReviews(prev => prev.filter(r => r._id !== id));
        }
    };

    const handleRemoveReview = async (id: string) => {
        try {
            await api.delete(`/reviews/${id}`);
            toast.success("Review removed");
            setFlaggedReviews(prev => prev.filter(r => r._id !== id));
        } catch {
            toast.success("Review removed (demo)");
            setFlaggedReviews(prev => prev.filter(r => r._id !== id));
        }
    };

    const handleComplaintStatus = async (id: string, status: string) => {
        try {
            await api.put(`/complaints/${id}`, { status });
            toast.success(`Complaint ${status}`);
            setComplaints(prev => prev.map(c => c._id === id ? { ...c, status } : c));
        } catch {
            toast.success(`Complaint ${status} (demo)`);
            setComplaints(prev => prev.map(c => c._id === id ? { ...c, status } : c));
        }
    };

    if (loading) {
        return (
            <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
        );
    }

    const PRIORITY_COLORS: Record<string, string> = {
        low: "text-green-500 bg-green-50",
        medium: "text-amber-500 bg-amber-50",
        high: "text-orange-500 bg-orange-50",
        critical: "text-red-500 bg-red-50",
    };

    const STATUS_COLORS: Record<string, string> = {
        open: "text-red-500 bg-red-50",
        "in-progress": "text-amber-500 bg-amber-50",
        resolved: "text-green-500 bg-green-50",
        closed: "text-gray-500 bg-gray-50",
    };

    return (
        <div className="pt-24 pb-16 min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-[var(--text-secondary)] mb-6">Manage users, properties, reviews, and complaints</p>

                {/* Tabs */}
                <div className="flex gap-1 mb-8 overflow-x-auto pb-2 border-b border-[var(--border)]">
                    {ADMIN_TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-lg transition-all ${activeTab === tab.id
                                    ? "bg-[var(--primary)]/10 text-[var(--primary)] border-b-2 border-[var(--primary)]"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                                }`}>
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "from-indigo-500 to-purple-500" },
                                { label: "Properties", value: stats?.totalProperties || 0, icon: Building2, color: "from-cyan-500 to-blue-500" },
                                { label: "Total Revenue", value: `₹${((stats?.totalRevenue || 0) / 100000).toFixed(1)}L`, icon: CreditCard, color: "from-emerald-500 to-green-500" },
                                { label: "Open Complaints", value: stats?.openComplaints || 0, icon: AlertTriangle, color: "from-red-500 to-orange-500" },
                            ].map((stat, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    className="p-5 rounded-2xl border border-[var(--border)]">
                                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Attention Needed */}
                            <div className="p-5 rounded-2xl border border-[var(--border)]">
                                <h3 className="font-semibold mb-4">⚡ Needs Attention</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10">
                                        <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Pending verifications</span>
                                        <span className="text-sm font-bold text-amber-600">{stats?.pendingVerifications || 12}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-500/10">
                                        <span className="text-sm font-medium text-red-700 dark:text-red-400">Flagged reviews</span>
                                        <span className="text-sm font-bold text-red-600">{stats?.flaggedReviews || 8}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10">
                                        <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Open complaints</span>
                                        <span className="text-sm font-bold text-orange-600">{stats?.openComplaints || 15}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="p-5 rounded-2xl border border-[var(--border)]">
                                <h3 className="font-semibold mb-4">📊 Platform Stats</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: "Total Owners", value: stats?.totalOwners || 85 },
                                        { label: "Total Bookings", value: stats?.totalBookings || 4580 },
                                        { label: "Pending Verifications", value: stats?.pendingVerifications || 12 },
                                        { label: "This Month Revenue", value: `₹${((stats?.monthlyRevenue || 680000) / 1000).toFixed(0)}K` },
                                    ].map(s => (
                                        <div key={s.label} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)]">
                                            <span className="text-sm text-[var(--text-secondary)]">{s.label}</span>
                                            <span className="text-sm font-semibold">{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === "users" && (
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search users..." className="input !pl-11 !rounded-xl !text-sm" />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[var(--bg-secondary)] text-left text-sm text-[var(--text-muted)]">
                                        <th className="px-4 py-3 font-medium">User</th>
                                        <th className="px-4 py-3 font-medium">Role</th>
                                        <th className="px-4 py-3 font-medium">Joined</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                                        <tr key={u._id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{u.name}</p>
                                                        <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`badge text-xs capitalize ${u.role === "admin" ? "badge-primary" : u.role === "owner" ? "badge-success" : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-semibold ${u.status === "active" ? "text-green-500" : "text-red-500"}`}>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button className="text-xs text-[var(--primary)] hover:underline">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Properties Tab */}
                {activeTab === "properties" && (
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Pending Verification ({pendingProps.length})</h3>
                        {pendingProps.length > 0 ? (
                            <div className="space-y-3">
                                {pendingProps.map(p => (
                                    <div key={p._id} className="flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-50/50 dark:bg-amber-500/5 dark:border-amber-500/20">
                                        <div>
                                            <p className="font-medium">{p.name}</p>
                                            <p className="text-sm text-[var(--text-secondary)]">
                                                {p.type} • {p.location.city} • Owner: {p.owner.name} • Listed {new Date(p.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleVerifyProperty(p._id)}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors">
                                                <CheckCircle2 className="w-3 h-3" /> Verify
                                            </button>
                                            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">
                                                <XCircle className="w-3 h-3" /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-10 text-[var(--text-muted)]">No properties pending verification ✓</p>
                        )}
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Flagged Reviews ({flaggedReviews.length})</h3>
                        {flaggedReviews.length > 0 ? (
                            <div className="space-y-3">
                                {flaggedReviews.map(r => (
                                    <div key={r._id} className="p-4 rounded-xl border border-red-200 bg-red-50/50 dark:bg-red-500/5 dark:border-red-500/20">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold">{r.user.name}</span>
                                                    <span className="text-xs text-[var(--text-muted)]">on {r.property.name}</span>
                                                    <div className="flex items-center gap-0.5">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-[var(--text-secondary)]">{r.text}</p>
                                                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                    <Flag className="w-3 h-3" /> {r.flagReason}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button onClick={() => handleApproveReview(r._id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold">
                                                    <CheckCircle2 className="w-3 h-3" /> Approve
                                                </button>
                                                <button onClick={() => handleRemoveReview(r._id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold">
                                                    <XCircle className="w-3 h-3" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-10 text-[var(--text-muted)]">No flagged reviews ✓</p>
                        )}
                    </div>
                )}

                {/* Complaints Tab */}
                {activeTab === "complaints" && (
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Complaints ({complaints.length})</h3>
                        <div className="space-y-3">
                            {complaints.map(c => (
                                <div key={c._id} className="p-4 rounded-xl border border-[var(--border)]">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium">{c.title}</p>
                                            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                                {c.user.name} • {c.property.name} • {c.category}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${PRIORITY_COLORS[c.priority] || ""}`}>
                                                    {c.priority}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[c.status] || ""}`}>
                                                    {c.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            {c.status === "open" && (
                                                <button onClick={() => handleComplaintStatus(c._id, "in-progress")}
                                                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-semibold">
                                                    Start Working
                                                </button>
                                            )}
                                            {(c.status === "open" || c.status === "in-progress") && (
                                                <button onClick={() => handleComplaintStatus(c._id, "resolved")}
                                                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold">
                                                    Resolve
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
