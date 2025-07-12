import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ONGOING_PAGE_HEIGHT, ONGOING_PAGE_WIDTH } from "@/types";
import RecordingIndicator from "@/components/recording-indicator";

export default function InterviewOngoingPage({ onResize }: { onResize: (width: number, height: number) => void }) {
    const navigate = useNavigate()

    useEffect(() => {
        if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
            const listener = (message: any) => {
                if (message.Type === "endInterview") {
                    setTimeout(() => {
                        navigate("/home");
                    }, 2000);
                }
            };

            chrome.runtime.onMessage.addListener(listener);
            return () => {
                chrome.runtime.onMessage.removeListener(listener);
            };
        }

        const resize = () => {
            onResize(ONGOING_PAGE_WIDTH, ONGOING_PAGE_HEIGHT)
        }
        resize()
    }, [navigate]);

    const handleClosePopup = () => {
        window.close();
    }

    return (
        <div className="flex flex-row items-center justify-center h-full w-full">
            <RecordingIndicator />
            <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleClosePopup}
            >
                Close
            </button>
        </div>
    )
}
