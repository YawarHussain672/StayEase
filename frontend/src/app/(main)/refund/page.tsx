"use client";

import ContentPage from "@/components/layout/ContentPage";
import { Banknote, CreditCard, History, CheckCircle2 } from "lucide-react";

export default function RefundPage() {
    return (
        <ContentPage
            title="Refund Policy"
            subtitle="Transparent refund timelines and processes for your bookings."
            icon={Banknote}
        >
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <History className="w-6 h-6 text-indigo-500" />
                        Refund Timelines
                    </h2>
                    <div className="space-y-4">
                        <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-white/10 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-[var(--text-primary)]">Original Payment Method</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Credit/Debit Cards, NetBanking, UPI</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-indigo-500 dark:text-indigo-400">5-7 Days</p>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Processing Time</p>
                            </div>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-white/10 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-[var(--text-primary)]">StayEase Wallet</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Instant credit for future bookings</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-emerald-500 dark:text-emerald-400">Instant</p>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Processing Time</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-[var(--bg-secondary)] dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-white/10">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-[var(--text-primary)]">
                        <CreditCard className="w-6 h-6 text-purple-500" />
                        Processing Steps
                    </h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-1" />
                            <p className="text-sm text-[var(--text-secondary)] dark:text-slate-400">StayEase approves the refund request based on the <a href="/cancellation" className="text-indigo-500 dark:text-indigo-400 underline decoration-indigo-500/30 underline-offset-4 hover:decoration-indigo-500 transition-colors">Cancellation Policy</a>.</p>
                        </div>
                        <div className="flex gap-4">
                            <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-1" />
                            <p className="text-sm text-[var(--text-secondary)] dark:text-slate-400">The refund is initiated within 24 hours of approval.</p>
                        </div>
                        <div className="flex gap-4">
                            <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-1" />
                            <p className="text-sm text-[var(--text-secondary)] dark:text-slate-400">You receive a confirmation email with a unique Transaction ID for tracking with your bank.</p>
                        </div>
                    </div>
                </section>
            </div>
        </ContentPage>
    );
}
