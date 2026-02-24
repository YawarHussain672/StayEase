"use client";

import ContentPage from "@/components/layout/ContentPage";
import { HelpCircle, Search, HelpCircle as Question, Book, MessageSquare } from "lucide-react";

export default function HelpPage() {
    const faqs = [
        { q: "How do I book a stay?", a: "Find a property you like, select your dates, and click 'Book Now'. Follow the checkout process to confirm." },
        { q: "Is my deposit safe?", a: "Yes, StayEase holds your deposit in an escrow-style account until you check in safely." },
        { q: "Can I visit the property before booking?", a: "Many owners offer virtual tours. If you need a physical visit, contact the owner through our 'Contact Owner' feature." },
    ];

    return (
        <ContentPage
            title="Help Center"
            subtitle="Find answers to common questions or reach out to our 24/7 AI support."
            icon={HelpCircle}
        >
            <div className="space-y-12">
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for help articles..."
                        className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-[var(--text-primary)] transition-all"
                    />
                </div>

                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Book className="w-6 h-6 text-indigo-500" />
                        Top FAQs
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <details key={faq.q} className="group glass-panel rounded-2xl border border-white/20 dark:border-white/10 transition-all hover:bg-white/5">
                                <summary className="p-6 cursor-pointer list-none flex justify-between items-center outline-none">
                                    <span className="font-bold pr-4 text-[var(--text-primary)]">{faq.q}</span>
                                    <Question className="w-5 h-5 text-indigo-500 dark:text-indigo-400 group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-6 pb-6 text-[var(--text-secondary)] dark:text-slate-400 border-t border-white/10 dark:border-white/5 pt-4">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>

                <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white text-center shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
                    <p className="mb-6 opacity-90">Our AI Assistant and human support team are available 24/7.</p>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
                        className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 mx-auto active:scale-95 duration-200"
                    >
                        <MessageSquare className="w-5 h-5" />
                        Chat with Support
                    </button>
                </section>
            </div>
        </ContentPage>
    );
}
