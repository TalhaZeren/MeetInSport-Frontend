import {create} from 'zustand';

// Define the state for logging.
interface AuthState{
    token : string | null;
    userId : string | null;
    name : string | null;
    role : string | null;
    isAuthenticated : boolean;

    // Actions 
    setAuth: (token: string, userId: string, name: string, role: string) => void;
    logout : () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token : localStorage.getItem("jwt_token"),
    userId : localStorage.getItem("user_id"),
    name : localStorage.getItem("user_name"),
    role : localStorage.getItem("user_role"),
    isAuthenticated : !!localStorage.getItem("jwt_token"),

    // Save to browser storage so they stay logged in after closing the tab
    setAuth: (token, userId, name, role)=> {
        localStorage.setItem("jwt_token", token);
        localStorage.setItem("user_id",userId);
        localStorage.setItem("user_name",name);
        localStorage.setItem("user_role",role);
        
        set({
            token, 
            userId, 
            name, 
            role, 
            isAuthenticated: true});
    },
    logout:() => {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_role");

        set({token : null, 
            userId: null,
            name : null,
            role : null, 
            isAuthenticated : false,
        });
    },
}));