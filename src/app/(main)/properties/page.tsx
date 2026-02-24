"use client";

import { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, MapPin, ChevronDown } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import api from "@/lib/api";

/* ─── IMAGE POOL ─── */
const IMG = [
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1596276020587-8044fe049813?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1562778612-e1e0cda9915c?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=450&fit=crop",
];

/* ─── DEMO DATA ─── */
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Goa", "Chennai", "Kolkata"];
const TYPES = ["hostel", "pg", "hotel"];
const AREAS: Record<string, string[]> = {
    Mumbai: ["Andheri West", "Bandra", "Powai", "Colaba", "Juhu"],
    Delhi: ["Hauz Khas", "Laxmi Nagar", "Saket", "Connaught Place", "Dwarka"],
    Bangalore: ["Koramangala", "HSR Layout", "Indiranagar", "Whitefield", "BTM Layout"],
    Pune: ["Viman Nagar", "Koregaon Park", "Kothrud", "Hinjewadi", "Baner"],
    Hyderabad: ["Banjara Hills", "Madhapur", "Gachibowli", "Jubilee Hills", "Miyapur"],
    Goa: ["Calangute", "Panjim", "Vagator", "Arambol", "Anjuna"],
    Chennai: ["T. Nagar", "Anna Nagar", "Velachery", "OMR", "Adyar"],
    Kolkata: ["Park Street", "Salt Lake", "New Town", "Rajarhat", "Howrah"],
};

const NAMES = [
    "Urban Nest", "Skyline Residency", "Backpacker's Hub", "Metro Heights PG",
    "Sunrise Dorm", "Golden Leaf Hostel", "City View Rooms", "Haven Stay",
    "Comfort Zone PG", "Study Hub", "Royal Stay Inn", "Pacific Lodge",
    "Blue Door PG", "Nomad House", "Elite Rooms", "Zenith Hostel",
    "Green Valley PG", "Prime Stay", "Cozy Corner", "Urban Edge",
    "Horizon Villa", "Student Pad", "Gateway Inn", "Premier Suites",
];

function generateDemoProperties() {
    return Array.from({ length: 96 }, (_, i) => {
        const cityIdx = i % CITIES.length;
        const city = CITIES[cityIdx];
        const areas = AREAS[city] || ["Central"];
        const area = areas[i % areas.length];
        const type = TYPES[i % TYPES.length];
        return {
            _id: `demo-${i}`,
            name: NAMES[i % NAMES.length] + (i >= NAMES.length ? ` ${Math.floor(i / NAMES.length) + 1}` : ""),
            type,
            location: { city, address: area, area },
            pricing: { startingFrom: 4000 + Math.floor(Math.random() * 14000) },
            avgRating: +(3.5 + Math.random() * 1.5).toFixed(1),
            totalReviews: 10 + Math.floor(Math.random() * 300),
            images: [{ url: IMG[i % IMG.length] }],
            verified: Math.random() > 0.3,
        };
    });
}

const DEMO = generateDemoProperties();

/* ─── SORT OPTIONS ─── */
const SORT_OPTIONS = [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
];

