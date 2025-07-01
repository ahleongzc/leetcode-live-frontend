import { sessionIDHeader } from "@/types";
import { axiosInstance } from "./axios-instance";

export interface LoginRequest {
    email: string
    password: string
}
export interface LoginResponse {
    sessionID: string
}


const authAPIs = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const res = await axiosInstance.post("/v1/auth/login", data)
        return { sessionID: res.data.session_id }
    },
    authStatus: async (sessionID: string) => {
        await axiosInstance.post("/v1/auth/status", {}, {
            headers: {
                [sessionIDHeader]: sessionID
            }
        })
    }
}

export default authAPIs