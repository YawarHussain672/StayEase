"use client";

import Link from "next/link";
import { MapPin, Star, BadgeCheck, Heart } from "lucide-react";
import { useState } from "react";

interface PropertyCardProps {
    property: {
        _id: string;
        name: string;
        type: string;
        location?: { city?: string; address?: string; area?: string };
        city?: string;
        area?: string;
        pricing?: { startingFrom?: number };
        price?: number;
        avgRating?: number;
        rating?: number;
        totalReviews?: number;
        reviews?: number;
        images?: { url: string }[] | string[];
        image?: string;
        verified?: boolean;
    };
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const [imgError, setImgError] = useState(false);

    const city = property.location?.city || property.city || "";
    const area = property.location?.area || property.location?.address || property.area || "";
    const price = property.pricing?.startingFrom || property.price || 0;
    const rating = property.avgRating || property.rating || 0;
    const reviewCount = property.totalReviews || property.reviews || 0;
    const type = property.type?.charAt(0).toUpperCase() + property.type?.slice(1) || "Stay";

    let imgSrc = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=450&fit=crop";
    if (property.image) {
        imgSrc = property.image;
    } else if (property.images && property.images.length > 0) {
        const first = property.images[0];
        imgSrc = typeof first === "string" ? first : first.url;
    }

    const FALLBACK = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=450&fit=crop";

    return (
        <Link href={`/properties/${property._id}`} className="group block h-full">
            <div className="glass-card h-full flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-[22px]">
                    <img
                        src={imgError ? FALLBACK : imgSrc}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Type badge — glass pill */}
                    <span className="absolute top-3 left-3 z-10 glass-badge uppercase tracking-wider text-[11px]">
                        {type}
                    </span>

                    {/* Heart icon — glass circle */}
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="absolute top-3 right-3 z-10 glass-icon-btn !w-8 !h-8 text-[var(--text-muted)] hover:text-red-500 hover:scale-110 transition-all"
                    >
                        <Heart className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Name + Verified */}
                    <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="font-semibold text-[var(--text-primary)] truncate">{property.name}</h3>
                        {property.verified && (
                            <BadgeCheck className="w-[18px] h-[18px] text-blue-500 shrink-0" />
                        )}
                    </div>

                    <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)] mb-3">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{area ? `${area}, ${city}` : city}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/30 dark:border-white/10">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-bold text-[var(--text-primary)]">{rating > 0 ? rating.toFixed(1) : "New"}</span>
                            {reviewCount > 0 && (
                                <span className="text-xs text-[var(--text-muted)]">({reviewCount})</span>
                            )}
                        </div>
                        {price > 0 && (
                            <p className="text-sm">
                                <span className="text-lg font-bold text-[var(--text-primary)]">₹{price.toLocaleString()}</span>
                                <span className="text-[var(--text-muted)]">/mo</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
