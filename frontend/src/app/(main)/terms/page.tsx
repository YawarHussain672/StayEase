"use client";

import ContentPage from "@/components/layout/ContentPage";
import { FileText, CheckCircle, AlertTriangle, Scale } from "lucide-react";

export default function TermsPage() {
    return (
        <ContentPage
            title="Terms of Service"
            subtitle="Please read these terms carefully before using the StayEase platform."
            icon={Scale}
        >
            <div className="space-y-10 text-[var(--text-primary)]">
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-6 h-6 text-indigo-500" />
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">1. Acceptance of Terms</h2>
                    </div>
                    <p className="text-[var(--text-secondary)] dark:text-slate-400 font-medium leading-relaxed">
                        By accessing or using StayEase, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-6 h-6 text-purple-500" />
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">2. Booking & Cancellation</h2>
                    </div>
                    <p className="text-[var(--text-secondary)] dark:text-slate-400 font-medium leading-relaxed">
                        All bookings made through StayEase are subject to the specific cancellation policy of the property owner/manager. StayEase acts as a facilitator and is not liable for disputes arising between guests and hosts, though we provide mediation support.
                    </p>
                </section>

                <section className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-white/10 bg-amber-500/5 dark:bg-amber-400/5">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                        <h3 className="font-bold text-[var(--text-primary)]">User Conduct</h3>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] dark:text-slate-400">
                        Users are expected to maintain the decorum of the properties they stay in. Any illegal activity or violation of house rules may lead to immediate eviction and a permanent ban from the platform.
                    </p>
                </section>
            </div>
        </ContentPage>
    );
}
