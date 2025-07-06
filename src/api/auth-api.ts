import { sessionTokenHeader } from "@/types";
import { axiosInstance } from "./axios-instance";

export interface LoginRequest {
    email: string
    password: string
}

const authAPIs = {
    login: async (data: LoginRequest) => {
        const res = await axiosInstance.post("/v1/auth/login", data)
        return res
    },
    authStatus: async (sessionToken: string) => {
        await axiosInstance.post("/v1/auth/status", {}, {
            headers: {
                [sessionTokenHeader]: sessionToken
            }
        })
    }
}

export default authAPIs