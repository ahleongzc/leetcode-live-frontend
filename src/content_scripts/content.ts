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

                if (!message.SessionToken) {
                    return
                }

                const response = await fetch("http://localhost:8000/v1/interview/set-up", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Session-Token": message.SessionToken
                    },
                    body: JSON.stringify(req)
                })

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null)
                    const errorMessage = errorData?.error || `Server error: ${response.status}`
                    chrome.runtime.sendMessage({
                        Type: "errorDOM",
                        error: errorMessage
                    });
                    return;
                }

                const interviewToken = response.headers.get("X-Interview-Token");
                if (interviewToken == undefined) {
                    chrome.runtime.sendMessage({
                        Type: "errorDOM",
                        error: "please try again"
                    });
                    return
                }

                try {
                    WebSocketSingleton.getInstance().connect("ws://localhost:8000/v1/interview/join", {
                        token: interviewToken,
                    });

                    const socket = WebSocketSingleton.getInstance().getSocket();
                    if (!socket) {
                        throw new Error("Failed to get WebSocket instance");
                    }

                    // 7. Initialize speech recognition
                    recognition = startSpeechRecognition(socket);
                    if (recognition) {
                        recognition.start();
                        console.log("Speech recognition started");
                    } else {
                        console.warn("Speech recognition not supported");
                    }
                } catch (wsError) {
                    console.error("WebSocket setup failed:", wsError);
                }

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
        const chunk = event.results[event.results.length - 1][0].transcript;
        if (socket && socket.readyState === WebSocket.OPEN) {
            const payload: MessageReq = {
                from: "client",
                chunk: chunk
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