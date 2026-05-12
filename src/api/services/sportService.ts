import axiosClient from "../axiosClient";
import { ENDPOINTS } from "../endpoints";
import { type SportResponse } from "../../types";

export const sportService = {
    getAllSports : async (): Promise<SportResponse[]> => {
        const response = await axiosClient.get<SportResponse[]>(ENDPOINTS.SPORTS.BASE);
        return response.data;
    }
}