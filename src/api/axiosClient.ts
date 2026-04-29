import axios from "axios";
import { config } from "zod/v4/core";

const axiosClient = axios.create({
    baseURL : 'http://localhost:8080',
    headers:{
        'Content-Type': 'application/json',
    }
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');

        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;