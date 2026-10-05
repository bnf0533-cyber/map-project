import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null as User | null,
            token: null as string | null,
            setAuth: (user, token) => set({ user, token }),
            logout: () => {
                localStorage.removeItem("auth-storage");
                set({ user: null, token: null });
            },
        }),
        {
            name: "auth-storage",
        }
    )
);
