import axiosClient from '../axiosClient';
import type { CoachResponse, UpdateCoachProfileRequest } from '../../types';

export const coachService = {
  
  getAllCoaches: async (): Promise<CoachResponse[]> => {
    // Hits GET http://localhost:8080/api/v1/coaches
    const response = await axiosClient.get<CoachResponse[]>('/coaches');
    return response.data;
  },

  // PUT Request to upload profile image
  updateProfile : async (data : UpdateCoachProfileRequest) : Promise<CoachResponse>=> {
    const response  = await axiosClient.put<CoachResponse>('/coaches/profile', data);
    return response.data;
  },

  getCoachById : async (id : string) : Promise<CoachResponse> => {
    const response = await axiosClient.get<CoachResponse>(`/coaches/${id}`);
    return response.data;
  }

};