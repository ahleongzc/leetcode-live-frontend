export type Command = "startSession" | "endSession" | "playAudio" | "login" | "logout" | "isLoggedIn" | "debug"

export interface Message {
    Command: Command
    Message?: string
}

export interface MessageReq {
    type: string
    content: string
}
