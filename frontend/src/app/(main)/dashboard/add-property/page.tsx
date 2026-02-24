"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Building2, MapPin, Image as ImageIcon, DollarSign, Settings,
    ArrowLeft, ArrowRight, Check, Loader2, Plus, X, Upload, Wifi,
    Wind, UtensilsCrossed, Car, Dumbbell, Shield, Droplets, Tv,
    Book, Gamepad2, Sparkles, CheckCircle2
} from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";

const AMENITY_OPTIONS = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "ac", label: "AC", icon: Wind },
    { id: "meals", label: "Meals", icon: UtensilsCrossed },
    { id: "parking", label: "Parking", icon: Car },
    { id: "laundry", label: "Laundry", icon: Droplets },
    { id: "gym", label: "Gym", icon: Dumbbell },
    { id: "cctv", label: "CCTV", icon: Shield },
    { id: "power-backup", label: "Power Backup", icon: Sparkles },
    { id: "geyser", label: "Geyser", icon: Droplets },
    { id: "tv", label: "TV Room", icon: Tv },
    { id: "study-room", label: "Study Room", icon: Book },
    { id: "recreation", label: "Recreation", icon: Gamepad2 },
    { id: "security", label: "24/7 Security", icon: Shield },
    { id: "housekeeping", label: "Housekeeping", icon: CheckCircle2 },
];

const STEPS = ["Basic Info", "Location", "Amenities & Rules", "Rooms & Pricing", "Images"];

