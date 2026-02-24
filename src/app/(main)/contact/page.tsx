"use client";

import ContentPage from "@/components/layout/ContentPage";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <ContentPage
            title="Get in Touch"
            subtitle="We're here to help you find your perfect stay. Reach out anytime."
            icon={Mail}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Contact Information</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-indigo-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-[var(--text-primary)]">Email us at</p>
                                    <p className="text-[var(--text-secondary)] dark:text-slate-400">support@stayease.in</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-purple-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-[var(--text-primary)]">Call us</p>
                                    <p className="text-[var(--text-secondary)] dark:text-slate-400">+91 (800) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-[var(--text-primary)]">Our HQ</p>
                                    <p className="text-[var(--text-secondary)] dark:text-slate-400">123 Tech Park, HSR Layout, Bangalore - 560034</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="glass-panel p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Send a Message</h2>
                    <form className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Full Name</label>
                            <input type="text" className="w-full bg-[var(--bg-secondary)] dark:bg-slate-900 border border-white/10 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 text-[var(--text-primary)]" placeholder="John Doe" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Email Address</label>
                            <input type="email" className="w-full bg-[var(--bg-secondary)] dark:bg-slate-900 border border-white/10 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 text-[var(--text-primary)]" placeholder="john@example.com" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Message</label>
                            <textarea rows={4} className="w-full bg-[var(--bg-secondary)] dark:bg-slate-900 border border-white/10 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 text-[var(--text-primary)]" placeholder="How can we help?"></textarea>
                        </div>
                        <button className="w-full glass-btn-primary py-4 !rounded-xl !bg-indigo-600 dark:!bg-indigo-500 text-white font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                            <Send className="w-5 h-5" />
                            Send Message
                        </button>
                    </form>
                </section>
            </div>
        </ContentPage>
    );
}
