import { type LoginRequest, sessionIDHeader } from "@/types";
import { axiosInstance } from "./axios-instance";

const authAPIs = {
    login: async (data: LoginRequest) => {
        return axiosInstance.post("/v1/auth/login", data)
    },
    authStatus: async (sessionID: string) => {
        return axiosInstance.post("/v1/auth/status", {}, {
            headers: {
                [sessionIDHeader]: sessionID
            }
        })
    }
}

export default authAPIs