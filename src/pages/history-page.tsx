import interviewAPIs from "@/api/interview-api";
import { HISTORY_PAGE_HEIGHT, HISTORY_PAGE_WIDTH, type Interview } from "@/types";
import { InterviewCard } from "@/components/interview-card"
import { useQuery } from "@tanstack/react-query"
import { storage } from "@/utils/storage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";

export default function HistoryPage({ onResize }: { onResize: (width: number, height: number) => void }) {
    useEffect(() => {
        const resize = () => {
            onResize(HISTORY_PAGE_WIDTH, HISTORY_PAGE_HEIGHT)
        }
        resize()
    }, [])

    const {
        data: interviewHistory = [],
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["interviewHistory", "all"],
        queryFn: async (): Promise<Interview[]> => {
            const sessionToken = await storage.getSessionToken()
            const responseBody = await interviewAPIs.interviewHistoryData(0, 0, sessionToken);
            return responseBody.data.interviews;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        retry: 3
    })

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div>Loading interview history...</div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-red-500">
                    Error loading history: {error?.message || "Something went wrong"}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full overflow-y-">
            <ScrollArea className="h-full">
                <div className="p-4">
                    {interviewHistory.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            No interview history found
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {interviewHistory.map((interview: Interview, index: number) => (
                                <InterviewCard key={interview.id} interview={interview} index={index + 1} />
                            ))}
                        </ul>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
