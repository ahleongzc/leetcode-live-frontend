export type Type = "storeSessionID" | "debug" | "getSessionID" | "setUpInterview" | "setUpInterviewDOM"

export const sessionID = "sessionID"
export const sessionIDHeader = "X-Session-ID"

export interface Message {
    Type: Type
    Content?: string
    SessionID?: string
}

export interface MessageReq {
    type: string
    content: string
}
