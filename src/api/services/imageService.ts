import axiosClient from "../axiosClient";
import { ENDPOINTS } from "../endpoints";

export const imageService = {

    uploadImage : async (file : File) : Promise<string> => {
        const formData = new FormData();
        formData.append('file' ,file);
        const response = await axiosClient.post<{url : string}>(ENDPOINTS.IMAGES.UPLOAD, formData, {
            headers : {
                'Content-Type' : 'multipart/form-data',
            },
        });
        return response.data.url;
    }
}