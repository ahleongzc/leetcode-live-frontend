import { SESSION_TOKEN_HEADER } from "@/types";
import { axiosInstance } from "./axios-instance";

const userAPIs = {
    userProfileData: async (sessionToken: string) => {
        const response = await axiosInstance.get("/v1/user", {
            headers: {
                [SESSION_TOKEN_HEADER]: sessionToken
            }
        })
        return response.data
    },
}

export default userAPIs