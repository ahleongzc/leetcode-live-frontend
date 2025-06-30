export type Command = "startSession" | "endSession" | "playAudio" | "login" | "logout" | "isLoggedIn" | "debug"
export type Type = "auth"
export interface Message {
    Type: Type
    Email?: string
    Password?: string
    Message?: string
}

export interface MessageReq {
    type: string
    content: string
}
