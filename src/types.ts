export type Type = "storeSessionToken" | "debug" | "getSessionToken" | "setUpInterview" | "setUpInterviewDOM" | "errorDOM" | "unauthorized"

export const LOCAL_STORAGE_SESSION_TOKEN_KEY = "sessionToken"
export const SESSION_TOKEN_HEADER = "x-session-token"

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

