import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
    }, [navigate]);

    const handleClosePopup = () => {
        window.close();
    }

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div>ongoing broo</div>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
                onClick={() => onResize(200, 300)}
            >
                Resize to 800x600
            </button>
            <button
                className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
                onClick={handleClosePopup}
            >
                Close 
            </button>
        </div>
    )
}
