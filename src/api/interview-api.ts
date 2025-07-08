import { SESSION_TOKEN_HEADER } from "@/types";
import { axiosInstance } from "./axios-instance";
import type { AxiosResponse } from "axios";

export interface SetUpInterviewRequestBody {
    question_id: string
    description: string
}

const interviewAPIs = {
    setUpNewInterview: async (reqBody: SetUpInterviewRequestBody, sessionToken: string): Promise<AxiosResponse> => {
        const response = await axiosInstance.post("/v1/interview/set-up-new", reqBody, {
            headers: {
                [SESSION_TOKEN_HEADER]: sessionToken
            }
        })
        return response
    },
    abandonUnfinishedInterview: async (sessionToken: string) => {
        return await axiosInstance.post("/v1/interview/abandon-unfinished", {}, {
            headers: {
                [SESSION_TOKEN_HEADER]: sessionToken
            }
        })
    },
    interviewHistoryData: async (limit: number, offset: number, sessionToken: string) => {
        const response = await axiosInstance.get(`/v1/interview/history`, {
            params: { limit, offset },
            headers: {
                [SESSION_TOKEN_HEADER]: sessionToken
            }
        });
        return response.data
    },
    unfinishedInterviewData: async (sessionToken: string) => {
        const response = await axiosInstance.get(`/v1/interview/unfinished`, {
            headers: {
                [SESSION_TOKEN_HEADER]: sessionToken
            }
        });
        return response.data
    }
}

export default interviewAPIs