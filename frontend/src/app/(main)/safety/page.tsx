"use client";

import ContentPage from "@/components/layout/ContentPage";
import { ShieldCheck, HeartPulse, UserCheck, PhoneCall } from "lucide-react";

export default function SafetyPage() {
    return (
        <ContentPage
            title="Safety & Security"
            subtitle="Your safety is the foundation of every stay we offer."
            icon={ShieldCheck}
        >
            <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="glass-panel p-8 rounded-3xl border border-white/20 dark:border-white/10">
                        <UserCheck className="w-10 h-10 text-indigo-500 mb-4" />
                        <h2 className="text-xl font-bold mb-3 text-[var(--text-primary)]">Verified Properties</h2>
                        <p className="text-sm text-[var(--text-secondary)] dark:text-slate-400">Every property on StayEase goes through a rigorous 30-point safety and hygiene check by our experts before being listed.</p>
                    </section>
                    <section className="glass-panel p-8 rounded-3xl border border-white/20 dark:border-white/10">
                        <HeartPulse className="w-10 h-10 text-red-500 mb-4" />
                        <h2 className="text-xl font-bold mb-3 text-[var(--text-primary)]">24/7 Monitoring</h2>
                        <p className="text-sm text-[var(--text-secondary)] dark:text-slate-400">Most of our premium partner properties feature CCTV surveillance and night wardens for your peace of mind.</p>
                    </section>
                </div>

                <section className="glass-panel p-8 rounded-3xl border border-red-500/20 dark:border-red-500/10 bg-red-500/5 dark:bg-red-500/10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black mb-4 text-[var(--text-primary)] tracking-tight">Emergency Assistance</h2>
                        <p className="mb-8 text-[var(--text-secondary)] dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                            In case of any emergency, we have a direct SOS feature in the StayEase app that alerts the property manager and our central support team.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="glass-btn-primary px-10 py-4 !rounded-full !bg-red-600 dark:!bg-red-500 text-white font-black flex items-center justify-center gap-3 shadow-2xl shadow-red-500/30 transition-all hover:scale-105 active:scale-95 group">
                                <PhoneCall className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform" />
                                SOS Hotline: +91 911
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </ContentPage>
    );
}
