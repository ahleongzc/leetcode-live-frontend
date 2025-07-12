import { useEffect } from "react";
import { DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT } from "@/types";
import BlurText from "@/components/blur-text";

export default function ErrorPage({ onResize }: { onResize: (width: number, height: number) => void }) {
    useEffect(() => {
        const resize = () => {
            onResize(DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT)
        }
        resize()
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100 p-6">
            <BlurText
                text="We're currently experiencing technical difficulties, please try again later."
                delay={150}
                animateBy="words"
                direction="top"
                className="text-3xl font-bold"
            />
        </div>
    )
}