"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    MapPin, Calendar, CreditCard, FileText, ArrowLeft, Loader2,
    CheckCircle2, XCircle, Clock, Phone, Mail, Download
} from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";

export default function BookingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { router.push("/login"); return; }
        fetchBooking();
    }, [user, params.id]);

    const fetchBooking = async () => {
        const bookingId = params.id as string;
        try {
            const { data } = await api.get(`/bookings/${bookingId}`);
            setBooking(data.booking);
        } catch {
            // Check localStorage for demo bookings first
            if (bookingId.startsWith("demo-")) {
                const localBookings = JSON.parse(localStorage.getItem("demo-bookings") || "[]");
                const localMatch = localBookings.find((b: any) => b._id === bookingId);
                if (localMatch) {
                    setBooking(localMatch);
                    setLoading(false);
                    return;
                }
            }
            // Generic fallback
            setBooking({
                _id: bookingId,
                property: {
                    _id: "1", name: "Urban Nest Co-Living", location: { city: "Mumbai", address: "Andheri West" },
                    images: [{ url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop" }],
                    owner: { name: "Arjun Mehta", phone: "9876543210", email: "arjun@urbannest.in" }
                },
                room: { name: "Double Sharing AC", type: "double" },
                checkIn: "2026-03-01", checkOut: "2026-03-15", guests: 1,
                amount: { subtotal: 8250, tax: 990, discount: 0, total: 9240 },
                status: "confirmed",
                payment: { status: "completed", method: "Razorpay", transactionId: "pay_ABCDEF123" },
                invoiceNumber: "SE-ABC123", createdAt: "2026-02-10T10:30:00",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;

        // Demo handling
        if (booking._id.startsWith("demo-") || !booking._id.match(/^[a-f\d]{24}$/i)) {
            try {
                const localBookings = JSON.parse(localStorage.getItem("demo-bookings") || "[]");
                const updatedBookings = localBookings.map((b: any) =>
                    b._id === booking._id ? { ...b, status: "cancelled" } : b
                );
                localStorage.setItem("demo-bookings", JSON.stringify(updatedBookings));
                // Update state directly — don't refetch (which would overwrite with fallback)
                setBooking((prev: any) => ({ ...prev, status: "cancelled" }));
                toast.success("Booking cancelled successfully (Demo)");
            } catch (err) {
                console.error("Failed to cancel demo booking:", err);
                toast.error("Failed to cancel booking");
            }
            return;
        }

        try {
            await api.put(`/bookings/${booking._id}/cancel`);
            toast.success("Booking cancelled successfully");
            fetchBooking();
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to cancel booking");
        }
    };

    // Load Razorpay Script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        // Handle local storage demo bookings
        if (booking._id.startsWith("demo-") || booking._id === "1") {
            toast.success("[Demo Mode] Payment Simulated Successfully!");
            const localBookings = JSON.parse(localStorage.getItem("demo-bookings") || "[]");
            const updatedBookings = localBookings.map((b: any) =>
                b._id === booking._id ? { ...b, status: "confirmed", payment: { status: "completed" } } : b
            );
            localStorage.setItem("demo-bookings", JSON.stringify(updatedBookings));
            fetchBooking();
            return;
        }

        try {
            console.log("[DEBUG] Initiating payment for booking:", booking._id);
            console.log("[DEBUG] Current Token in localStorage:", localStorage.getItem("stayease-token")?.substring(0, 10) + "...");
            const { data } = await api.post("/payments/create-order", { bookingId: booking._id });

            if (data.isMock) {
                toast.success("[Mock Mode] Simulating Payment...");
                // Simulate Razorpay callback
                await api.post("/payments/verify", {
                    bookingId: booking._id,
                    razorpay_order_id: data.order.id,
                    razorpay_payment_id: "pay_mock_" + Date.now(),
                    razorpay_signature: "mock_signature",
                    isMock: true
                });
                toast.success("[Mock Mode] Payment successful!");
                fetchBooking();
            } else {
                // Real Razorpay Integration
                const res = await loadRazorpayScript();
                if (!res) {
                    toast.error("Razorpay SDK failed to load. Are you online?");
                    return;
                }

                toast.loading("Opening Secure Payment Modal...", { duration: 2000 });

                const options = {
                    key: data.key,
                    amount: data.order.amount,
                    currency: data.order.currency,
                    name: "StayEase",
                    description: `Payment for ${booking.property.name}`,
                    order_id: data.order.id,
                    handler: async function (response: any) {
                        try {
                            const verifyRes = await api.post("/payments/verify", {
                                ...response,
                                bookingId: booking._id
                            });
                            if (verifyRes.data.success) {
                                toast.success("Real Payment Successful!");
                                fetchBooking();
                            }
                        } catch (err) {
                            toast.error("Real Payment verification failed");
                        }
                    },
                    prefill: {
                        name: user?.name,
                        email: user?.email,
                        contact: user?.phone
                    },
                    theme: {
                        color: "#6366f1",
                    },
                };

                const paymentObject = new (window as any).Razorpay(options);
                paymentObject.open();
            }
        } catch (err: any) {
            console.error("Payment failed:", err);
            toast.error(err.response?.data?.error || "Payment failed to initiate");
        }
    };

    if (loading) {
        return (
            <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
        );
    }

    if (!booking) return null;

    const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
        pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
        confirmed: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
        "checked-in": { icon: CheckCircle2, color: "text-indigo-500", bg: "bg-indigo-50" },
        "checked-out": { icon: CheckCircle2, color: "text-gray-500", bg: "bg-gray-50" },
        cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
    };

    const StatusIcon = statusConfig[booking.status]?.icon || Clock;

    const nights = Math.max(1, Math.ceil(
        (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
    ));

    return (
        <div className="pt-24 pb-16 min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {/* Back Button */}
                <button onClick={() => router.back()}
                    className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to bookings
                </button>

                {/* Status Banner */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-3xl mb-6 flex items-center gap-4 glass-panel !shadow-md ${statusConfig[booking.status]?.bg || ""}`}>
                    <StatusIcon className={`w-8 h-8 ${statusConfig[booking.status]?.color || ""}`} />
                    <div>
                        <p className={`font-bold text-xl capitalize ${statusConfig[booking.status]?.color || ""}`}>
                            {booking.status}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)] font-medium">
                            Booking ID: {booking.invoiceNumber || booking._id}
                        </p>
                    </div>
                </motion.div>

                {/* Property Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="p-6 rounded-3xl glass-panel mb-6 border-white/20">
                    <div className="flex gap-5">
                        <div className="w-32 h-24 rounded-2xl overflow-hidden shrink-0">
                            <img src={booking.property.images?.[0]?.url || ""} alt=""
                                className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                            <Link href={`/properties/${booking.property._id}`}
                                className="text-lg font-bold hover:text-[var(--primary)] transition-colors line-clamp-1">
                                {booking.property.name}
                            </Link>
                            <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5 mt-1 font-medium">
                                <MapPin className="w-4 h-4 text-indigo-500" />
                                {booking.property.location?.address}, {booking.property.location?.city}
                            </p>
                            <p className="text-sm text-[var(--text-muted)] mt-2 font-medium">
                                Room: {booking.room?.name} ({booking.room?.type})
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stay Details */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="p-6 rounded-3xl glass-panel mb-6 border-white/20">
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-500" /> Stay Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl glass-panel !bg-black/5 dark:!bg-white/5 !shadow-none !border-none">
                            <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1.5">Check-in</p>
                            <p className="font-bold text-sm text-[var(--text-primary)]">{new Date(booking.checkIn).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                        <div className="p-4 rounded-2xl glass-panel !bg-black/5 dark:!bg-white/5 !shadow-none !border-none">
                            <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1.5">Check-out</p>
                            <p className="font-bold text-sm text-[var(--text-primary)]">{new Date(booking.checkOut).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                        <div className="p-4 rounded-2xl glass-panel !bg-black/5 dark:!bg-white/5 !shadow-none !border-none">
                            <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1.5">Duration</p>
                            <p className="font-bold text-sm text-[var(--text-primary)]">{nights} night{nights > 1 ? "s" : ""}</p>
                        </div>
                        <div className="p-4 rounded-2xl glass-panel !bg-black/5 dark:!bg-white/5 !shadow-none !border-none">
                            <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1.5">Guests</p>
                            <p className="font-bold text-sm text-[var(--text-primary)]">{booking.guests || 1} guest(s)</p>
                        </div>
                    </div>
                </motion.div>

                {/* Payment */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="p-6 rounded-3xl glass-panel mb-6 border-white/20">
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2"><CreditCard className="w-5 h-5 text-indigo-500" /> Payment Summary</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between font-medium">
                            <span className="text-[var(--text-secondary)]">Room Charges</span>
                            <span className="text-[var(--text-primary)]">₹{booking.amount.subtotal?.toLocaleString()}</span>
                        </div>
                        {booking.amount.discount > 0 && (
                            <div className="flex justify-between text-green-500 font-bold">
                                <span>Discount</span>
                                <span>-₹{booking.amount.discount?.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-medium">
                            <span className="text-[var(--text-secondary)]">GST (12%)</span>
                            <span className="text-[var(--text-primary)]">₹{booking.amount.tax?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-white/10 text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                            <span>Total</span>
                            <span>₹{booking.amount.total?.toLocaleString()}</span>
                        </div>
                    </div>
                    {booking.payment?.transactionId && (
                        <div className="mt-6 p-4 rounded-2xl glass-panel !bg-black/5 dark:!bg-white/5 !shadow-none !border-none text-xs text-[var(--text-muted)] font-medium">
                            <p className="flex justify-between mb-1">Method: <span className="text-[var(--text-primary)] font-bold">{booking.payment.method}</span></p>
                            <p className="flex justify-between">Transaction: <span className="text-[var(--text-primary)] font-bold">{booking.payment.transactionId}</span></p>
                        </div>
                    )}
                </motion.div>

                {/* Owner Contact */}
                {booking.property.owner && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="p-6 rounded-3xl glass-panel mb-6 border-white/20">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Phone className="w-5 h-5 text-emerald-500" /> Property Owner</h2>
                        <div className="flex items-center gap-4 p-4 rounded-2xl glass-panel !bg-black/5 dark:!bg-white/5 !shadow-none !border-none mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg">
                                {booking.property.owner.name?.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-sm text-[var(--text-primary)]">{booking.property.owner.name}</p>
                                <p className="text-xs text-[var(--text-muted)] font-medium line-clamp-1">{booking.property.owner.email}</p>
                            </div>
                        </div>
                        <a href={`tel:${booking.property.owner.phone}`}
                            className="glass-btn-ghost !text-sm !py-3 w-full gap-2">
                            <Phone className="w-4 h-4 text-emerald-500 shadow-sm" /> Call Owner
                        </a>
                    </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                    {booking.status === "pending" && booking.payment?.status !== "completed" && (
                        <button onClick={handlePayment} className="glass-btn-primary flex-1 !py-4 shadow-xl">
                            <CreditCard className="w-5 h-5" /> Complete Payment
                        </button>
                    )}
                    {(booking.status === "pending" || booking.status === "confirmed") && (
                        <button onClick={handleCancel}
                            className="flex-1 py-4 rounded-full glass-panel !bg-red-500/10 border-red-500/20 text-red-500 font-bold hover:!bg-red-500/20 transition-all text-sm shadow-sm">
                            <XCircle className="w-4 h-4 inline-block mr-1.5" /> Cancel Booking
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
