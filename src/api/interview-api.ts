import { sessionIDHeader } from "@/types";
import { axiosInstance } from "./axios-instance";

export interface SetUpInterviewRequestBody {
    question_id: string
    description: string
}


const interviewAPIs = {
    joinInterview: async (reqBody: SetUpInterviewRequestBody, sessionID: string) => {
        try {
            axiosInstance.post("/v1/interview/set-up-interview", reqBody, {
                headers: {
                    [sessionIDHeader]: sessionID
                }
            })
                .then((res) => {
                    console.log(res.data?.token)
                })
        } catch (error) {
            console.log(error)
        }
    },
}

export default interviewAPIs