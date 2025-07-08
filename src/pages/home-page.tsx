import type { Interview } from "@/types";
import type { Message } from "../types"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "@/storage";
import interviewAPIs from "@/api/interview-api";
import { INTERVIEW_TOKEN_HEADER } from "@/types";


export default function HomePage() {

    const queryClient = useQueryClient();

    const {
        data: interview = null,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["unfinishedInterview"],
        queryFn: async (): Promise<Interview> => {
            const sessionToken = await storage.getSessionToken()
            const responseBody = await interviewAPIs.unfinishedInterviewData(sessionToken)
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

    const abandonUnfinishedInterviewMutation = useMutation({
        mutationFn: async () => {
            const sessionToken = await storage.getSessionToken()
            await interviewAPIs.abandonUnfinishedInterview(sessionToken)
        },
        onSuccess: () => {
            toast("Interview abandoned", {
                description: "You have abandoned the interview",
            });
            queryClient.invalidateQueries({ queryKey: ["unfinishedInterview"] });
        },
        onError: (error: any) => {
            toast("Failed to abandon interview", {
                description: error.response?.data?.error || "Something went wrong, please try again",
                action: {
                    label: "OK",
                    onClick: () => { },
                },
            })
        }
    });

    const startInterviewMutation = useMutation({
        mutationFn: async () => {
            const pageData: any = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({
                    Type: "setUpInterview"
                }, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else if (response?.error) {
                        reject(new Error(response.error));
                    } else {
                        resolve(response);
                    }
                });
            });

            const sessionToken = await storage.getSessionToken();
            const reqBody = {
                question_id: pageData.questionID,
                description: pageData.description
            };

            const resp = await interviewAPIs.setUpNewInterview(reqBody, sessionToken);

            await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({
                    Type: "joinInterview",
                    InterviewToken: resp.headers[INTERVIEW_TOKEN_HEADER]
                }, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else if (response?.error) {
                        reject(new Error(response.error));
                    } else {
                        resolve(response);
                    }
                });
            })
        },
        onSuccess: () => {
            toast("Interview Started", {
                description: "Your interview has been set up successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["unfinishedInterview"] });
        },
        onError: (error: any) => {
            toast("Failed to Start Interview", {
                description: error.message || "Something went wrong, please try again",
                action: {
                    label: "OK",
                    onClick: () => { },
                },
            })
        }
    });

    const handleStartInterview = async (e: React.FormEvent) => {
        e.preventDefault()
        startInterviewMutation.mutate()
    }

    const handleAbandonInterview = async (e: React.FormEvent) => {
        e.preventDefault()
        abandonUnfinishedInterviewMutation.mutate()
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
                        <h3 className="font-semibold text-blue-800">Unfinished Interview</h3>
                        <p className="text-sm text-blue-600">{interview.question}</p>
                        <p className="text-xs text-blue-500">
                            Started: {new Date(interview.start_timestamp_s * 1000).toLocaleString()}
                        </p>
                    </div>
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full max-w-sm mx-auto transform transition-transform duration-200 active:scale-95"
                    >
                        Join
                    </Button>
                    <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white w-full max-w-sm mx-auto transform transition-transform duration-200 active:scale-95"
                        onClick={handleAbandonInterview}
                    >
                        Abandon
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
