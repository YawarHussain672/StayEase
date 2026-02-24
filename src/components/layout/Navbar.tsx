"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2, Menu, X, Sun, Moon, ChevronDown,
    User, LogOut, LayoutDashboard, Calendar, Home, Compass,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuthStore } from "@/store";

const NAV_LINKS = [
    { href: "/", label: "Home", icon: Home },
    { href: "/properties", label: "Explore", icon: Compass },
];

const SPRING = { type: "spring", stiffness: 400, damping: 30, mass: 0.8 } as const;

export default function Navbar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuthStore();

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [manualExpand, setManualExpand] = useState(false);

    const profileRef = useRef<HTMLDivElement>(null);
    const isHome = pathname === "/";
    const isExpanded = !isHome || scrolled || manualExpand;
    const isDark = theme === "dark";

    // Scroll listener
    useEffect(() => {
        const onScroll = () => {
            const s = window.scrollY > 20;
            setScrolled(s);
            if (!s) { setManualExpand(false); setMobileOpen(false); }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);
        setManualExpand(false);
    }, [pathname]);

    // Close profile dropdown on outside click
    useEffect(() => {
        if (!profileOpen) return;
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [profileOpen]);

    return (
        <>
            {/* ───────────────────────────────────────────────
          PILL NAVBAR
          Fixed, centered, max-width 1200px
      ─────────────────────────────────────────────── */}
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 px-3 pointer-events-none">
                <motion.div
                    animate={{ maxWidth: isExpanded ? 1200 : 176 }}
                    transition={SPRING}
                    className="pointer-events-auto relative w-full"
                    style={{ borderRadius: 9999 }}
                >
                    {/* Glass background */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            backgroundColor: isExpanded
                                ? isDark ? "rgba(12,18,36,0.60)" : "rgba(255,255,255,0.55)"
                                : isDark ? "rgba(8,8,20,0.88)" : "rgba(255,255,255,0.82)",
                            borderColor: isExpanded
                                ? isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.70)"
                                : isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.08)",
                        }}
                        style={{
                            borderRadius: "inherit",
                            border: "1.5px solid transparent",
                            backdropFilter: "blur(32px) saturate(180%)",
                            WebkitBackdropFilter: "blur(32px) saturate(180%)",
                            boxShadow: isDark
                                ? "0 8px 32px -8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)"
                                : "0 8px 32px -8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.90)",
                        }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Nav row */}
                    <div className="relative z-10 flex items-center gap-2 h-11 px-3">

                        {/* Logo */}
                        <Link
                            href="/"
                            onClick={() => !isExpanded && setManualExpand(true)}
                            className="flex items-center gap-2 shrink-0"
                        >
                            <motion.div
                                transition={SPRING}
                                className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                                animate={{ backgroundColor: isExpanded ? "#4f46e5" : isDark ? "rgba(255,255,255,0.15)" : "rgba(79,70,229,0.12)" }}
                            >
                                <Building2 className="w-[14px] h-[14px]" style={{ color: isExpanded ? "#fff" : isDark ? "#fff" : "#4f46e5" }} />
                            </motion.div>
                            <span
                                className="text-[13px] font-bold whitespace-nowrap"
                                style={{ color: isExpanded ? (isDark ? "#f1f5f9" : "#0f172a") : isDark ? "#fff" : "#0f172a" }}
                            >
                                Stay<span className="text-indigo-500">Ease</span>
                            </span>
                        </Link>

                        {/* Desktop center links */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.nav
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.18 }}
                                    className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2"
                                >
                                    {NAV_LINKS.map(({ href, label }) => {
                                        const active = pathname === href;
                                        return (
                                            <Link key={href} href={href}
                                                className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150"
                                                style={{
                                                    color: active ? "#6366f1" : isDark ? "rgba(241,245,249,0.6)" : "rgba(15,23,42,0.55)",
                                                    background: active ? "rgba(99,102,241,0.10)" : "transparent",
                                                }}
                                            >
                                                {label}
                                            </Link>
                                        );
                                    })}
                                </motion.nav>
                            )}
                        </AnimatePresence>

                        {/* Right side */}
                        <div className="flex items-center gap-1 ml-auto shrink-0">

                            {/* Compact: click to expand */}
                            {!isExpanded && (
                                <button type="button" onClick={() => setManualExpand(true)}
                                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                                    style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.6)" }}
                                    aria-label="Open menu"
                                >
                                    <Menu className="w-3.5 h-3.5" />
                                </button>
                            )}

                            {/* Desktop: theme toggle */}
                            {isExpanded && (
                                <button type="button" onClick={toggleTheme}
                                    className="hidden md:flex w-8 h-8 rounded-full items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                                    style={{ color: isDark ? "rgba(241,245,249,0.6)" : "rgba(15,23,42,0.5)" }}
                                    aria-label="Toggle theme"
                                >
                                    {isDark ? <Sun className="w-[15px] h-[15px]" /> : <Moon className="w-[15px] h-[15px]" />}
                                </button>
                            )}

                            {/* Desktop: auth */}
                            {isExpanded && (
                                <div className="hidden md:flex items-center gap-1.5">
                                    {user ? (
                                        <div className="relative" ref={profileRef}>
                                            <button type="button"
                                                onClick={() => setProfileOpen(v => !v)}
                                                className="flex items-center gap-1.5 px-2 py-1.5 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                                                style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
                                            >
                                                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                                                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                                                </div>
                                                <span className="text-sm font-medium max-w-[80px] truncate">
                                                    {user.name?.split(" ")[0]}
                                                </span>
                                                <motion.div animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                                    <ChevronDown className="w-3 h-3 opacity-40" />
                                                </motion.div>
                                            </button>

                                            {/* Dropdown — NOT inside overflow:hidden, so no clipping */}
                                            <AnimatePresence>
                                                {profileOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                        transition={SPRING}
                                                        className="absolute right-0 top-full mt-2 w-56 glass-panel !rounded-2xl p-1.5 z-[100] shadow-2xl"
                                                    >
                                                        <div className="px-3 py-2.5 border-b border-[var(--border)] mb-1">
                                                            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
                                                            <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                                                        </div>
                                                        {[
                                                            { href: "/profile", icon: User, label: "Profile" },
                                                            { href: "/bookings", icon: Calendar, label: "My Bookings" },
                                                            ...((user.role === "owner" || user.role === "admin")
                                                                ? [{ href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" }]
                                                                : []),
                                                        ].map(item => (
                                                            <Link key={item.href} href={item.href}
                                                                className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-white/20 dark:hover:bg-white/10 rounded-xl transition-colors"
                                                            >
                                                                <item.icon className="w-4 h-4 shrink-0" /> {item.label}
                                                            </Link>
                                                        ))}
                                                        <div className="border-t border-[var(--border)] mt-1 pt-1">
                                                            <button onClick={logout}
                                                                className="flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 w-full rounded-xl transition-colors"
                                                            >
                                                                <LogOut className="w-4 h-4 shrink-0" /> Sign Out
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <>
                                            <Link href="/login"
                                                className="text-sm font-semibold px-3 py-1.5 rounded-full transition-colors"
                                                style={{ color: isDark ? "rgba(241,245,249,0.7)" : "rgba(15,23,42,0.6)" }}
                                            >
                                                Sign In
                                            </Link>
                                            <Link href="/register"
                                                className="text-sm font-bold px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                                            >
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Mobile hamburger — only when expanded */}
                            {isExpanded && (
                                <button type="button"
                                    onClick={() => setMobileOpen(v => !v)}
                                    className="md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
                                    style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
                                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        {mobileOpen
                                            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-4 h-4" /></motion.span>
                                            : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-4 h-4" /></motion.span>
                                        }
                                    </AnimatePresence>
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ───────────────────────────────────────────────
          MOBILE MENU — separate fixed layer below pill
          Avoids all overflow/clipping issues
      ─────────────────────────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed top-[68px] left-3 right-3 z-40 md:hidden rounded-2xl overflow-hidden shadow-2xl pointer-events-auto"
                        style={{
                            backdropFilter: "blur(32px) saturate(180%)",
                            WebkitBackdropFilter: "blur(32px) saturate(180%)",
                            background: isDark ? "rgba(12,18,36,0.92)" : "rgba(255,255,255,0.92)",
                            border: `1.5px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.80)"}`,
                        }}
                    >
                        <div className="px-3 py-3 space-y-0.5">
                            {/* Nav links */}
                            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                                <Link key={href} href={href}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                                    style={{
                                        color: pathname === href ? "#6366f1" : isDark ? "#e2e8f0" : "#334155",
                                        background: pathname === href ? "rgba(99,102,241,0.10)" : "transparent",
                                    }}
                                >
                                    <Icon className="w-4 h-4 shrink-0" /> {label}
                                </Link>
                            ))}

                            <div className="h-px my-1" style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)" }} />

                            {/* Theme toggle */}
                            <button type="button" onClick={toggleTheme}
                                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                                style={{ color: isDark ? "#e2e8f0" : "#334155" }}
                            >
                                {isDark ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
                                {isDark ? "Light Mode" : "Dark Mode"}
                            </button>

                            <div className="h-px my-1" style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)" }} />

                            {/* Auth */}
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2.5 px-3 py-2">
                                        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold truncate" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>{user.name}</p>
                                            <p className="text-xs truncate" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>{user.email}</p>
                                        </div>
                                    </div>
                                    {[
                                        { href: "/profile", icon: User, label: "Profile" },
                                        { href: "/bookings", icon: Calendar, label: "My Bookings" },
                                        ...((user.role === "owner" || user.role === "admin")
                                            ? [{ href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" }]
                                            : []),
                                    ].map(item => (
                                        <Link key={item.href} href={item.href}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                            style={{ color: isDark ? "#e2e8f0" : "#334155" }}
                                        >
                                            <item.icon className="w-4 h-4 shrink-0" /> {item.label}
                                        </Link>
                                    ))}
                                    <button type="button" onClick={logout}
                                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4 shrink-0" /> Sign Out
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 py-1">
                                    <Link href="/login"
                                        className="block text-center px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                                        style={{
                                            color: isDark ? "#f8fafc" : "#0f172a",
                                            borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
                                        }}
                                    >
                                        Sign In
                                    </Link>
                                    <Link href="/register"
                                        className="block text-center px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
