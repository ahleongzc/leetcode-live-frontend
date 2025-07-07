import { SESSION_TOKEN_HEADER } from "@/types";
import { axiosInstance } from "./axios-instance";

export interface LoginRequest {
    email: string
    password: string
}

const authAPIs = {
    login: async (email: string, password: string) => {
        return await axiosInstance.post("/v1/auth/login", {
            email: email,
            password: password
        })
    },
    authStatus: async (sessionToken: string) => {
        return await axiosInstance.post("/v1/auth/status", {}, {
            headers: {
                [SESSION_TOKEN_HEADER]: sessionToken
            }
        })
    },
    logout: async (sessionToken: string) => {
        return await axiosInstance.post("/v1/auth/logout", {}, {  // Fixed: removed extra ),
            headers: {
                [SESSION_TOKEN_HEADER]: sessionToken
            }
        })
    }
}

export default authAPIs