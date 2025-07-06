import { sendChromeMessage } from "@/common"
import type { Message } from "../types"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

export default function HomePage() {
    const navigate = useNavigate();

    const handleDebug = (e: React.FormEvent) => {
        e.preventDefault()
        const debug: Message = {
            Type: "debug"
        }

        chrome.runtime.sendMessage(debug)
    }

    const handleStartInterview = async (e: React.FormEvent) => {
        e.preventDefault()
        const message: Message = {
            Type: "setUpInterview"
        }
        try {
            const response = await sendChromeMessage(message)
            if (response?.unauthorized) {
                navigate("/login");
                return;
            }

            if (response.error) {
                toast("Interview Setup Failed", {
                    description: response.error,
                    action: {
                        label: "OK",
                        onClick: () => { },
                    },
                });
            }
        } catch (error: any) {
            toast("Internal Server Error", {
                description: error.error || "Something went wrong, please try again",
                action: {
                    label: "OK",
                    onClick: () => { },
                },
            })
        }
    }

    const handleGoToHistory = () => {
        navigate("/history"); // Navigate to the history page
    };


    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <Button
                type="submit"
                className="bg-white w-full max-w-sm mx-auto transform transition-transform duration-200 active:scale-95 hover:bg-gray-200"
                onClick={handleDebug}
            >
                DEBUG
            </Button>
            <Button
                type="submit"
                className="bg-white w-full max-w-sm mx-auto transform transition-transform duration-200 active:scale-95 hover:bg-gray-200"
                onClick={handleStartInterview}
            >
                Start Interview
            </Button>
            <Button
                type="button"
                className="bg-blue-500 text-white w-full max-w-sm mx-auto transform transition-transform duration-200 active:scale-95 hover:bg-blue-600"
                onClick={handleGoToHistory}
            >
                Go to History
            </Button>
        </div>
    )
}
