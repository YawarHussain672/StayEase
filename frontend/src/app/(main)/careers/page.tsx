"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContentPage from "@/components/layout/ContentPage";
import { Briefcase, Rocket, Sparkles, Heart, X, Upload, Send, CheckCircle2 } from "lucide-react";

export default function CareersPage() {
    const [selectedJob, setSelectedJob] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const jobs = [
        { title: "Senior AI Engineer", team: "Engineering", location: "Remote / Bangalore" },
        { title: "Product Designer", team: "Design", location: "Bangalore" },
        { title: "Operations Manager", team: "Operations", location: "Pune" },
        { title: "Content Strategist", team: "Marketing", location: "Mumbai" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setSelectedJob(null);
        }, 3000);
    };

    return (
        <>
            <ContentPage
                title="Join the Squad"
                subtitle="Help us build the future of urban living in India."
                icon={Briefcase}
            >
                <div className="space-y-12">
                    <section className="text-center">
                        <h2 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">Why StayEase?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="p-4">
                                <Rocket className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
                                <h3 className="font-bold text-[var(--text-primary)]">Fast Growth</h3>
                                <p className="text-sm text-[var(--text-secondary)] dark:text-slate-400">We're scaling at 300% YoY.</p>
                            </div>
                            <div className="p-4">
                                <Sparkles className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                                <h3 className="font-bold text-[var(--text-primary)]">AI Native</h3>
                                <p className="text-sm text-[var(--text-secondary)] dark:text-slate-400">Work with the latest in GenAI.</p>
                            </div>
                            <div className="p-4">
                                <Heart className="w-10 h-10 text-red-500 mx-auto mb-3" />
                                <h3 className="font-bold text-[var(--text-primary)]">Great Culture</h3>
                                <p className="text-sm text-[var(--text-secondary)] dark:text-slate-400">We value people over pixels.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Open Roles</h2>
                        <div className="space-y-4">
                            {jobs.map((job) => (
                                <div key={job.title} className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center group cursor-pointer hover:border-indigo-500/50 transition-colors">
                                    <div className="flex-1 w-full sm:w-auto">
                                        <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-indigo-500 transition-colors">{job.title}</h3>
                                        <p className="text-[10px] text-[var(--text-secondary)] dark:text-slate-400 uppercase tracking-widest font-black mt-1">{job.team} • {job.location}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedJob(job.title)}
                                        className="mt-4 sm:mt-0 glass-btn-primary px-8 py-3 !rounded-full !bg-indigo-600 dark:!bg-indigo-500 text-white text-sm font-black shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </ContentPage>

            <AnimatePresence>
                {selectedJob && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedJob(null)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg glass-panel !bg-white/95 dark:!bg-slate-950/95 rounded-[2.5rem] shadow-2xl overflow-hidden border-white/40 dark:border-white/10 max-h-[90vh] flex flex-col"
                        >
                            <div className="absolute top-4 right-4 z-20">
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar">
                                {isSubmitted ? (
                                    <div className="py-16 flex flex-col items-center text-center">
                                        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20">
                                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                        </div>
                                        <h3 className="text-3xl font-black text-[var(--text-primary)] mb-3 tracking-tight">Application Sent!</h3>
                                        <p className="text-[var(--text-secondary)] dark:text-slate-400 font-medium">Good luck! Our team will reach out to you via email soon.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-10 pr-12">
                                            <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-[0.3em] block mb-2">Careers • Join Us</span>
                                            <h2 className="text-3xl font-black text-[var(--text-primary)] leading-tight tracking-tight">{selectedJob}</h2>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Full Name</label>
                                                    <input required type="text" placeholder="John Doe" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-sm transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Contact No.</label>
                                                    <input required type="tel" placeholder="+91 98765 43210" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-sm transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Email Address</label>
                                                <input required type="email" placeholder="john@stayease.com" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-sm transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Resume / CV</label>
                                                <div className="relative group">
                                                    <input required type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                                    <div className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl px-5 py-8 flex flex-col items-center gap-3 group-hover:border-indigo-500/30 transition-all">
                                                        <div className="w-12 h-12 rounded-full bg-indigo-500/5 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                                                            <Upload className="w-6 h-6 text-indigo-500/60 group-hover:text-indigo-500 transition-colors" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-xs font-black text-[var(--text-primary)]">Click or drag to upload</p>
                                                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">PDF, DOCX (Max 5MB)</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Cover Letter</label>
                                                <textarea rows={3} placeholder="Tell us why you're a great fit for the StayEase squad..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-sm transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full glass-btn-primary py-5 !rounded-2xl !bg-indigo-600 dark:!bg-indigo-500 text-white font-black shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 mt-4 hover:scale-[1.02] active:scale-95 transition-all"
                                            >
                                                <Send className="w-5 h-5" />
                                                Submit Application
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
