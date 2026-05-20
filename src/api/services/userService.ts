import axiosClient from "../axiosClient";
import { ENDPOINTS } from "../endpoints";

export const userService = {

    updateAvatar : async (avatarUrl : string) : Promise<string> => {
        const response = await axiosClient.put<{avatarUrl : string}>(ENDPOINTS.USERS.AVATAR,{avatarUrl});
        return response.data.avatarUrl;
    }

}