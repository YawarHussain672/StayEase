"use client";

import { useEffect, useState } from "react";

export default function BackgroundOrbs() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#dde3ea] dark:bg-[#0b1120] transition-colors duration-500">
            {/* 
              Vivid orbs — bright enough to show through frosted glass 
              Light: mix-blend-multiply on grey bg produces warm/cool tones
              Dark: mix-blend-screen on dark bg gives vivid glow
            */}
            {/* Indigo / violet — top left */}
            <div
                className="absolute top-[-25%] left-[-15%] w-[65vw] h-[65vw] rounded-full blur-[90px] animate-orb-1"
                style={{
                    background: 'radial-gradient(circle, rgba(129,140,248,0.7) 0%, rgba(99,102,241,0.4) 60%, transparent 100%)'
                }}
            />
            {/* Cyan / sky — right center */}
            <div
                className="absolute top-[20%] right-[-20%] w-[55vw] h-[55vw] rounded-full blur-[90px] animate-orb-2"
                style={{
                    background: 'radial-gradient(circle, rgba(34,211,238,0.6) 0%, rgba(6,182,212,0.35) 60%, transparent 100%)'
                }}
            />
            {/* Fuchsia / rose — bottom left */}
            <div
                className="absolute bottom-[-20%] left-[5%] w-[60vw] h-[60vw] rounded-full blur-[90px] animate-orb-3"
                style={{
                    background: 'radial-gradient(circle, rgba(192,132,252,0.6) 0%, rgba(168,85,247,0.35) 60%, transparent 100%)'
                }}
            />
            {/* Rose accent — center-right bottom */}
            <div
                className="absolute top-[55%] left-[45%] w-[40vw] h-[40vw] rounded-full blur-[80px] animate-orb-4"
                style={{
                    background: 'radial-gradient(circle, rgba(251,113,133,0.5) 0%, rgba(244,63,94,0.25) 60%, transparent 100%)'
                }}
            />
        </div>
    );
}
