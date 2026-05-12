import axiosClient from "../axiosClient";
import { ENDPOINTS } from "../endpoints";
import type { CreateLessonPackageRequest, LessonPackageResponse } from '../../types';


export const lessonPackageService ={

        createPackage : async (data : CreateLessonPackageRequest) : Promise<LessonPackageResponse> => {
            const response = await axiosClient.post<LessonPackageResponse>(ENDPOINTS.PACKAGES.BASE, data);
            return response.data;
        },

       getPackagesByCoachId: async (coachId: string): Promise<LessonPackageResponse[]> => {
            const response = await axiosClient.get<LessonPackageResponse[]>(ENDPOINTS.PACKAGES.BY_COACH_ID(coachId));
            return response.data;
        },

        deletePackage : async (packageId : string) : Promise<void> => {
            await axiosClient.delete(ENDPOINTS.PACKAGES.BY_ID(packageId));
        },
        
        getPackageById: async (packageId : string)  : Promise<LessonPackageResponse> => {
            const response = await axiosClient.get<LessonPackageResponse>(ENDPOINTS.PACKAGES.BY_ID(packageId));
            return response.data;
        }

};