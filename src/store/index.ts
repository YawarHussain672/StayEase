import { create } from "zustand";

interface User {
    id: string;
    name: string;
    email: string;
    role: "user" | "owner" | "admin";
    avatar?: string;
    phone?: string;
    createdAt?: string;
    preferences?: {
        budget?: { min?: number | string; max?: number | string };
        preferredCities?: string[];
        preferredType?: string;
    };
    [key: string]: any;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: true,

    setAuth: (user, token) => {
        localStorage.setItem("stayease-token", token);
        localStorage.setItem("stayease-user", JSON.stringify(user));
        set({ user, token, isLoading: false });
    },

    logout: () => {
        localStorage.removeItem("stayease-token");
        localStorage.removeItem("stayease-user");
        set({ user: null, token: null, isLoading: false });
    },

    loadFromStorage: () => {
        const token = localStorage.getItem("stayease-token");
        const userStr = localStorage.getItem("stayease-user");
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                set({ user, token, isLoading: false });
            } catch {
                set({ isLoading: false });
            }
        } else {
            set({ isLoading: false });
        }
    },
}));

interface UIState {
    searchQuery: string;
    selectedCity: string;
    setSearchQuery: (q: string) => void;
    setSelectedCity: (c: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
    searchQuery: "",
    selectedCity: "",
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setSelectedCity: (selectedCity) => set({ selectedCity }),
}));
