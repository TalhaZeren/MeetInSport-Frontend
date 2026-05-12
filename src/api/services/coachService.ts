import axiosClient from '../axiosClient';
import { ENDPOINTS } from '../endpoints';
import type { CoachResponse, UpdateCoachProfileRequest } from '../../types';

export const coachService = {
  
  getAllCoaches: async (): Promise<CoachResponse[]> => {
    const response = await axiosClient.get<CoachResponse[]>(ENDPOINTS.COACHES.BASE);
    return response.data;
  },

  updateProfile : async (data : UpdateCoachProfileRequest) : Promise<CoachResponse>=> {
    const response  = await axiosClient.put<CoachResponse>(ENDPOINTS.COACHES.PROFILE, data);
    return response.data;
  },

  getCoachById : async (id : string) : Promise<CoachResponse> => {
    const response = await axiosClient.get<CoachResponse>(ENDPOINTS.COACHES.BY_ID(id));
    return response.data;
  },

  getMyProfile: async (): Promise<CoachResponse> => {
    const response = await axiosClient.get<CoachResponse>(ENDPOINTS.COACHES.ME);
    return response.data;
  }
};