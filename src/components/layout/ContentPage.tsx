"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ContentPageProps {
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    children: React.ReactNode;
}

export default function ContentPage({ title, subtitle, icon: Icon, children }: ContentPageProps) {
    const fadeUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
            <div className="max-w-4xl mx-auto">
                {/* Header Unit (Liquid Glass Style) */}
                <motion.div
                    {...fadeUp}
                    className="glass-panel !rounded-3xl p-8 mb-12 relative overflow-hidden group"
                >
                    {/* Decorative background blobs */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/10 dark:bg-purple-400/5 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700 animate-blob" />
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-violet-500/10 dark:bg-violet-400/5 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-700 animate-blob animation-delay-2000" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/30 transform group-hover:rotate-6 transition-transform duration-500">
                            <Icon className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)] mb-4 drop-shadow-sm">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-lg text-[var(--text-secondary)] font-medium max-w-2xl leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Content Unit */}
                <motion.div
                    {...fadeUp}
                    transition={{ delay: 0.2 }}
                    className="glass-panel !rounded-3xl p-8 sm:p-12 text-[var(--text-primary)] leading-relaxed shadow-lg"
                >
                    <div className="prose dark:prose-invert prose-slate max-w-none prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-strong:text-[var(--text-primary)] prose-li:text-[var(--text-secondary)]">
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
