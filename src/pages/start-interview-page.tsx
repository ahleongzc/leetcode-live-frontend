import type { Message } from "../types"
import { Button } from "@/components/ui/button"

export default function StartInterviewPage() {

    const handleDebug = (e: React.FormEvent) => {
        e.preventDefault()
        const debug: Message = {
            Type: "debug"
        }

        chrome.runtime.sendMessage(debug)
    }

    return (
        <div className="flex items-center justify-center h-full w-full">
            <Button
                type="submit"
                className="bg-white w-full max-w-sm mx-auto transform transition-transform duration-200 active:scale-95 hover:bg-gray-200"
                onClick={handleDebug}
            >
                DEBUG
            </Button>
        </div>
    )
}
