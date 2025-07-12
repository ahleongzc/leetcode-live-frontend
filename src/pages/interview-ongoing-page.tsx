import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ONGOING_PAGE_HEIGHT, ONGOING_PAGE_WIDTH } from "@/types";
import RecordingIndicator from "@/components/recording-indicator";

export default function InterviewOngoingPage({ onResize }: { onResize: (width: number, height: number) => void }) {
    const navigate = useNavigate()

    useEffect(() => {
        const resize = () => {
            onResize(ONGOING_PAGE_WIDTH, ONGOING_PAGE_HEIGHT)
        }

        resize()

        const listener = (message: any) => {
            if (message.Type === "endInterview") {
                setTimeout(() => {
                    navigate("/home");
                }, 2000);
            }
        };

        if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener(listener);
        }

        return () => {
            if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
                chrome.runtime.onMessage.removeListener(listener);
            }
        }
    }, []);

    const handleClosePopup = () => {
        window.close();
    }

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100 p-6">
            <RecordingIndicator />
            <div className="mt-6 space-y-4">
                <button
                    className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
                    onClick={handleClosePopup}
                >
                    Close Popup
                </button>
                <button
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                    onClick={() => { }}
                >
                    View Response
                </button>
            </div>
        </div>
    )
}
