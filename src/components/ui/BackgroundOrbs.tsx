"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function BackgroundOrbs() {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Light: mix-blend-multiply makes orbs show as vivid tones on the grey-blue bg.
    // Dark:  mix-blend-screen makes orbs glow luminously on the near-black bg.
    const blendMode: React.CSSProperties["mixBlendMode"] = isDark ? "screen" : "multiply";
    const orbOpacity = isDark ? 1 : 0.85;

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#dde3ea] dark:bg-[#0b1120] transition-colors duration-500">
            {/* Indigo / violet — top left */}
            <div
                className="absolute top-[-25%] left-[-15%] w-[65vw] h-[65vw] rounded-full blur-[90px] animate-orb-1"
                style={{
                    background: 'radial-gradient(circle, rgba(129,140,248,0.7) 0%, rgba(99,102,241,0.4) 60%, transparent 100%)',
                    mixBlendMode: blendMode,
                    opacity: orbOpacity,
                }}
            />
            {/* Cyan / sky — right center */}
            <div
                className="absolute top-[20%] right-[-20%] w-[55vw] h-[55vw] rounded-full blur-[90px] animate-orb-2"
                style={{
                    background: 'radial-gradient(circle, rgba(34,211,238,0.6) 0%, rgba(6,182,212,0.35) 60%, transparent 100%)',
                    mixBlendMode: blendMode,
                    opacity: orbOpacity,
                }}
            />
            {/* Fuchsia / rose — bottom left */}
            <div
                className="absolute bottom-[-20%] left-[5%] w-[60vw] h-[60vw] rounded-full blur-[90px] animate-orb-3"
                style={{
                    background: 'radial-gradient(circle, rgba(192,132,252,0.6) 0%, rgba(168,85,247,0.35) 60%, transparent 100%)',
                    mixBlendMode: blendMode,
                    opacity: orbOpacity,
                }}
            />
            {/* Rose accent — center-right bottom */}
            <div
                className="absolute top-[55%] left-[45%] w-[40vw] h-[40vw] rounded-full blur-[80px] animate-orb-4"
                style={{
                    background: 'radial-gradient(circle, rgba(251,113,133,0.5) 0%, rgba(244,63,94,0.25) 60%, transparent 100%)',
                    mixBlendMode: blendMode,
                    opacity: orbOpacity,
                }}
            />
        </div>
    );
}
