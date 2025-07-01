import type { SetUpInterviewRequestBody } from "@/api/interview-api";
import type { Message, MessageReq } from "../types"
import WebSocketSingleton from "../websocket";

let recognition: null | SpeechRecognition = null

chrome.runtime.onMessage.addListener((message: Message) => {
    (async () => {
        switch (message.Type) {
            case "setUpInterviewDOM":
                const meta = document.querySelector('meta[name="description"]');
                const description = meta?.getAttribute('content') || "";

                const ogTitleMeta = document.querySelector('meta[property="og:title"]');
                const questionID = ogTitleMeta?.getAttribute('content') || "";
                

                const req: SetUpInterviewRequestBody = {
                    description: description,
                    question_id: questionID,
                }

                if (!message.SessionID) {
                    return
                }

                fetch("http://localhost:8000/v1/interview/set-up", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Session-ID": message.SessionID // or use your sessionIDHeader constant
                    },
                    body: JSON.stringify(req)
                })
                    .then(response => response.json())
                    .then(data => {
                        WebSocketSingleton.getInstance().connect("ws://localhost:8000/v1/interview/join", {
                            token: data.token
                        })
                        const socket = WebSocketSingleton.getInstance().getSocket()
                        recognition = startSpeechRecognition(socket)
                        if (recognition) {
                            recognition.start()
                        }
                    })


                console.log(req)
                break
            case "debug":
                console.log(message)
                break
            default:
                break
        }
    })()

    return true
});


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