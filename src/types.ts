export type Command = "startSession" | "endSession" | "playAudio" | "login" | "logout" | "isLoggedIn" | "debug"
export type Type = "login" | "interview" | "debug" | "validate"

export const sessionID = "sessionID"
export const sessionIDHeader = "X-Session-ID"

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;


export interface Message {
    Type: Type
    email?: string
    password?: string
    Content?: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface MessageReq {
    type: string
    content: string
}
