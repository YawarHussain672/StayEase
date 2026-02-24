"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Building2, ArrowRight, Loader2, User, Phone, Home, KeyRound } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setAuth } = useAuthStore();
    const defaultRole = searchParams.get("role") || "user";

    const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: defaultRole });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const updateField = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            toast.error("Please fill required fields");
            return;
        }
        if (form.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        const payload: Partial<typeof form> = { ...form };
        if (!payload.phone) delete payload.phone;

        console.log("Attempting registration with API URL:", api.defaults.baseURL);
        setLoading(true);
        try {
            const { data } = await api.post("/auth/register", payload);
            console.log("Registration success:", data);
            setAuth(data.user, data.token);
            toast.success("Account created successfully!");
            router.push(data.user.role === "owner" ? "/dashboard" : "/");
        } catch (err: any) {
            console.error("Registration error full:", err);
            console.error("Response data:", err.response?.data);
            const errorMsg = err.response?.data?.error || err.message || "Registration failed";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left — Image */}
            <div className="hidden lg:block relative w-1/2 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=1600&fit=crop&q=80"
                    alt="Modern hotel"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/60" />
                <div className="absolute bottom-16 left-12 right-12 text-white z-10">
                    <div className="flex items-center gap-2.5 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold">StayEase</span>
                    </div>
                    <h2 className="text-3xl font-extrabold leading-tight mb-3">
                        {form.role === "owner" ? "List your property & grow" : "Join 50,000+ happy residents"}
                    </h2>
                    <p className="text-white/70 leading-relaxed max-w-sm">
                        {form.role === "owner"
                            ? "Reach thousands of tenants, manage bookings with AI analytics, and grow your occupancy."
                            : "Find your ideal hostel or PG with AI recommendations, secure payments, and 24/7 support."}
                    </p>
                </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
                {/* Animated Background Blobs */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob" />
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000" />
                </div>

                {/* Background for glass effect */}
                <div className="absolute inset-0 z-0" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[420px] glass-panel p-10 relative z-10 shadow-2xl"
                >
                    {/* Mobile logo */}
                    <div className="auth-mobile-logo">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold text-[var(--text-primary)]">StayEase</span>
                    </div>

                    <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-1">Create your account</h1>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">Join StayEase and start your journey</p>

                    <div className="glass-tab-bar mb-6">
                        {[
                            { value: "user", label: "Stay / Book", icon: Home },
                            { value: "owner", label: "Own / List", icon: KeyRound },
                        ].map((r) => (
                            <button
                                key={r.value}
                                onClick={() => updateField("role", r.value)}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-full flex items-center justify-center gap-1.5 transition-all ${form.role === r.value
                                    ? "tab-active"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    }`}
                            >
                                <r.icon className="w-4 h-4" />
                                {r.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">Full Name *</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    placeholder="John Doe"
                                    className="input !pl-11"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">Email *</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--text-muted)]" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    placeholder="you@example.com"
                                    className="input !pl-11"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--text-muted)]" />
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => updateField("phone", e.target.value)}
                                    placeholder="9876543210"
                                    className="input !pl-11"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">Password *</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--text-muted)]" />
                                <input
                                    type={showPw ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e) => updateField("password", e.target.value)}
                                    placeholder="Min 6 characters"
                                    className="input !pl-11 !pr-11"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                >
                                    {showPw ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="glass-btn-primary w-full !py-3 !text-[15px]"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5" style={{ animation: "spin 1s linear infinite" }} />
                            ) : (
                                <>Create Account <ArrowRight className="w-[18px] h-[18px]" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
                        Already have an account?{" "}
                        <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-600" style={{ animation: "spin 1s linear infinite" }} />
                </div>
            }
        >
            <RegisterForm />
        </Suspense>
    );
}
