import axiosClient from '../axiosClient';
import { ENDPOINTS } from '../endpoints';
import type { CreateReservationRequest, CancelReservationRequest, ReservationResponse } from '../../types';


export const reservationService = {

    createReservation: async (data: CreateReservationRequest): Promise<ReservationResponse> => {
    const response = await axiosClient.post<ReservationResponse>(ENDPOINTS.RESERVATIONS.BASE, data);
    return response.data;
  },

  getMyReservations: async (): Promise<ReservationResponse[]> => {
    const response = await axiosClient.get<ReservationResponse[]>(ENDPOINTS.RESERVATIONS.ME);
    return response.data;
  },

  cancelReservation: async (id: string, data: CancelReservationRequest): Promise<ReservationResponse> => {
    const response = await axiosClient.put<ReservationResponse>(ENDPOINTS.RESERVATIONS.CANCEL(id), data);
    return response.data;
  }

};