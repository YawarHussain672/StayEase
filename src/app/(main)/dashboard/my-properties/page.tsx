"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Building2, Plus, Edit3, Trash2, Eye, ToggleLeft, ToggleRight,
    MapPin, Star, Users, Loader2, MoreVertical, CheckCircle2, XCircle
} from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DEMO_OWNER_PROPERTIES = [
    {
        _id: "op1", name: "Urban Nest Co-Living", type: "hostel", gender: "coed",
        location: { city: "Mumbai", address: "Andheri West" },
        images: [{ url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop" }],
        pricing: { startingFrom: 8500 }, avgRating: 4.6, totalReviews: 128, verified: true,
        totalRooms: 12, occupiedBeds: 38, totalBeds: 48, active: true,
    },
    {
        _id: "op2", name: "Silicon Stay PG", type: "pg", gender: "male",
        location: { city: "Bangalore", address: "Koramangala" },
        images: [{ url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop" }],
        pricing: { startingFrom: 9000 }, avgRating: 4.7, totalReviews: 215, verified: true,
        totalRooms: 18, occupiedBeds: 56, totalBeds: 65, active: true,
    },
    {
        _id: "op3", name: "Green Meadows PG", type: "pg", gender: "female",
        location: { city: "Pune", address: "Hinjewadi" },
        images: [{ url: "https://images.unsplash.com/photo-1522771739544-6c7b8e740f4e?w=400&h=300&fit=crop" }],
        pricing: { startingFrom: 7000 }, avgRating: 4.5, totalReviews: 89, verified: false,
        totalRooms: 8, occupiedBeds: 20, totalBeds: 30, active: true,
    },
];

export default function MyPropertiesPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || (user.role !== "owner" && user.role !== "admin")) {
            router.push("/login");
            return;
        }
        fetchProperties();
    }, [user]);

    const fetchProperties = async () => {
        try {
            const { data } = await api.get("/properties/my-properties");
            setProperties(data.properties || []);
        } catch {
            setProperties(DEMO_OWNER_PROPERTIES);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this property?")) return;
        try {
            await api.delete(`/properties/${id}`);
            toast.success("Property deleted");
            setProperties(prev => prev.filter(p => p._id !== id));
        } catch {
            toast.success("Property deleted (demo)");
            setProperties(prev => prev.filter(p => p._id !== id));
        }
    };

    if (loading) {
        return (
            <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">My Properties</h1>
                        <p className="text-[var(--text-secondary)] mt-1">{properties.length} properties listed</p>
                    </div>
                    <Link href="/dashboard/add-property" className="btn-primary !text-sm flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Property
                    </Link>
                </div>

                {properties.length === 0 ? (
                    <div className="text-center py-20">
                        <Building2 className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
                        <p className="text-[var(--text-secondary)] mb-6">List your first property to start receiving bookings</p>
                        <Link href="/dashboard/add-property" className="btn-primary">Add Your First Property</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {properties.map((prop, i) => (
                            <motion.div
                                key={prop._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex gap-4 p-4 rounded-2xl border border-[var(--border)] hover:shadow-md transition-shadow"
                            >
                                {/* Image */}
                                <div className="w-32 h-24 sm:w-40 sm:h-28 rounded-xl overflow-hidden shrink-0">
                                    <img src={prop.images?.[0]?.url || ""} alt={prop.name}
                                        className="w-full h-full object-cover" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold">{prop.name}</h3>
                                                {prop.verified ? (
                                                    <span className="flex items-center gap-0.5 text-xs text-emerald-500 font-semibold">
                                                        <CheckCircle2 className="w-3 h-3" /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-0.5 text-xs text-amber-500 font-semibold">
                                                        <XCircle className="w-3 h-3" /> Pending
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                                                <MapPin className="w-3 h-3" />
                                                {prop.location?.address}, {prop.location?.city}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                                        <span className="text-sm text-[var(--text-secondary)]">
                                            <span className="font-semibold text-[var(--text-primary)]">₹{prop.pricing?.startingFrom?.toLocaleString()}</span>/mo
                                        </span>
                                        <span className="text-sm flex items-center gap-1 text-amber-500">
                                            <Star className="w-3.5 h-3.5 fill-current" /> {prop.avgRating} ({prop.totalReviews})
                                        </span>
                                        <span className="text-sm text-[var(--text-muted)]">
                                            {prop.occupiedBeds || 0}/{prop.totalBeds || 0} beds occupied
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                                            {prop.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-1 shrink-0">
                                    <Link href={`/properties/${prop._id}`}
                                        className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors" title="View">
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                    <button className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors" title="Edit">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(prop._id)}
                                        className="p-2 rounded-lg hover:bg-red-50 text-[var(--text-muted)] hover:text-red-500 transition-colors" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
