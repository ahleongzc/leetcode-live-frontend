import interviewAPIs from "@/api/interview-api";
import type { Interview } from "@/types";
import { storage } from "@/utils/storage";
import { useQuery } from "@tanstack/react-query";

export const GetLatestFinishedInterview = () => {
    return useQuery({
        queryKey: ["interviewHistory", "latest"],
        queryFn: async (): Promise<Interview | undefined> => {
            const sessionToken = await storage.getSessionToken();
            const response = await interviewAPIs.interviewHistoryData(0, 0, sessionToken);
            return response.data?.interviews[0] ?? null;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });
};