/* ─── SKELETON ─── */
function SkeletonCard() {
    return (
        <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="aspect-[4/3] skeleton" />
            <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 skeleton" />
                <div className="h-3 w-1/2 skeleton" />
                <div className="flex justify-between">
                    <div className="h-3 w-16 skeleton" />
                    <div className="h-3 w-20 skeleton" />
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════ INNER COMPONENT ═══════════════════════ */
function PropertiesContent() {
    const searchParams = useSearchParams();
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [sortBy, setSortBy] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);

    // Filters
    const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
    const [selectedType, setSelectedType] = useState(searchParams.get("type") || "");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);

    // Fetch from API
    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                const params: Record<string, string> = {};
                if (selectedCity) params.city = selectedCity;
                if (selectedType) params.type = selectedType;
                if (searchQuery) params.search = searchQuery;
                const { data } = await api.get("/properties", { params });
                if (data.properties && data.properties.length > 0) {
                    setProperties(data.properties);
                } else {
                    setProperties(DEMO);
                }
            } catch {
                setProperties(DEMO);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, [selectedCity, selectedType, searchQuery]);

    // Filter + sort
    const filtered = useMemo(() => {
        let result = [...properties];

        // Price filter
        result = result.filter((p) => {
            const price = p.pricing?.startingFrom || p.price || 0;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Sort
        if (sortBy === "price-low") result.sort((a, b) => (a.pricing?.startingFrom || 0) - (b.pricing?.startingFrom || 0));
        if (sortBy === "price-high") result.sort((a, b) => (b.pricing?.startingFrom || 0) - (a.pricing?.startingFrom || 0));
        if (sortBy === "rating") result.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));

        return result;
    }, [properties, priceRange, sortBy]);

    const clearFilters = () => {
        setSelectedCity("");
        setSelectedType("");
        setPriceRange([0, 25000]);
        setSearchQuery("");
    };

    const hasActiveFilters = selectedCity || selectedType || searchQuery || priceRange[0] > 0 || priceRange[1] < 25000;

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                        {selectedCity ? `Properties in ${selectedCity}` : "Explore Properties"}
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        {loading ? "Loading..." : `${filtered.length} properties found`}
                    </p>
                </div>

                {/* Search + Sort Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, city, or area..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="glass-input !pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="glass-input !py-3 !px-5 !w-auto min-w-[160px] cursor-pointer"
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`transition-all ${showFilters ? "glass-btn-primary !px-5 !py-3" : "glass-btn-ghost !px-5 !py-3"}`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mb-6 p-5 glass-panel backdrop-blur-xl rounded-2xl animate-fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-[var(--text-primary)]">Filters</h3>
                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="text-sm text-indigo-600 hover:underline">
                                    Clear all
                                </button>
                            )}
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* City */}
                            <div>
                                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">City</label>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="glass-input cursor-pointer !py-3"
                                >
                                    <option value="" className="dark:bg-slate-900 text-[var(--text-primary)]">All Cities</option>
                                    {CITIES.map((c) => <option key={c} value={c} className="dark:bg-slate-900 text-[var(--text-primary)]">{c}</option>)}
                                </select>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Type</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="glass-input cursor-pointer !py-3"
                                >
                                    <option value="" className="dark:bg-slate-900 text-[var(--text-primary)]">All Types</option>
                                    <option value="hostel" className="dark:bg-slate-900 text-[var(--text-primary)]">Hostel</option>
                                    <option value="pg" className="dark:bg-slate-900 text-[var(--text-primary)]">PG / Co-Living</option>
                                    <option value="hotel" className="dark:bg-slate-900 text-[var(--text-primary)]">Budget Hotel</option>
                                </select>
                            </div>

                            {/* Price Min */}
                            <div>
                                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Min Price (₹)</label>
                                <input
                                    type="number"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                                    className="glass-input !py-3"
                                    min={0}
                                    step={500}
                                />
                            </div>

                            {/* Price Max */}
                            <div>
                                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Max Price (₹)</label>
                                <input
                                    type="number"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                                    className="glass-input !py-3"
                                    min={0}
                                    step={500}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Active Filter Tags */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {selectedCity && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm font-bold border-indigo-500/20">
                                <MapPin className="w-3.5 h-3.5" /> {selectedCity}
                                <button onClick={() => setSelectedCity("")} className="hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors"><X className="w-3.5 h-3.5" /></button>
                            </span>
                        )}
                        {selectedType && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm font-bold border-indigo-500/20">
                                {selectedType.toUpperCase()}
                                <button onClick={() => setSelectedType("")} className="hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors"><X className="w-3.5 h-3.5" /></button>
                            </span>
                        )}
                    </div>
                )}

                {/* Property Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-2xl glass-panel bg-[var(--bg-secondary)] dark:bg-white/5 text-[var(--text-muted)] flex items-center justify-center mx-auto mb-4">
                            <Search className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No properties found</h3>
                        <p className="text-[var(--text-secondary)] mb-4">Try adjusting your filters or search query.</p>
                        <button onClick={clearFilters} className="glass-btn-primary">Clear Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((p) => (
                            <PropertyCard key={p._id} property={p} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════ PAGE EXPORT ═══════════════════════ */
export default function PropertiesPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="h-8 w-64 skeleton mb-4" />
                        <div className="h-4 w-32 skeleton mb-8" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    </div>
                </div>
            }
        >
            <PropertiesContent />
        </Suspense>
    );
}
