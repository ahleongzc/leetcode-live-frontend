export type Type =
    "setUpInterview" | "setUpInterviewDOM" |
    "joinInterview" | "joinInterviewDOM" |
    "endInterview" | "endInterviewDOM" |
    "refresh" | "refreshDOM" |
    "debug"

export const LOCAL_STORAGE_SESSION_TOKEN_KEY = "sessionToken"
export const SESSION_TOKEN_HEADER = "x-session-token"
export const INTERVIEW_TOKEN_HEADER = "x-interview-token"

export const DEFAULT_PAGE_HEIGHT = 500
export const DEFAULT_PAGE_WIDTH = 400

export const HISTORY_PAGE_HEIGHT = 700
export const HISTORY_PAGE_WIDTH = 600

export const ONGOING_PAGE_HEIGHT = 100
export const ONGOING_PAGE_WIDTH = 400

export interface Message {
    Type: Type
    Description?: string
    QuestionID?: string
    InterviewToken?: string
    Error?: string
    End?: boolean
}

export interface SetUpInterviewRequest {
    question_id: string
    description: string
}

export interface MessageReq {
    from: string
    chunk: string
    code: string
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