export default function AddPropertyPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "", description: "", type: "hostel", gender: "coed",
        address: "", city: "", state: "", pincode: "", nearbyPlaces: [""],
        amenities: [] as string[],
        rules: [""],
        pricing: { startingFrom: "", securityDeposit: "" },
        rooms: [{ name: "", type: "dormitory", capacity: "6", priceDaily: "", priceMonthly: "", totalBeds: "", ac: false, attached_bathroom: false }],
        images: [] as string[],
        imageUrls: [""],
    });

    const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

    const toggleAmenity = (id: string) => {
        setForm(prev => ({
            ...prev,
            amenities: prev.amenities.includes(id)
                ? prev.amenities.filter(a => a !== id)
                : [...prev.amenities, id],
        }));
    };

    const updateRoom = (index: number, field: string, value: any) => {
        setForm(prev => {
            const rooms = [...prev.rooms];
            rooms[index] = { ...rooms[index], [field]: value };
            return { ...prev, rooms };
        });
    };

    const addRoom = () => {
        setForm(prev => ({
            ...prev,
            rooms: [...prev.rooms, { name: "", type: "double", capacity: "2", priceDaily: "", priceMonthly: "", totalBeds: "", ac: false, attached_bathroom: false }],
        }));
    };

    const removeRoom = (index: number) => {
        if (form.rooms.length <= 1) return;
        setForm(prev => ({ ...prev, rooms: prev.rooms.filter((_, i) => i !== index) }));
    };

    const updateListItem = (field: "rules" | "nearbyPlaces" | "imageUrls", index: number, value: string) => {
        setForm(prev => {
            const list = [...prev[field]];
            list[index] = value;
            return { ...prev, [field]: list };
        });
    };

    const addListItem = (field: "rules" | "nearbyPlaces" | "imageUrls") => {
        setForm(prev => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    const removeListItem = (field: "rules" | "nearbyPlaces" | "imageUrls", index: number) => {
        setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                name: form.name,
                description: form.description,
                type: form.type,
                gender: form.gender,
                location: {
                    address: form.address,
                    city: form.city,
                    state: form.state,
                    pincode: form.pincode,
                    nearbyPlaces: form.nearbyPlaces.filter(Boolean),
                },
                amenities: form.amenities,
                rules: form.rules.filter(Boolean),
                pricing: {
                    startingFrom: Number(form.pricing.startingFrom),
                    securityDeposit: Number(form.pricing.securityDeposit),
                },
                images: form.imageUrls.filter(Boolean).map(url => ({ url, caption: "" })),
            };

            const { data } = await api.post("/properties", payload);

            // Add rooms
            for (const room of form.rooms) {
                if (!room.name) continue;
                await api.post(`/properties/${data.property._id}/rooms`, {
                    name: room.name,
                    type: room.type,
                    capacity: Number(room.capacity),
                    price: { daily: Number(room.priceDaily), monthly: Number(room.priceMonthly) },
                    totalBeds: Number(room.totalBeds || room.capacity),
                    availableBeds: Number(room.totalBeds || room.capacity),
                    ac: room.ac,
                    attached_bathroom: room.attached_bathroom,
                });
            }

            toast.success("Property listed successfully!");
            router.push("/dashboard");
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to list property");
        } finally {
            setLoading(false);
        }
    };

    const canProceed = () => {
        switch (step) {
            case 0: return form.name && form.description && form.type;
            case 1: return form.address && form.city && form.state;
            case 2: return form.amenities.length > 0;
            case 3: return form.rooms.some(r => r.name && r.priceDaily) && form.pricing.startingFrom;
            case 4: return true;
            default: return true;
        }
    };

    return (
        <div className="pt-24 pb-16 min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <button onClick={() => router.back()}
                    className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>

                <h1 className="text-2xl sm:text-3xl font-bold mb-2">List Your Property</h1>
                <p className="text-[var(--text-secondary)] mb-8">Add your hostel, PG, or hotel to reach thousands of tenants</p>

                {/* Progress Steps */}
                <div className="flex items-center gap-1 mb-10 overflow-x-auto pb-2">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex items-center gap-1">
                            <button
                                onClick={() => i <= step && setStep(i)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${i === step ? "bg-[var(--primary)] text-white" :
                                        i < step ? "bg-emerald-100 text-emerald-700" :
                                            "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                                    }`}
                            >
                                {i < step ? <Check className="w-4 h-4" /> :
                                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">{i + 1}</span>}
                                <span className="hidden sm:inline">{s}</span>
                            </button>
                            {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-emerald-300" : "bg-[var(--border)]"}`} />}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
                    className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)]">

                    {/* Step 0: Basic Info */}
                    {step === 0 && (
                        <div className="space-y-5">
                            <h2 className="text-lg font-semibold flex items-center gap-2"><Building2 className="w-5 h-5 text-[var(--primary)]" /> Basic Information</h2>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">Property Name *</label>
                                <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)}
                                    placeholder="e.g. Urban Nest Co-Living" className="input !rounded-xl" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Type *</label>
                                    <select value={form.type} onChange={(e) => update("type", e.target.value)} className="input !rounded-xl">
                                        <option value="hostel">Hostel</option>
                                        <option value="pg">PG</option>
                                        <option value="budget-hotel">Budget Hotel</option>
                                        <option value="co-living">Co-Living</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Gender *</label>
                                    <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className="input !rounded-xl">
                                        <option value="coed">Co-Ed</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">Description *</label>
                                <textarea value={form.description} onChange={(e) => update("description", e.target.value)}
                                    placeholder="Describe your property, its USPs, and what makes it special..."
                                    rows={5} className="input !rounded-xl resize-none" />
                            </div>
                        </div>
                    )}

                    {/* Step 1: Location */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <h2 className="text-lg font-semibold flex items-center gap-2"><MapPin className="w-5 h-5 text-[var(--primary)]" /> Location Details</h2>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">Full Address *</label>
                                <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)}
                                    placeholder="Plot 42, SV Road" className="input !rounded-xl" />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">City *</label>
                                    <input type="text" value={form.city} onChange={(e) => update("city", e.target.value)}
                                        placeholder="Mumbai" className="input !rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">State *</label>
                                    <input type="text" value={form.state} onChange={(e) => update("state", e.target.value)}
                                        placeholder="Maharashtra" className="input !rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Pincode</label>
                                    <input type="text" value={form.pincode} onChange={(e) => update("pincode", e.target.value)}
                                        placeholder="400058" className="input !rounded-xl" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Nearby Places</label>
                                {form.nearbyPlaces.map((place, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input type="text" value={place}
                                            onChange={(e) => updateListItem("nearbyPlaces", i, e.target.value)}
                                            placeholder="e.g. Andheri Station (500m)" className="input !rounded-xl flex-1" />
                                        {form.nearbyPlaces.length > 1 && (
                                            <button onClick={() => removeListItem("nearbyPlaces", i)} className="p-2 text-red-400 hover:text-red-500">
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={() => addListItem("nearbyPlaces")}
                                    className="text-sm text-[var(--primary)] font-medium flex items-center gap-1 hover:underline">
                                    <Plus className="w-4 h-4" /> Add nearby place
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Amenities & Rules */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                    <Settings className="w-5 h-5 text-[var(--primary)]" /> Amenities
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {AMENITY_OPTIONS.map(a => (
                                        <button key={a.id} onClick={() => toggleAmenity(a.id)}
                                            className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all text-left ${form.amenities.includes(a.id)
                                                    ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                                                    : "border-[var(--border)] hover:border-[var(--primary-light)] text-[var(--text-secondary)]"
                                                }`}
                                        >
                                            <a.icon className="w-5 h-5 shrink-0" />
                                            <span className="text-sm font-medium">{a.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-base font-semibold mb-3">House Rules</h3>
                                {form.rules.map((rule, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input type="text" value={rule}
                                            onChange={(e) => updateListItem("rules", i, e.target.value)}
                                            placeholder="e.g. No smoking inside rooms" className="input !rounded-xl flex-1" />
                                        {form.rules.length > 1 && (
                                            <button onClick={() => removeListItem("rules", i)} className="p-2 text-red-400">
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={() => addListItem("rules")}
                                    className="text-sm text-[var(--primary)] font-medium flex items-center gap-1 hover:underline">
                                    <Plus className="w-4 h-4" /> Add rule
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Rooms & Pricing */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-[var(--primary)]" /> Rooms & Pricing
                            </h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Starting Price (₹/mo) *</label>
                                    <input type="number" value={form.pricing.startingFrom}
                                        onChange={(e) => update("pricing", { ...form.pricing, startingFrom: e.target.value })}
                                        placeholder="8500" className="input !rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Security Deposit (₹)</label>
                                    <input type="number" value={form.pricing.securityDeposit}
                                        onChange={(e) => update("pricing", { ...form.pricing, securityDeposit: e.target.value })}
                                        placeholder="15000" className="input !rounded-xl" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-semibold">Room Types</h3>
                                    <button onClick={addRoom} className="text-sm text-[var(--primary)] font-medium flex items-center gap-1 hover:underline">
                                        <Plus className="w-4 h-4" /> Add Room Type
                                    </button>
                                </div>

                                {form.rooms.map((room, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[var(--primary)]">Room #{i + 1}</span>
                                            {form.rooms.length > 1 && (
                                                <button onClick={() => removeRoom(i)} className="text-xs text-red-400 hover:text-red-500">Remove</button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Name *</label>
                                                <input type="text" value={room.name} onChange={(e) => updateRoom(i, "name", e.target.value)}
                                                    placeholder="Double AC" className="input !rounded-lg !text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Type</label>
                                                <select value={room.type} onChange={(e) => updateRoom(i, "type", e.target.value)} className="input !rounded-lg !text-sm">
                                                    <option value="dormitory">Dormitory</option>
                                                    <option value="double">Double</option>
                                                    <option value="single">Single</option>
                                                    <option value="triple">Triple</option>
                                                    <option value="deluxe">Deluxe</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Capacity</label>
                                                <input type="number" value={room.capacity} onChange={(e) => updateRoom(i, "capacity", e.target.value)}
                                                    className="input !rounded-lg !text-sm" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Daily Price ₹ *</label>
                                                <input type="number" value={room.priceDaily} onChange={(e) => updateRoom(i, "priceDaily", e.target.value)}
                                                    placeholder="550" className="input !rounded-lg !text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Monthly ₹</label>
                                                <input type="number" value={room.priceMonthly} onChange={(e) => updateRoom(i, "priceMonthly", e.target.value)}
                                                    placeholder="12000" className="input !rounded-lg !text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Total Beds</label>
                                                <input type="number" value={room.totalBeds} onChange={(e) => updateRoom(i, "totalBeds", e.target.value)}
                                                    placeholder="10" className="input !rounded-lg !text-sm" />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={room.ac} onChange={(e) => updateRoom(i, "ac", e.target.checked)}
                                                    className="w-4 h-4 rounded accent-[var(--primary)]" />
                                                <span className="text-sm">AC</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={room.attached_bathroom} onChange={(e) => updateRoom(i, "attached_bathroom", e.target.checked)}
                                                    className="w-4 h-4 rounded accent-[var(--primary)]" />
                                                <span className="text-sm">Attached Bathroom</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Images */}
                    {step === 4 && (
                        <div className="space-y-5">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-[var(--primary)]" /> Property Images
                            </h2>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Add image URLs for your property. Include photos of rooms, common areas, washrooms, and the exterior.
                            </p>

                            {form.imageUrls.map((url, i) => (
                                <div key={i} className="flex gap-2">
                                    <input type="url" value={url}
                                        onChange={(e) => updateListItem("imageUrls", i, e.target.value)}
                                        placeholder="https://images.unsplash.com/photo-..." className="input !rounded-xl flex-1" />
                                    {form.imageUrls.length > 1 && (
                                        <button onClick={() => removeListItem("imageUrls", i)} className="p-2 text-red-400">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button onClick={() => addListItem("imageUrls")}
                                className="text-sm text-[var(--primary)] font-medium flex items-center gap-1 hover:underline">
                                <Plus className="w-4 h-4" /> Add image URL
                            </button>

                            {/* Preview */}
                            {form.imageUrls.filter(Boolean).length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold mb-2">Preview</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {form.imageUrls.filter(Boolean).map((url, i) => (
                                            <div key={i} className="aspect-video rounded-xl overflow-hidden bg-[var(--bg-secondary)]">
                                                <img src={url} alt="" className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = ""; }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                    <button onClick={() => setStep(prev => prev - 1)} disabled={step === 0}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium disabled:opacity-40 hover:bg-[var(--bg-secondary)] transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Previous
                    </button>

                    {step < STEPS.length - 1 ? (
                        <button onClick={() => setStep(prev => prev + 1)} disabled={!canProceed()}
                            className="btn-primary !text-sm flex items-center gap-2 disabled:opacity-40">
                            Next <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button onClick={handleSubmit} disabled={loading}
                            className="btn-primary !text-sm flex items-center gap-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            {loading ? "Listing..." : "List Property"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
