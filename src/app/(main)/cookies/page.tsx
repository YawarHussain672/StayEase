"use client";

import ContentPage from "@/components/layout/ContentPage";
import { Cookie, Settings, ShieldCheck } from "lucide-react";

export default function CookiesPage() {
    return (
        <ContentPage
            title="Cookie Policy"
            subtitle="Understanding how we use cookies to improve your StayEase experience."
            icon={Cookie}
        >
            <div className="space-y-10">
                <section className="glass-panel p-8 rounded-3xl !bg-[var(--bg-secondary)] dark:!bg-white/5 border border-white/10 dark:border-white/5">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20">
                            <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-black text-[var(--text-primary)]">What are Cookies?</h2>
                    </div>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                        Cookies are small text files stored on your device that help us provide a smoother experience. They remember your login sessions, preferred filters, and AI-powered recommendations.
                    </p>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="glass-panel p-8 rounded-3xl !bg-[var(--bg-secondary)] dark:!bg-white/5 border border-white/10 dark:border-white/5">
                        <h3 className="text-lg font-bold mb-3 text-[var(--text-primary)]">Essential Cookies</h3>
                        <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">Required for the app to function (e.g., login, security, and session management).</p>
                    </div>
                    <div className="glass-panel p-8 rounded-3xl !bg-[var(--bg-secondary)] dark:!bg-white/5 border border-white/10 dark:border-white/5">
                        <h3 className="text-lg font-bold mb-3 text-[var(--text-primary)]">Analytics Cookies</h3>
                        <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">Help us understand how you use the app to improve performance and AI matching.</p>
                    </div>
                </section>

                <section className="glass-panel p-8 rounded-3xl !bg-[var(--bg-secondary)] dark:!bg-white/5 border border-indigo-500/20 dark:border-indigo-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-2xl" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20">
                                <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-black text-[var(--text-primary)]">Your Choice</h2>
                        </div>
                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium max-w-2xl">
                            You can manage or disable cookies through your browser settings, though some parts of StayEase may not function correctly without them.
                        </p>
                    </div>
                </section>
            </div>
        </ContentPage>
    );
}
