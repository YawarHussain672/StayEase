"use client";

import ContentPage from "@/components/layout/ContentPage";
import { Newspaper, Download, Share2 } from "lucide-react";

export default function PressPage() {
    return (
        <ContentPage
            title="Press Room"
            subtitle="Latest updates, media kits, and brand assets from StayEase."
            icon={Newspaper}
        >
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-6">Recent Announcements</h2>
                    <div className="space-y-6">
                        <div className="p-6 glass-panel rounded-2xl border border-white/20 dark:border-white/10 group cursor-pointer hover:border-indigo-500/30 transition-all">
                            <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-widest mb-1.5">Feb 16, 2026</p>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 text-[var(--text-primary)] transition-colors">StayEase Secures $20M Series B to Expand Across Tier-2 Cities</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">India's leading student housing platform announces fresh funding to accelerate its mission of providing safe, affordable, and AI-driven housing solutions.</p>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="glass-panel p-8 rounded-3xl border border-white/20 dark:border-white/10 flex flex-col items-center text-center">
                        <Download className="w-10 h-10 text-purple-500 mb-4" />
                        <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Media Kit</h3>
                        <p className="text-sm text-[var(--text-secondary)] dark:text-slate-400 mb-6 font-medium">Download our official logos, brand colors, and high-res property images.</p>
                        <button className="glass-btn-primary px-8 py-2 !rounded-full !bg-slate-800 dark:!bg-slate-700 text-white font-bold w-full active:scale-95 transition-transform">Download .ZIP</button>
                    </div>
                    <div className="glass-panel p-8 rounded-3xl border border-white/20 dark:border-white/10 flex flex-col items-center text-center">
                        <Share2 className="w-10 h-10 text-emerald-500 mb-4" />
                        <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Media Inquiries</h3>
                        <p className="text-sm text-[var(--text-secondary)] dark:text-slate-400 mb-6 font-medium">Need a quote or interview? Our PR team is happy to help.</p>
                        <button className="glass-btn-primary px-8 py-2 !rounded-full !bg-indigo-600 dark:!bg-indigo-500 text-white font-bold w-full active:scale-95 transition-transform">Contact PR</button>
                    </div>
                </section>
            </div >
        </ContentPage >
    );
}
