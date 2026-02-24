"use client";

import ContentPage from "@/components/layout/ContentPage";
import { Info, Target, Users, Globe } from "lucide-react";

export default function AboutPage() {
    return (
        <ContentPage
            title="About StayEase"
            subtitle="Redefining how India's youth finds and stays in their home away from home."
            icon={Info}
        >
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
                        <Target className="w-6 h-6 text-indigo-500" />
                        Our Mission
                    </h2>
                    <p className="text-[var(--text-secondary)] dark:text-slate-400 leading-relaxed">
                        StayEase was born out of a simple realization: finding a quality hostel or PG in India shouldn't be a nightmare. We leverage cutting-edge AI to match students and young professionals with verified, safe, and comfortable living spaces that fit their budget and lifestyle.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/10">
                        <Users className="w-8 h-8 text-purple-500 mb-4" />
                        <h3 className="font-bold text-lg mb-2">Community First</h3>
                        <p className="text-sm text-[var(--text-secondary)] dark:text-slate-400">
                            We don't just provide beds; we build communities where you can grow, learn, and make lifelong friends.
                        </p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-white/10">
                        <Globe className="w-8 h-8 text-emerald-500 mb-4" />
                        <h3 className="font-bold text-lg mb-2">Nationwide Network</h3>
                        <p className="text-sm text-[var(--text-secondary)] dark:text-slate-400">
                            With 1,200+ properties across 25+ cities, StayEase is India's most trusted student housing platform.
                        </p>
                    </div>
                </div>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">The StayEase Promise</h2>
                    <ul className="list-disc pl-6 space-y-2 text-[var(--text-secondary)] dark:text-slate-400">
                        <li>Verified Properties only (No surprises on check-in)</li>
                        <li>Transparent Pricing (No hidden brokerage)</li>
                        <li>24/7 AI-Powered Support</li>
                        <li>Secure Digital Payments</li>
                    </ul>
                </section>
            </div>
        </ContentPage>
    );
}
