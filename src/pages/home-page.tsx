import type { Interview } from "@/types";
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "@/utils/storage";
import { DEFAULT_PAGE_HEIGHT, DEFAULT_PAGE_WIDTH, INTERVIEW_TOKEN_HEADER } from "@/types";
import { messaging } from "@/utils/messaging";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { GetLatestFinishedInterview } from "@/hooks/interview";
import interviewAPIs from "@/api/interview-api";
import BlurText from "@/components/blur-text";
import SpotlightCard from "@/components/spotlight-card";


export default function HomePage(
    { onResize }: { onResize: (width: number, height: number) => void }
) {

    const {
        data: latestFinishedInterview = null,
        isLoading: isLatestFinishedInterviewLoading,
        isError: isLatestFinishedInterviewError,
        error: latestFinishedInterviewError
    } = GetLatestFinishedInterview();

    const navigate = useNavigate()
    const queryClient = useQueryClient();

    const {
        data: ongoingInterview = null,
        isLoading: isOngoingInterviewLoading,
        isError: isOngoingInterviewError,
        error: ongoingInterviewError,
    } = useQuery({
        queryKey: ["ongoingInterview"],
        queryFn: async () => {
            const sessionToken = await storage.getSessionToken();
            const responseBody = await interviewAPIs.ongoingInterviewData(sessionToken);
            return responseBody.data.interview
        },
        refetchOnMount: true,
        retry: 3,
    });

    const {
        data: unfinishedInterview = null,
        isLoading: isUnfinishedInterviewLoading,
        isError: isUnfinishedInterviewError,
        error: unfinishedInterviewError,
    } = useQuery({
        queryKey: ["unfinishedInterview"],
        queryFn: async (): Promise<Interview> => {
            const sessionToken = await storage.getSessionToken()
            const responseBody = await interviewAPIs.unfinishedInterviewData(sessionToken)
            return responseBody.data.interview
        },
        refetchOnMount: true,
        retry: 3
    })

    const abandonUnfinishedInterviewMutation = useMutation({
        mutationFn: async () => {
            const sessionToken = await storage.getSessionToken()
            await interviewAPIs.abandonUnfinishedInterview(sessionToken)
        },
        onSuccess: () => {
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
            const pageData: any = await messaging.sendMessage({ Type: "setUpInterview" })
            const sessionToken = await storage.getSessionToken();
            const reqBody = {
                question_id: pageData.questionID,
                description: pageData.description
            };

            const resp = await interviewAPIs.setUpNewInterview(reqBody, sessionToken);

            await messaging.sendMessage({
                Type: "joinInterview",
                InterviewToken: resp.headers[INTERVIEW_TOKEN_HEADER]
            })
        },
        onSuccess: () => {
            navigate("/ongoing")
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

    useEffect(() => {
        const resize = () => {
            onResize(DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT)
        }
        resize()
        if (ongoingInterview) {
            navigate("/ongoing")
        }

    }, [ongoingInterview, navigate])

    const handleStartInterview = async (e: React.FormEvent) => {
        e.preventDefault()
        startInterviewMutation.mutate()
    }

    const handleAbandonInterview = async (e: React.FormEvent) => {
        e.preventDefault()
        abandonUnfinishedInterviewMutation.mutate()
    }

    if (isOngoingInterviewLoading ||
        isUnfinishedInterviewLoading ||
        isLatestFinishedInterviewLoading
    ) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full">
                <div>Loading...</div>
            </div>
        )
    }

    if (isOngoingInterviewError
        || isUnfinishedInterviewError
        || isLatestFinishedInterviewError
    ) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="text-red-500 text-center">
                    Error loading interview status: {unfinishedInterviewError?.message || "Something went wrong"}
                    Error loading interview status: {ongoingInterviewError?.message || "Something went wrong"}
                    Error loading interview status: {latestFinishedInterviewError?.message || "Something went wrong"}
                </div>
            </div>
        )
    }
    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <BlurText
                text="Welcome back!"
                delay={150}
                animateBy="words"
                direction="top"
                className="absolute top-4 left-4 text-3xl font-bold"
            />

            {latestFinishedInterview ? (
                <SpotlightCard
                    className="custom-spotlight-card w-full" spotlightColor="rgba(0, 229, 255, 0.2)"
                >
                    <div className="flex flex-row justify-center w-full">
                        <div className="w-full">
                            <p className="font-bold text-sm">Last interview</p>
                            <p className="text-gray-400 text-sm">
                                {latestFinishedInterview.end_timestamp_s != null
                                    ? new Date(latestFinishedInterview.end_timestamp_s * 1000).toLocaleString()
                                    : "N/A"}
                            </p>
                        </div>
                        <div className="w-full">
                            <p className="text-sm text-600">{latestFinishedInterview.question}</p>
                            <p className="text-sm text-600">Your score: {latestFinishedInterview.score}</p>
                        </div>
                    </div>
                </SpotlightCard>
            ) : (<></>)}

            {unfinishedInterview ? (
                <div className="text-center space-y-2">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-800">Unfinished Interview</h3>
                        <p className="text-sm text-blue-600">{unfinishedInterview.question}</p>
                        <p className="text-xs text-blue-500">
                            Started: {new Date(unfinishedInterview.start_timestamp_s * 1000).toLocaleString()}
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
