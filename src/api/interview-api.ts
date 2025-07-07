import { SESSION_TOKEN_HEADER } from "@/types";
import { axiosInstance } from "./axios-instance";

export interface SetUpInterviewRequestBody {
    question_id: string
    description: string
}

const interviewAPIs = {
    joinInterview: async (reqBody: SetUpInterviewRequestBody, sessionToken: string) => {
        try {
            axiosInstance.post("/v1/interview/set-up-interview", reqBody, {
                headers: {
                    [SESSION_TOKEN_HEADER]: sessionToken
                }
            })
                .then((res) => {
                    console.log(res.data?.token)
                })
        } catch (error) {
            console.log(error)
        }
    },
    interviewHistoryData: async (limit: number, offset: number, sessionToken: string) => {
        const response = await axiosInstance.get(`/v1/interview/history`, {
            params: { limit, offset },
            headers: {
                [SESSION_TOKEN_HEADER]: sessionToken
            }
        });
        return response.data
    }
}

export default interviewAPIs