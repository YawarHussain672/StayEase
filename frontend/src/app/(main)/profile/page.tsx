"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    User, Mail, Phone, Shield, Camera, MapPin, Calendar,
    Edit3, Save, X, Loader2, Heart, Building2, Star, Bell,
    Moon, Sun, Globe
} from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilePage() {
    const { user, setAuth } = useAuthStore();
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "", email: "", phone: "",
        preferences: { budget: { min: "", max: "" }, preferredCities: [""], preferredType: "hostel" },
    });

    useEffect(() => {
        if (!user) { router.push("/login"); return; }
        const prefs = user.preferences || {};
        setForm({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            preferences: {
                budget: { min: String(prefs.budget?.min || ""), max: String(prefs.budget?.max || "") },
                preferredCities: (prefs.preferredCities?.length ? prefs.preferredCities : [""]),
                preferredType: prefs.preferredType || "hostel",
            },
        });
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const { data } = await api.put("/auth/profile", {
                name: form.name,
                phone: form.phone,
                preferences: {
                    budget: {
                        min: Number(form.preferences.budget.min) || 0,
                        max: Number(form.preferences.budget.max) || 0,
                    },
                    preferredCities: form.preferences.preferredCities.filter(Boolean),
                    preferredType: form.preferences.preferredType,
                },
            });
            setAuth(data.user, localStorage.getItem("token") || "");
            toast.success("Profile updated!");
            setEditing(false);
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="pt-24 pb-16 min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                {/* Profile Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8">
                    <div className="relative inline-block mb-4">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mx-auto">
                            {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white border-4 border-[var(--bg-primary)]">
                            <Camera className="w-3.5 h-3.5" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-[var(--text-secondary)] text-sm flex items-center justify-center gap-1 mt-1">
                        <Shield className="w-3.5 h-3.5" /> {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)} Account
                    </p>
                </motion.div>

                {/* Personal Info */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="p-6 rounded-2xl border border-[var(--border)] mb-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-lg">Personal Information</h2>
                        {!editing ? (
                            <button onClick={() => setEditing(true)}
                                className="flex items-center gap-1 text-sm text-[var(--primary)] font-medium hover:underline">
                                <Edit3 className="w-4 h-4" /> Edit
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => setEditing(false)} className="text-sm text-[var(--text-muted)] hover:text-red-500">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-[var(--text-secondary)]">Full Name</label>
                            {editing ? (
                                <input type="text" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="input !rounded-xl" />
                            ) : (
                                <p className="flex items-center gap-2 text-[var(--text-primary)]">
                                    <User className="w-4 h-4 text-[var(--text-muted)]" /> {user.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-[var(--text-secondary)]">Email</label>
                            <p className="flex items-center gap-2 text-[var(--text-primary)]">
                                <Mail className="w-4 h-4 text-[var(--text-muted)]" /> {user.email}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-[var(--text-secondary)]">Phone</label>
                            {editing ? (
                                <input type="tel" value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="9876543210" className="input !rounded-xl" />
                            ) : (
                                <p className="flex items-center gap-2 text-[var(--text-primary)]">
                                    <Phone className="w-4 h-4 text-[var(--text-muted)]" /> {user.phone || "Not provided"}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-[var(--text-secondary)]">Member Since</label>
                            <p className="flex items-center gap-2 text-[var(--text-primary)]">
                                <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "Recently"}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Preferences (for users) */}
                {user.role === "user" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl border border-[var(--border)] mb-6">
                        <h2 className="font-semibold text-lg mb-5">Search Preferences</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Min Budget (₹)</label>
                                    <input type="number" value={form.preferences.budget.min}
                                        onChange={(e) => setForm(prev => ({
                                            ...prev, preferences: { ...prev.preferences, budget: { ...prev.preferences.budget, min: e.target.value } }
                                        }))}
                                        placeholder="3000" className="input !rounded-xl" disabled={!editing} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Max Budget (₹)</label>
                                    <input type="number" value={form.preferences.budget.max}
                                        onChange={(e) => setForm(prev => ({
                                            ...prev, preferences: { ...prev.preferences, budget: { ...prev.preferences.budget, max: e.target.value } }
                                        }))}
                                        placeholder="15000" className="input !rounded-xl" disabled={!editing} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">Preferred Stay Type</label>
                                <select value={form.preferences.preferredType}
                                    onChange={(e) => setForm(prev => ({
                                        ...prev, preferences: { ...prev.preferences, preferredType: e.target.value }
                                    }))}
                                    className="input !rounded-xl" disabled={!editing}>
                                    <option value="hostel">Hostel</option>
                                    <option value="pg">PG</option>
                                    <option value="budget-hotel">Budget Hotel</option>
                                    <option value="co-living">Co-Living</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Save Button */}
                {editing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <button onClick={handleSave} disabled={loading}
                            className="w-full btn-primary !py-3.5 justify-center text-base">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
                        </button>
                    </motion.div>
                )}

                {/* Quick Links */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="mt-6 p-6 rounded-2xl border border-[var(--border)]">
                    <h2 className="font-semibold text-lg mb-4">Quick Links</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {user.role === "user" && (
                            <>
                                <a href="/bookings" className="p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--primary)]/5 transition-colors text-sm font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[var(--primary)]" /> My Bookings
                                </a>
                                <a href="/properties" className="p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--primary)]/5 transition-colors text-sm font-medium flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-[var(--primary)]" /> Saved Properties
                                </a>
                            </>
                        )}
                        {(user.role === "owner" || user.role === "admin") && (
                            <>
                                <a href="/dashboard" className="p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--primary)]/5 transition-colors text-sm font-medium flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-[var(--primary)]" /> Dashboard
                                </a>
                                <a href="/dashboard/my-properties" className="p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--primary)]/5 transition-colors text-sm font-medium flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-[var(--primary)]" /> My Properties
                                </a>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
