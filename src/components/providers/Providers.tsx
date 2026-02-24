"use client";
import { ThemeProvider } from "./ThemeProvider";

import { useEffect } from "react";
import { useAuthStore } from "@/store";

export function Providers({ children }: { children: React.ReactNode }) {
    const loadFromStorage = useAuthStore(state => state.loadFromStorage);

    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    return (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    );
}
