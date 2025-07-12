import type { Message, MessageReq } from "../types"
import WebSocketSingleton from "../websocket";

let recognition: null | SpeechRecognition = null

export declare const monaco: any;

function injectScript(filePath: string) {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL(filePath);
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
}

injectScript("inject.js");

let latestEditorCode = "";

window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data?.type === "RESPONSE_MONACO_CODE") {
        latestEditorCode = event.data.code;
    }
});

window.addEventListener('beforeunload', () => {
    chrome.runtime.sendMessage({ Type: "refreshDOM" });
});

function requestEditorCode() {
    window.postMessage({ type: "REQUEST_MONACO_CODE" }, "*");
}

chrome.runtime.onMessage.addListener((message: Message, _, sendResponse) => {
    switch (message.Type) {
        case "setUpInterviewDOM":
            console.log("set up successful")
            const meta = document.querySelector('meta[name="description"]');
            const description = meta?.getAttribute('content') || "";

            const ogTitleMeta = document.querySelector('meta[property="og:title"]');
            const questionID = ogTitleMeta?.getAttribute('content') || "";

            sendResponse({
                description: description,
                questionID: questionID
            })
            return true
        case "debug":
            console.log(message)
            return
        case "joinInterviewDOM":
            handleJoinInterview(message, sendResponse)
            return true
        default:
            break
    }
    return true
});

export const handleJoinInterview = async (message: Message, sendResponse: (response?: any) => void) => {
    const token = message.InterviewToken;
    if (!token) {
        sendResponse({ error: "No interview token provided" });
        return;
    }

    try {
        await WebSocketSingleton.getInstance().connect("ws://localhost:8000/v1/interview/join", {
            token: token,
        });

        const socket = WebSocketSingleton.getInstance().getSocket();
        if (!socket) {
            throw new Error("Failed to get WebSocket instance");
        }

        recognition = startSpeechRecognition(socket);
        if (recognition) {
            recognition.start();
            console.log("Speech recognition started");
            sendResponse({
                success: true,
                message: "Interview joined and speech recognition started"
            });
        } else {
            console.warn("Speech recognition not supported");
            sendResponse({
                error: "Speech recognition not supported in this browser"
            });
        }
    } catch (wsError) {
        sendResponse({
            error: wsError instanceof Error ? wsError.message : "WebSocket connection failed"
        });
    }
};

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
        requestEditorCode()
        const chunk = event.results[event.results.length - 1][0].transcript;

        if (socket && socket.readyState === WebSocket.OPEN) {
            const payload: MessageReq = {
                from: "client",
                chunk: chunk,
                code: latestEditorCode,
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