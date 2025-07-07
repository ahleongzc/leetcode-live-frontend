import { sendChromeMessage } from "@/common"
import type { Interview } from "@/types";
import type { Message } from "../types"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query";
import { storage } from "@/storage";
import interviewAPIs from "@/api/interview-api";

export default function HomePage() {
    const navigate = useNavigate();

    const {
        data: interview = null,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["ongoingInterview"],
        queryFn: async (): Promise<Interview> => {
            const sessionToken = await storage.getSessionToken()
            const responseBody = await interviewAPIs.ongoingInterviewData(sessionToken)
            return responseBody.interview
        },
        refetchOnMount: true,
        retry: 3
    })

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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full">
                <div>Loading...</div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="text-red-500 text-center">
                    Error loading interview status: {error?.message || "Something went wrong"}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <Button
                type="submit"
                className="bg-white w-full max-w-sm mx-auto transform transition-transform duration-200 active:scale-95 hover:bg-gray-200"
                onClick={handleDebug}
            >
                DEBUG
            </Button>

            {interview ? (
                // Show ongoing interview info and join button
                <div className="text-center space-y-2">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-800">Ongoing Interview</h3>
                        <p className="text-sm text-blue-600">{interview.question}</p>
                        <p className="text-xs text-blue-500">
                            Started: {new Date(interview.start_timestamp_s * 1000).toLocaleString()}
                        </p>
                    </div>
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full max-w-sm mx-auto transform transition-transform duration-200 active:scale-95"
                    >
                        Join Ongoing Interview
                    </Button>
                </div>
            ) : (
                <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white w-full max-w-sm mx-auto transform transition-transform duration-200 active:scale-95"
                    onClick={handleStartInterview}
                >
                    Start New Interview
                </Button>
            )}
        </div>
    )
}
