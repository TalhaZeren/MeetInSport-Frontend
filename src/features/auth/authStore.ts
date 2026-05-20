import { create } from 'zustand';


interface AuthState {
    token: string | null;
    userId: string | null;
    name: string | null;
    role: string | null;
    email: string | null;
    avatarUrl: string | null;
    isAuthenticated: boolean;

    // Actions 
    setAuth: (token: string, userId: string, name: string, email: string, role: string, avatarUrl: string | null) => void;
    updateAvatarInStore: (avatarUrl: string) => void; 
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem("jwt_token"),
    userId: localStorage.getItem("user_id"),
    name: localStorage.getItem("user_name"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("user_role"),
    avatarUrl: localStorage.getItem("user_avatar"),
    isAuthenticated: !!localStorage.getItem("jwt_token"),

    setAuth: (token, userId, name, email, role, avatarUrl) => {
        localStorage.setItem("jwt_token", token);
        localStorage.setItem("user_id", userId);
        localStorage.setItem("user_name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("user_role", role);
        if (avatarUrl) localStorage.setItem("user_avatar", avatarUrl);

        set({
            token,
            userId,
            name,
            email,
            role,
            avatarUrl,
            isAuthenticated: true
        });
    },

    updateAvatarInStore: (avatarUrl) => {
        localStorage.setItem("user_avatar", avatarUrl);
        set({ avatarUrl });
    },

    logout: () => {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("email");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_avatar");

        set({
            token: null,
            userId: null,
            name: null,
            role: null,
            email: null,
            avatarUrl: null,
            isAuthenticated: false,
        });
    },
}));
