"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, CreditCard, FileText, ExternalLink, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const STATUS_COLORS: Record<string, string> = {
    pending: "badge-warning dark:text-amber-300 dark:bg-amber-500/15",
    confirmed: "badge-success dark:text-emerald-300 dark:bg-emerald-500/15",
    "checked-in": "badge-primary dark:text-indigo-300 dark:bg-indigo-500/15",
    "checked-out": "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
    cancelled: "badge-danger dark:text-red-300 dark:bg-red-500/15",
};

const DEMO_BOOKINGS = [
    {
        _id: "b1",
        property: { _id: "1", name: "Urban Nest Co-Living", location: { city: "Mumbai", address: "Andheri West" }, images: [{ url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=300&h=200&fit=crop" }] },
        room: { name: "Double Sharing AC", type: "double", price: { daily: 550 } },
        checkIn: "2026-03-01", checkOut: "2026-03-15",
        amount: { subtotal: 8250, tax: 990, total: 9240 },
        status: "confirmed", payment: { status: "completed" },
        invoiceNumber: "SE-ABC123", createdAt: "2026-02-10",
    },
    {
        _id: "b2",
        property: { _id: "3", name: "Silicon Stay PG", location: { city: "Bangalore", address: "Koramangala" }, images: [{ url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop" }] },
        room: { name: "Single Room AC", type: "single", price: { daily: 800 } },
        checkIn: "2026-01-10", checkOut: "2026-01-25",
        amount: { subtotal: 12000, tax: 1440, total: 13440 },
        status: "checked-out", payment: { status: "completed" },
        invoiceNumber: "SE-DEF456", createdAt: "2026-01-05",
    },
];

export default function BookingsPage() {
    const { user, isLoading } = useAuthStore();
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            router.push("/login?redirect=/bookings");
            return;
        }
        fetchBookings();
    }, [user, isLoading]);

    const fetchBookings = async () => {
        setDataLoading(true); // Start loading
        try {
            console.log("Fetching bookings...");
            const { data } = await api.get("/bookings/my");
            console.log("[DEBUG] API Bookings response:", data);
            console.log("API Bookings received:", data?.bookings?.length || 0);

            // Get local demo bookings
            const localBookingsJSON = localStorage.getItem("demo-bookings");
            const localBookings = localBookingsJSON ? JSON.parse(localBookingsJSON) : [];

            // Real API bookings
            const apiBookings = data.bookings || [];

            // Combine them all
            // If user has NO real bookings, we still show the static DEMO_BOOKINGS for better UX
            const baseList = apiBookings.length === 0 ? [...localBookings, ...DEMO_BOOKINGS] : [...localBookings, ...apiBookings];

            // Sort by creation date (newest first)
            const sorted = baseList.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return dateB - dateA;
            });

            console.log("Total merged bookings:", sorted.length);
            setBookings(sorted);
        } catch (err: any) {
            console.error("Failed to fetch bookings:", err);
            // On error, still show something
            const localBookings = JSON.parse(localStorage.getItem("demo-bookings") || "[]");
            setBookings([...localBookings, ...DEMO_BOOKINGS]);

            // Handle 401 specifically if needed, but the interceptor already does it
            if (err.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
            } else {
                toast.error("Failed to load your latest bookings.");
            }
        } finally {
            setDataLoading(false);
        }
    };

    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);

    const handleCancel = async (id: string) => {
        // First click — ask for confirmation inline (no window.confirm which can be blocked)
        if (confirmingId !== id) {
            setConfirmingId(id);
            // Auto-reset after 4 seconds if user doesn't click again
            setTimeout(() => setConfirmingId(prev => prev === id ? null : prev), 4000);
            return;
        }

        // Second click — confirmed, proceed
        setConfirmingId(null);
        setCancellingId(id);

        // Check if it's a demo/static booking
        if (id.startsWith("demo-") || id === "b1" || id === "b2") {
            try {
                // Update state directly (demo bookings may not exist in localStorage)
                setBookings(prev => prev.map(b => b._id === id ? { ...b, status: "cancelled" } : b));

                // Also update localStorage if it exists there
                const localBookings = JSON.parse(localStorage.getItem("demo-bookings") || "[]");
                const updated = localBookings.map((b: any) =>
                    b._id === id ? { ...b, status: "cancelled" } : b
                );
                localStorage.setItem("demo-bookings", JSON.stringify(updated));

                toast.success("Booking cancelled");
            } catch (err) {
                toast.error("Failed to cancel booking");
            } finally {
                setCancellingId(null);
            }
            return;
        }

        try {
            console.log("[DEBUG] Attempting to cancel REAL booking:", id);
            const res = await api.put(`/bookings/${id}/cancel`);
            console.log("[DEBUG] Cancel response:", res.data);
            toast.success("Booking cancelled");
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status: "cancelled" } : b));
        } catch (err: any) {
            console.error("Cancel error:", err);
            const errorMsg = err.response?.data?.error || err.message || "Failed to cancel booking";
            toast.error(errorMsg);
        } finally {
            setCancellingId(null);
        }
    };

    const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

    return (
        <div className="pt-24 pb-16 min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Bookings</h1>
                <p className="text-[var(--text-secondary)] mb-8">{bookings.length} total bookings</p>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {["all", "pending", "confirmed", "checked-in", "checked-out", "cancelled"].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all ${filter === f ? "bg-[var(--primary)] text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                                }`}>
                            {f}
                        </button>
                    ))}
                </div>

                {dataLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="space-y-4">
                        {filtered.map((booking, i) => (
                            <motion.div
                                key={booking._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-6 rounded-3xl glass-panel hover:shadow-xl transition-all border-white/20"
                            >
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Image */}
                                    <div className="w-full sm:w-36 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                                        {booking.property?.images?.[0]?.url ? (
                                            <img src={booking.property.images[0].url} alt=""
                                                className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <Link href={`/properties/${booking.property?._id || "#"}`}
                                                className="font-semibold hover:text-[var(--primary)] transition-colors line-clamp-1">
                                                {booking.property?.name || "Unknown Property"}
                                            </Link>
                                            <span className={`badge shrink-0 capitalize ${STATUS_COLORS[booking.status] || ""}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1 mb-2">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {booking.property?.location?.address || "N/A"}, {booking.property?.location?.city || "N/A"}
                                        </p>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--text-secondary)]">
                                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />
                                                {new Date(booking.checkIn).toLocaleDateString()} → {new Date(booking.checkOut).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" />
                                                ₹{booking.amount.total.toLocaleString()}
                                            </span>
                                            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />
                                                {booking.invoiceNumber}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex sm:flex-col gap-2 shrink-0">
                                        <Link href={`/bookings/${booking._id}`}
                                            className="btn-secondary !text-xs !py-2 !px-3">
                                            View Details
                                        </Link>
                                        {(booking.status === "pending" || booking.status === "confirmed") && (
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                disabled={cancellingId === booking._id}
                                                className={`text-xs py-2 px-3 rounded-full border transition-all ${confirmingId === booking._id
                                                    ? "border-orange-400 bg-orange-50 text-orange-600 font-semibold"
                                                    : "border-red-200 text-red-500 hover:bg-red-50"
                                                    } ${cancellingId === booking._id ? "opacity-50 cursor-not-allowed" : ""}`}
                                            >
                                                {cancellingId === booking._id
                                                    ? <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />Cancelling…</span>
                                                    : confirmingId === booking._id
                                                        ? "Confirm?"
                                                        : "Cancel"
                                                }
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Calendar className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                        <p className="text-[var(--text-secondary)] mb-6">Start exploring properties and book your first stay!</p>
                        <Link href="/properties" className="btn-primary">Explore Properties</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
