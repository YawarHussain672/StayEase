"use client";

import ContentPage from "@/components/layout/ContentPage";
import { ShieldAlert, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
    return (
        <ContentPage
            title="Privacy Policy"
            subtitle="Last updated: February 16, 2026. Your privacy is our priority."
            icon={ShieldAlert}
        >
            <div className="space-y-10">
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Lock className="w-6 h-6 text-indigo-500" />
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Data Security</h2>
                    </div>
                    <p className="text-[var(--text-secondary)] dark:text-slate-400 leading-relaxed font-medium">
                        At StayEase, we take your data security seriously. We use industry-standard encryption protocols to protect your personal information, including login credentials and payment details. We do not sell your personal data to third parties.
                    </p>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Eye className="w-6 h-6 text-purple-500" />
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Information We Collect</h2>
                    </div>
                    <ul className="list-disc pl-6 space-y-3 text-[var(--text-secondary)] dark:text-slate-400 font-medium">
                        <li><strong className="text-[var(--text-primary)]">Identity Data:</strong> Name, phone number, and email address.</li>
                        <li><strong className="text-[var(--text-primary)]">Booking Data:</strong> Property choices, stay dates, and payment history.</li>
                        <li><strong className="text-[var(--text-primary)]">Technical Data:</strong> IP address, device type, and app usage patterns (used for AI optimizations).</li>
                    </ul>
                </section>

                <section className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-6 h-6 text-emerald-500" />
                        <h3 className="font-bold">Your Rights</h3>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] dark:text-slate-400">
                        You have the right to access, update, or request deletion of your personal data at any time through the StayEase app or by contacting our support team.
                    </p>
                </section>
            </div>
        </ContentPage>
    );
}
