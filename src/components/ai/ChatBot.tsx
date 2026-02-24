"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hi! 👋 I'm your StayEase AI assistant. I can help you find hostels, answer questions about bookings, or suggest properties. How can I help?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Listen for global open-chat event
    useEffect(() => {
        const handleOpenChat = (e: any) => {
            setIsOpen(true);
            if (e.detail?.message) {
                setInput(e.detail.message);
            }
        };
        window.addEventListener("open-chat", handleOpenChat as any);
        return () => window.removeEventListener("open-chat", handleOpenChat as any);
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input.trim() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
                }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            const data = await response.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, I'm having trouble connecting. Please try again or contact our support team.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer"
                style={{
                    background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 60%, #4338ca 100%)',
                    border: '2px solid rgba(255,255,255,0.35)',
                    boxShadow: '0 10px 30px -5px rgba(79,70,229,0.6), inset 0 2px 4px rgba(255,255,255,0.4)',
                }}
                aria-label="Open chat"
            >
                {isOpen
                    ? <X className="w-6 h-6 relative z-10" />
                    : <MessageCircle className="w-6 h-6 relative z-10" />
                }
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-24 right-6 z-50 w-[280px] max-w-[calc(100vw-2rem)] glass-panel !bg-white/95 dark:!bg-slate-950 rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col !border-white/30 dark:!border-white/20"
                        style={{ height: "380px" }}
                    >
                        {/* Header */}
                        <div className="px-4 py-3 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white relative">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-indigo-200" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-[13px] tracking-tight">StayEase AI</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                        <p className="text-[8px] text-white/70 font-black uppercase tracking-widest">Active Now</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="hover:opacity-60 transition-opacity">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide bg-white dark:bg-slate-950">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.role === "assistant" && (
                                        <div className="w-6 h-6 rounded-lg bg-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                                            <Bot className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[88%] px-3 py-2 rounded-xl text-[12px] leading-relaxed border ${msg.role === "user"
                                            ? "bg-indigo-600 text-white border-indigo-500 rounded-tr-none shadow-sm"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-white/5 rounded-tl-none font-medium shadow-sm"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-2.5">
                                    <div className="w-6 h-6 rounded-lg bg-indigo-700 flex items-center justify-center shrink-0">
                                        <Bot className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl rounded-tl-none border border-slate-200 dark:border-white/5">
                                        <div className="flex gap-1">
                                            <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="px-3.5 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/20 rounded-lg px-3 py-1.5 text-[11px] text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="w-8 h-8 rounded-lg bg-indigo-700 text-white flex items-center justify-center disabled:opacity-40 hover:bg-indigo-800 transition-colors shadow-md shrink-0"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
