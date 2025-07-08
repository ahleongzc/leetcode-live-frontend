import { type Message } from "@/types"

export function SendToServiceWorker<T = any>(message: Message): Promise<T> {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message))
            } else {
                resolve(response)
            }
        })
    })
}
