import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import type { Interview } from "@/types";
import { CheckCircle, XCircle } from "lucide-react";

export function InterviewCard({ interview, index }: { interview: Interview; index: number }) {
    const isInProgress =
        interview.score === null ||
        interview.passed === null ||
        interview.feedback === null ||
        interview.end_timestamp_s === null;

    return (
        <Card className="w-full border border-gray-300 shadow-md">
            <CardHeader>
                <CardTitle className="w-full text-lg font-bold">
                    {index}. {interview.question}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                    {isInProgress ? "Status: In Progress" : "Status: Completed"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                    {interview.passed ? (
                        <CheckCircle className="text-green-500 w-5 h-5" />
                    ) : interview.passed === false ? (
                        <XCircle className="text-red-500 w-5 h-5" />
                    ) : (
                        <span className="text-yellow-500">In Progress</span>
                    )}
                    <span>
                        <strong>Score:</strong> {interview.score ?? "In Progress"}
                    </span>
                </div>
                <p>
                    <strong>Feedback:</strong>{" "}
                    {interview.feedback ?? "No feedback provided (In Progress)"}
                </p>
                <p>
                    <strong>Start Time:</strong>{" "}
                    {new Date(interview.start_timestamp_s * 1000).toLocaleString()}
                </p>
                <p>
                    <strong>End Time:</strong>{" "}
                    {interview.end_timestamp_s
                        ? new Date(interview.end_timestamp_s * 1000).toLocaleString()
                        : "In Progress"}
                </p>
            </CardContent>
        </Card>
    );
}