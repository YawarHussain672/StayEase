import Link from "next/link";
import { Building2, Facebook, Instagram, Twitter, Linkedin, Heart } from "lucide-react";

const FOOTER_LINKS = {
    Company: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Press", href: "/press" },
    ],
    Explore: [
        { label: "All Properties", href: "/properties" },
        { label: "Hostels", href: "/properties?type=hostel" },
        { label: "PG / Co-Living", href: "/properties?type=pg" },
        { label: "Budget Hotels", href: "/properties?type=hotel" },
    ],
    Support: [
        { label: "Help Center", href: "/help" },
        { label: "Safety", href: "/safety" },
        { label: "Cancellation Policy", href: "/cancellation" },
        { label: "Contact Us", href: "/contact" },
    ],
    Legal: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Refund Policy", href: "/refund" },
    ],
};

const SOCIAL_LINKS = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
    return (
        <footer className="relative mt-20 pt-16 pb-8 z-10">
            {/* Glass Footer Panel */}
            <div className="glass-panel !rounded-none backdrop-blur-3xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Main Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                        {/* Brand Column */}
                        <div className="col-span-2 md:col-span-4 lg:col-span-1">
                            <Link href="/" className="flex items-center gap-3 mb-6 transition-transform hover:scale-105 active:scale-95 w-fit">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                                    Stay<span className="text-indigo-600 dark:text-indigo-400">Ease</span>
                                </span>
                            </Link>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8 max-w-[240px]">
                                India's first AI-powered platform for finding and booking high-quality hostels, PGs, and budget stays.
                            </p>
                            {/* Social Icons */}
                            <div className="flex items-center gap-3">
                                {SOCIAL_LINKS.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="glass-icon-btn"
                                    >
                                        <social.icon className="w-4 h-4 text-[var(--text-secondary)]" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Link Columns */}
                        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                            <div key={title} className="space-y-6">
                                <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-[0.2em]">
                                    {title}
                                </h3>
                                <ul className="space-y-4">
                                    {links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-[var(--text-secondary)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 flex items-center group"
                                            >
                                                <span className="w-0 group-hover:w-1.5 h-[1.5px] bg-indigo-600 dark:bg-indigo-400 mr-0 group-hover:mr-2 transition-all duration-200 rounded-full" />
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/20 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col items-center md:items-start gap-1">
                            <p className="text-xs text-[var(--text-muted)] font-medium">
                                © {new Date().getFullYear()} StayEase Platform. All rights reserved.
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
                                Powered by <span className="text-indigo-500/80">StayEase AI</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-default select-none">
                                Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in India
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
