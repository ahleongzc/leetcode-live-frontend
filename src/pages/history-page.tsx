import { useEffect, useState } from "react"
import interviewAPIs from "@/api/interview-api";
import type { Interview } from "@/types";
import { InterviewCard } from "@/components/interview-card"

export default function HistoryPage() {
    const [interviewHistory, setInterviewHistory] = useState([]);

    useEffect(() => {
        const fetchInterviewHistory = async () => {
            const sessionToken = "KzBdVTAgcECmznosDBG6RI04C3qXkScNYuUxq_cHLyM";
            try {
                const responseBody = await interviewAPIs.interviewHistoryData(0, 0, sessionToken);
                setInterviewHistory(responseBody.data.interviews); // Assuming `data.interviews` contains the array
            } catch (err: any) {
                console.error(err)
            }
        };

        fetchInterviewHistory();
    }, []);

    return (
        <div className="w-full h-full overflow-y-auto">
            <ul className="">
                {interviewHistory.map((interview: Interview, index: number) => (
                    <InterviewCard key={interview.id} interview={interview} index={index + 1} />
                ))}
            </ul>
        </div>
    )
}
