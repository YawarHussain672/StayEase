"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    MapPin, Star, Wifi, Wind, UtensilsCrossed, Shield, Users,
    Calendar, ChevronLeft, ChevronRight, Heart, Share2, CheckCircle2,
    Phone, Mail, Clock, Car, Dumbbell, Tv, Droplets, Book,
    Gamepad2, Sparkles, AlertCircle, X, ArrowLeft, Minus, Plus,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";

/* ─── AMENITY MAP ─── */
const amenityDetails: Record<string, { icon: React.ElementType; label: string }> = {
    wifi: { icon: Wifi, label: "High-Speed WiFi" },
    ac: { icon: Wind, label: "Air Conditioning" },
    meals: { icon: UtensilsCrossed, label: "Meals Included" },
    parking: { icon: Car, label: "Parking" },
    laundry: { icon: Droplets, label: "Laundry" },
    gym: { icon: Dumbbell, label: "Gym" },
    cctv: { icon: Shield, label: "CCTV" },
    "power-backup": { icon: Sparkles, label: "Power Backup" },
    geyser: { icon: Droplets, label: "Geyser" },
    tv: { icon: Tv, label: "TV" },
    "study-room": { icon: Book, label: "Study Room" },
    recreation: { icon: Gamepad2, label: "Recreation" },
    security: { icon: Shield, label: "24/7 Security" },
    housekeeping: { icon: CheckCircle2, label: "Housekeeping" },
};

