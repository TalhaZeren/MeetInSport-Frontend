import axiosClient from "../axiosClient";
import { ENDPOINTS } from "../endpoints";
import {type LoginRequest,type LoginResponse,type RegisterRequest } from "../../types/auth";


export const authService ={
    // POST http://localhost:8080/api/v1/auth/login
    login : async (credentials : LoginRequest) : Promise<LoginResponse> => {
        const response = await axiosClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
        return response.data;
    },
    // POST http://localhost:8080/api/v1/auth/register 
    register : async (userData : RegisterRequest) : Promise<void> => {
        await axiosClient.post(ENDPOINTS.AUTH.REGISTER, userData);
    }
} 