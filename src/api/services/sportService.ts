import axiosClient from "../axiosClient";
import { type SportResponse } from "../../types";

export const sportService = {
    getAllSports : async (): Promise<SportResponse[]> => {
        const response = await axiosClient.get<SportResponse[]>('/sports');
        return response.data;
    }
}