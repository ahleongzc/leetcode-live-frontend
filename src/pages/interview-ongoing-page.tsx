import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ONGOING_PAGE_HEIGHT, ONGOING_PAGE_WIDTH } from "@/types";
import RecordingIndicator from "@/components/recording-indicator";
import BlurText from "@/components/blur-text";

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

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100 p-6">
            <div className="flex flex-row">
                <RecordingIndicator size={24} />
                <BlurText
                    text="Interview is ongoing..."
                    delay={150}
                    animateBy="words"
                    direction="top"
                    className="text-xl font-semibold"
                />
            </div>
            <div
                className="mt-2"
            >
                <a className="text-gray-400">
                    You can close the extension now, good luck!
                </a>
            </div>
        </div>
    )
}
