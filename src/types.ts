export type Type = "storeSessionToken" | "debug" | "getSessionToken" | "setUpInterview" | "setUpInterviewDOM" | "errorDOM"

export const sessionToken = "sessionToken"
export const sessionTokenHeader = "x-session-token"

export interface Message {
    Type: Type
    Content?: string
    SessionToken?: string
    error?: string
}

export interface MessageReq {
    from: string
    chunk: string
}

export interface Interview {
    id: string;
    question: string;
    question_attempt_number: number;
    score: number | null;
    passed: boolean | null;
    feedback: string | null;
    start_timestamp_s: number;
    end_timestamp_s: number | null;
}

