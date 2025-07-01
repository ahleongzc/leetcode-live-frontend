import { sendChromeMessage } from "@/common"
import type { Message } from "../types"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function DashboardPage() {
    const [err, setErr] = useState("")
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
            await sendChromeMessage(message)
        } catch (error: any) {
            setErr(JSON.stringify(error))
        }
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
            <a className="text-2xl">
                {err}
            </a>
            <Button
                type="submit"
                className="bg-white w-full max-w-sm mx-auto transform transition-transform duration-200 active:scale-95 hover:bg-gray-200"
                onClick={handleStartInterview}
            >
                Start Interview
            </Button>
        </div>
    )
}
