"use client";

import ContentPage from "@/components/layout/ContentPage";
import { XCircle, RefreshCcw, Clock, Calendar } from "lucide-react";

export default function CancellationPage() {
    return (
        <ContentPage
            title="Cancellation Policy"
            subtitle="Clear, fair, and transparent policies for your peace of mind."
            icon={XCircle}
        >
            <div className="space-y-12">
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-white/10 text-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                            <RefreshCcw className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="font-bold mb-2 text-[var(--text-primary)]">Free Cancellation</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Up to 48 hours after booking for most stays.</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-white/10 text-center">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                            <Calendar className="w-6 h-6 text-amber-500" />
                        </div>
                        <h3 className="font-bold mb-2 text-[var(--text-primary)]">Partial Refund</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Up to 7 days before check-in.</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-white/10 text-center">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                            <XCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-bold mb-2 text-[var(--text-primary)]">Non-Refundable</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">If cancelled within 24 hours of check-in.</p>
                    </div>
                </section>

                <section className="prose dark:prose-invert prose-slate max-w-none prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] dark:prose-p:text-slate-400">
                    <h3 className="text-[var(--text-primary)]">How it works</h3>
                    <p>1. Go to your Bookings page.</p>
                    <p>2. Select the booking you want to cancel.</p>
                    <p>3. Click 'Cancel Booking'. The refund amount will be calculated automatically based on the property's policy.</p>
                    <p className="text-sm p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/10 text-[var(--text-secondary)] dark:text-slate-400">
                        <strong className="text-[var(--text-primary)]">Note:</strong> Some properties may have their own custom policies that override these defaults. Always check the specific property page before booking.
                    </p>
                </section>
            </div>
        </ContentPage>
    );
}
