import type { Message, MessageReq } from "../types"
import WebSocketSingleton from "../websocket";

let recognition: null | SpeechRecognition = null

chrome.runtime.onMessage.addListener(
    async (message: Message) => {
        switch (message.Command) {
            case "startSession":
                WebSocketSingleton.getInstance().connect("ws://localhost:8080/v1/start-interview", {
                    "question_id": "12312312",
                    "session_id": "MjrXR0ZMIC_M1whAzQrwTC2ZoysWYyJIMZnQl0YijEc",
                })
                const socket = WebSocketSingleton.getInstance().getSocket()
                recognition = startSpeechRecognition(socket)
                if (recognition) {
                    recognition.start()
                }
                break
            case "endSession":
                WebSocketSingleton.getInstance().closeSocket()
                if (recognition) {
                    recognition.stop()
                    recognition = null
                }
                break
            case "debug":
                console.log(message)
                break
        }
    }
);



// Start speech recognition and stream to WebSocket
const startSpeechRecognition = (socket: WebSocket | null): SpeechRecognition | null => {
    const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn("SpeechRecognition API not supported");
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        if (socket && socket.readyState === WebSocket.OPEN) {
            const payload: MessageReq = {
                type: "transcript",
                content: transcript
            }
            socket.send(JSON.stringify(payload));
            console.log(JSON.stringify(payload))
        } else {
            console.warn("WebSocket not connected")
        }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
    };

    return recognition
};