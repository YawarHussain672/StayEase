"use client";

import ContentPage from "@/components/layout/ContentPage";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";

export default function BlogPage() {
    const posts = [
        { title: "Top 10 Hostels in Bangalore for Techies", date: "Feb 15, 2026", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800" },
        { title: "Managing Your Budget as a Student in Delhi", date: "Feb 10, 2026", image: "https://images.unsplash.com/photo-1532622722190-68a4007a2e4d?q=80&w=800" },
        { title: "Why Coliving is the Future of Urban India", date: "Feb 5, 2026", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800" },
    ];

    return (
        <ContentPage
            title="StayEase Blog"
            subtitle="Stories, tips, and guides for the modern Indian student and professional."
            icon={BookOpen}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <div key={post.title} className="group glass-panel rounded-3xl overflow-hidden flex flex-col hover:scale-[1.03] transition-transform duration-500">
                        <div className="h-48 w-full relative overflow-hidden">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 dark:text-indigo-400 mb-3 uppercase tracking-widest">
                                <Calendar className="w-3.5 h-3.5" />
                                {post.date}
                            </div>
                            <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 text-[var(--text-primary)] cursor-pointer transition-colors leading-tight">{post.title}</h3>
                            <button className="mt-auto flex items-center gap-2 text-sm font-black text-[var(--text-secondary)] dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors uppercase tracking-widest text-[10px]">
                                Read More
                                <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ContentPage >
    );
}
