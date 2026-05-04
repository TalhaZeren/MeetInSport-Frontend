import axios from "axios";
import { useAuthStore } from "../features/auth/authStore";

const axiosClient = axios.create({
    baseURL : '/api/v1',
    headers:{
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;

        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    });

    axiosClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if(error.response?.status === 401){
                useAuthStore.getState().logout();
        }
        return Promise.reject(error);
  });
export default axiosClient;