/* ─── DEMO DATA ─── */
const DEMO_PROPERTY = {
    _id: "d1",
    name: "Urban Nest Co-Living Space",
    description: "Experience modern co-living at Urban Nest, located in the heart of Andheri West, Mumbai. Our spaces are designed for young professionals and students looking for a comfortable, well-connected home away from home. Each room is thoughtfully furnished with premium mattresses, ergonomic study desks, and ample storage. Enjoy daily meals prepared by our in-house chef, high-speed WiFi, gym access, and regular housekeeping — all included in one affordable monthly rent. Our vibrant community hosts weekly events, movie nights, and networking sessions to help you build meaningful connections.",
    type: "hostel",
    gender: "coed",
    location: {
        address: "Plot 42, SV Road, Andheri West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400058",
        nearbyPlaces: ["Andheri Station (500m)", "D.N. Nagar Metro (800m)", "Lokhandwala Market (1.2km)"],
    },
    images: [
        { url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&h=800&fit=crop", caption: "Common Lounge" },
        { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop", caption: "Premium Double Room" },
        { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop", caption: "Deluxe Room" },
        { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop", caption: "Suite Room" },
        { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop", caption: "Building Exterior" },
    ],
    amenities: ["wifi", "ac", "meals", "laundry", "gym", "cctv", "power-backup", "geyser", "security", "housekeeping"],
    rules: ["No smoking inside rooms", "Guests allowed till 10 PM", "Quiet hours: 11 PM - 7 AM", "Keep common areas clean"],
    pricing: { startingFrom: 8500, securityDeposit: 15000, mealPlan: { available: true, price: 3500 } },
    owner: { _id: "o1", name: "Arjun Mehta", email: "arjun@urbannest.in", phone: "9876543210" },
    avgRating: 4.6,
    totalReviews: 128,
    totalRooms: 45,
    availableRooms: 8,
    verified: true,
    featured: true,
    reviews: [
        { _id: "r1", user: { name: "Priya S." }, rating: 5, comment: "Great place, clean rooms, excellent food. The community events are a bonus!", createdAt: "2025-01-10" },
        { _id: "r2", user: { name: "Rahul V." }, rating: 4, comment: "Good location and amenities. WiFi could be faster sometimes. Overall happy with my stay.", createdAt: "2025-01-05" },
        { _id: "r3", user: { name: "Sneha K." }, rating: 5, comment: "Best hostel I've stayed in. The staff is incredibly helpful and the rooms are spotless.", createdAt: "2024-12-20" },
    ],
    rooms: [
        { _id: "room1", name: "Premium Double", type: "double", price: { daily: 850 }, availableBeds: 2 },
        { _id: "room2", name: "Standard Single", type: "single", price: { daily: 1200 }, availableBeds: 1 },
        { _id: "room3", name: "Economy Dorm", type: "dormitory", price: { daily: 500 }, availableBeds: 5 },
    ],
};

/* ─── SKELETON ─── */
function DetailSkeleton() {
    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="h-6 w-20 skeleton mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    <div className="col-span-2 row-span-2 aspect-[4/3] skeleton rounded-xl" />
                    <div className="aspect-[4/3] skeleton rounded-xl" />
                    <div className="aspect-[4/3] skeleton rounded-xl" />
                    <div className="aspect-[4/3] skeleton rounded-xl" />
                    <div className="aspect-[4/3] skeleton rounded-xl" />
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="h-8 w-3/4 skeleton" />
                        <div className="h-4 w-1/2 skeleton" />
                        <div className="h-32 skeleton rounded-xl mt-6" />
                    </div>
                    <div className="h-64 skeleton rounded-xl" />
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════ PAGE ═══════════════════════ */
export default function PropertyDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuthStore();

    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [guests, setGuests] = useState(1);
    const [checkIn, setCheckIn] = useState<string>("");
    const [checkOut, setCheckOut] = useState<string>("");
    const [bookingLoading, setBookingLoading] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [showGallery, setShowGallery] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        setCheckIn(today.toISOString().split("T")[0]);
        setCheckOut(tomorrow.toISOString().split("T")[0]);
    }, []);

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 1;
        const start = new Date(checkIn).getTime();
        const end = new Date(checkOut).getTime();
        const diff = end - start;
        return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 1;
    };
    const nights = calculateNights();

    useEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);
            setFetchError(null);

            // If ID is not a valid 24-char MongoDB ID, assume it's a demo property
            // This covers "d1", "1", "property-1", etc.
            const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
            if (!isMongoId || id === "d1") {
                console.log("Demo Mode: Using mock data for ID:", id);
                setProperty({ ...DEMO_PROPERTY, _id: id }); // Use the requested ID
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.get(`/properties/${id}`);
                if (data.property) {
                    setProperty(data.property);
                } else {
                    console.warn("Property not found in API, using Demo data");
                    setProperty(DEMO_PROPERTY);
                }
            } catch (err: any) {
                console.error("Failed to fetch property:", err);
                // Fallback to demo data on error, but log it only if it's a 500
                if (err.response?.status >= 500) {
                    const errorMessage = err.response?.data?.error || err.message || "Unknown error";
                    setFetchError(errorMessage);
                }
                setProperty(DEMO_PROPERTY);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            toast.error("Please sign in to book");
            router.push("/login");
            return;
        }
        if (!selectedRoom) {
            toast.error("Please select a room");
            return;
        }

        console.log("Booking - Property ID:", property._id, "Room ID:", selectedRoom._id);

        // Check if it's a demo property (either "d1" or any non-Mongo ID)
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(property._id);
        if (!isMongoId || property._id === "d1") {
            setBookingLoading(true);
            setTimeout(() => {
                const subT = selectedRoom.price.daily * nights;
                const tax = Math.round(subT * 0.12);

                // Create a mock booking object
                const newBooking = {
                    _id: `demo-${Date.now()}`,
                    property: {
                        _id: property._id,
                        name: property.name,
                        location: property.location,
                        images: property.images
                    },
                    room: {
                        name: selectedRoom.name,
                        type: selectedRoom.type,
                        price: selectedRoom.price
                    },
                    checkIn: new Date(checkIn).toISOString(),
                    checkOut: new Date(checkOut).toISOString(),
                    guests,
                    amount: {
                        subtotal: subT,
                        tax: tax,
                        total: subT + tax
                    },
                    status: "confirmed",
                    payment: { status: "completed" },
                    invoiceNumber: `SE-DEMO-${Math.floor(Math.random() * 10000)}`,
                    createdAt: new Date().toISOString(),
                };

                // Save to localStorage
                const existingBookings = JSON.parse(localStorage.getItem("demo-bookings") || "[]");
                localStorage.setItem("demo-bookings", JSON.stringify([newBooking, ...existingBookings]));

                toast.success("Booking confirmed! (Demo Mode)");
                router.push("/bookings");
            }, 1000);
            return;
        }

        setBookingLoading(true);
        try {
            await api.post("/bookings", {
                propertyId: property._id,
                roomId: selectedRoom._id,
                guests,
                checkIn: new Date(checkIn).toISOString(),
                checkOut: new Date(checkOut).toISOString(),
            });
            toast.success("Booking confirmed!");
            router.push("/bookings");
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Booking failed");
        } finally {
            if (property._id !== "d1") {
                setBookingLoading(false);
            }
        }
    };

    if (loading) return <DetailSkeleton />;
    if (!property) return null; // Or a friendly 404 page

    // Safety check for demo mode
    if (fetchError && !property._id) return (
        <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
            <div className="max-w-md w-full bg-red-50 p-6 rounded-lg text-red-800 border border-red-200 shadow-sm text-center">
                <h2 className="text-xl font-bold mb-2">Connection Error</h2>
                <p className="mb-4">{fetchError}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        </div>
    );

    const images = property.images || [];
    const price = property.pricing?.startingFrom || 0;
    const deposit = property.pricing?.securityDeposit || 0;
    const mealPlan = property.pricing?.mealPlan;
    const reviews = property.reviews || [];
    const location = property.location || {};

    return (
        <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {/* ════════ IMAGE GALLERY ════════ */}
                {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-8 rounded-2xl overflow-hidden">
                        {/* Main image */}
                        <button
                            onClick={() => { setActiveImage(0); setShowGallery(true); }}
                            className="col-span-2 row-span-2 relative group overflow-hidden"
                        >
                            <img
                                src={images[0]?.url || images[0]}
                                alt={images[0]?.caption || property.name}
                                className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </button>
                        {/* Thumbnails */}
                        {images.slice(1, 5).map((img: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => { setActiveImage(i + 1); setShowGallery(true); }}
                                className="relative group overflow-hidden"
                            >
                                <img
                                    src={img?.url || img}
                                    alt={img?.caption || `Image ${i + 2}`}
                                    className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                                {i === 3 && images.length > 5 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                                        +{images.length - 5} more
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* ════════ TWO-COLUMN LAYOUT ════════ */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* LEFT — Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title */}
                        <div>
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase">
                                            {property.type}
                                        </span>
                                        {property.verified && (
                                            <span className="px-2.5 py-0.5 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> Verified
                                            </span>
                                        )}
                                        {property.gender && (
                                            <span className="px-2.5 py-0.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-semibold capitalize">
                                                {property.gender}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">{property.name}</h1>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {(property._id === "d1" || fetchError) && (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold rounded-full flex items-center border border-blue-200 dark:border-blue-800">
                                            DEMO VIEW
                                        </span>
                                    )}
                                    <button className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:border-red-200 transition-colors">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                    <button className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {location.address}, {location.city}
                                    {location.state ? `, ${location.state}` : ""}
                                </span>
                                {property.avgRating > 0 && (
                                    <span className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        {property.avgRating} ({property.totalReviews} reviews)
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">About</h2>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{property.description}</p>
                        </div>

                        {/* Amenities */}
                        {property.amenities?.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Amenities</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {property.amenities.map((a: string) => {
                                        const detail = amenityDetails[a];
                                        if (!detail) return null;
                                        const Icon = detail.icon;
                                        return (
                                            <div key={a} className="flex items-center gap-3 p-3 rounded-xl glass-panel !shadow-none hover:!shadow-md transition-all">
                                                <Icon className="w-5 h-5 text-indigo-500 shrink-0" />
                                                <span className="text-sm text-[var(--text-primary)] font-medium">{detail.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Rules */}
                        {property.rules?.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">House Rules</h2>
                                <ul className="space-y-2">
                                    {property.rules.map((rule: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Nearby Places */}
                        {location.nearbyPlaces?.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Nearby Places</h2>
                                <div className="flex flex-wrap gap-2">
                                    {location.nearbyPlaces.map((place: string, i: number) => (
                                        <span key={i} className="px-3 py-1.5 rounded-lg glass-panel !shadow-none text-sm text-[var(--text-secondary)] font-medium">
                                            {place}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        {reviews.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Reviews</h2>
                                <div className="space-y-4">
                                    {reviews.map((review: any) => (
                                        <div key={review._id} className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                                                    {review.user?.name?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[var(--text-primary)]">{review.user?.name || "User"}</p>
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: 5 }, (_, s) => (
                                                            <Star key={s} className={`w-3 h-3 ${s < review.rating ? "text-amber-500 fill-amber-500" : "text-slate-200 dark:text-slate-600"}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Owner */}
                        {property.owner && (
                            <div>
                                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Property Manager</h2>
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg font-bold">
                                        {property.owner.name?.charAt(0) || "O"}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[var(--text-primary)]">{property.owner.name}</p>
                                        <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mt-1">
                                            {property.owner.phone && (
                                                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {property.owner.phone}</span>
                                            )}
                                            {property.owner.email && (
                                                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {property.owner.email}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 glass-panel !bg-white/10 dark:!bg-slate-900/40 rounded-[2.5rem] p-8 space-y-6 shadow-2xl border-white/40">
                            {/* Price */}
                            {/* Price */}
                            <div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-[var(--text-primary)]">
                                        ₹{selectedRoom ? selectedRoom.price.daily.toLocaleString() : price.toLocaleString()}
                                    </span>
                                    <span className="text-[var(--text-muted)]">/{selectedRoom ? "night" : "month"}</span>
                                </div>
                                {property.rooms && property.rooms.length > 0 ? (
                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Select Room</label>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                            {property.rooms.filter((r: any) => r.availableBeds > 0).map((room: any) => (
                                                <button
                                                    key={room._id}
                                                    onClick={() => setSelectedRoom(room)}
                                                    className={`w-full text-left p-3 rounded-xl border transition-all ${selectedRoom?._id === room._id
                                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                                                        : "bg-[var(--bg-secondary)] border-[var(--border)] hover:border-indigo-500/50"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-semibold text-sm">{room.name}</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${selectedRoom?._id === room._id ? "bg-white/20" : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"}`}>
                                                            {room.type}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs opacity-90">
                                                        <span>{room.availableBeds} beds left</span>
                                                        <span className="font-bold">₹{room.price.daily}/night</span>
                                                    </div>
                                                </button>
                                            ))}
                                            {property.rooms.filter((r: any) => r.availableBeds > 0).length === 0 && (
                                                <p className="text-sm text-red-500">No rooms available</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    property.availableRooms !== undefined && (
                                        <p className="text-sm text-green-600 dark:text-green-400 mt-1 font-medium">
                                            {property.availableRooms} rooms available (Select below)
                                        </p>
                                    )
                                )}
                            </div>

                            <hr className="border-[var(--border)]" />

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Check-in</label>
                                    <input
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Check-out</label>
                                    <input
                                        type="date"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        min={checkIn || new Date().toISOString().split('T')[0]}
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            <hr className="border-[var(--border)]" />

                            {/* Guests */}
                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">Guests</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setGuests(Math.max(1, guests - 1))}
                                        className="w-12 h-12 rounded-2xl glass-panel !shadow-sm flex items-center justify-center hover:bg-white/20 dark:hover:bg-white/5 transition-all"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="text-xl font-bold text-[var(--text-primary)] w-8 text-center">{guests}</span>
                                    <button
                                        onClick={() => setGuests(Math.min(10, guests + 1))}
                                        className="w-12 h-12 rounded-2xl glass-panel !shadow-sm flex items-center justify-center hover:bg-white/20 dark:hover:bg-white/5 transition-all"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">₹{(selectedRoom ? selectedRoom.price.daily : price).toLocaleString()} × {nights} night{nights > 1 ? "s" : ""}</span>
                                    <span className="text-[var(--text-primary)] font-medium">₹{((selectedRoom ? selectedRoom.price.daily : price) * nights).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">GST (12%)</span>
                                    <span className="text-[var(--text-primary)] font-medium">₹{Math.round(((selectedRoom ? selectedRoom.price.daily : price) * nights) * 0.12).toLocaleString()}</span>
                                </div>
                                <hr className="border-[var(--border)]" />
                                <div className="flex justify-between font-bold text-base">
                                    <span className="text-[var(--text-primary)]">Total</span>
                                    <span className="text-[var(--text-primary)]">
                                        ₹{Math.round(((selectedRoom ? selectedRoom.price.daily : price) * nights) * 1.12).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Book CTA */}
                            <button
                                onClick={handleBooking}
                                disabled={bookingLoading || !selectedRoom}
                                className={`w-full !py-4 !text-lg !rounded-2xl font-bold shadow-xl transition-all ${!selectedRoom
                                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                                    : "glass-btn-primary !bg-indigo-600 dark:!bg-indigo-500 !text-white"
                                    }`}
                            >
                                {bookingLoading ? (
                                    <span className="flex items-center gap-2 justify-center"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Booking...</span>
                                ) : (
                                    selectedRoom ? "Book Now" : "Select a Room to Book"
                                )}
                            </button>

                            <p className="text-xs text-center text-[var(--text-muted)]">
                                Free cancellation within 24 hours
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════ FULLSCREEN GALLERY MODAL ════════ */}
            {showGallery && (
                <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center">
                    <button
                        onClick={() => setShowGallery(false)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setActiveImage(Math.max(0, activeImage - 1))}
                        className="absolute left-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <img
                        src={images[activeImage]?.url || images[activeImage]}
                        alt={images[activeImage]?.caption || ""}
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
                    />

                    <button
                        onClick={() => setActiveImage(Math.min(images.length - 1, activeImage + 1))}
                        className="absolute right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <p className="absolute bottom-6 text-white/70 text-sm">
                        {activeImage + 1} / {images.length}
                        {images[activeImage]?.caption && <span> — {images[activeImage].caption}</span>}
                    </p>
                </div>
            )}
        </div>
    );
}
