import axiosClient from "../axiosClient";
import type { CreateLessonPackageRequest, LessonPackageResponse } from '../../types';


export const lessonPackageService ={


        createPackage : async (data : CreateLessonPackageRequest) : Promise<LessonPackageResponse> => {
            const response = await axiosClient.post<LessonPackageResponse>('/packages', data);
            return response.data;
        },

       getPackagesByCoachId: async (coachId: string): Promise<LessonPackageResponse[]> => {
            const response = await axiosClient.get<LessonPackageResponse[]>(`/packages/coach/${coachId}`);
            return response.data;
        },

        deletePackage : async (packageId : string) : Promise<void> => {
            await axiosClient.delete(`packages/${packageId}`);
        }

};