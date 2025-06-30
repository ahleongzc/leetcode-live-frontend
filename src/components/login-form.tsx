import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Message } from "../types"
import { useEffect, useState } from "react"
import { HTTP_STATUS } from "../types"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom";

export function LoginForm() {
    const navigate = useNavigate()

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const loginCredentials: Message = {
            Type: "login",
            email: email,
            password: password
        }

        chrome.runtime.sendMessage(loginCredentials, (response) => {
            if (response == HTTP_STATUS.UNAUTHORIZED) {
                toast("Login Failed", {
                    description: "Invalid credentials",
                    action: {
                        label: "OK",
                        onClick: () => { },
                    },
                })
                return
            }
            if (response == HTTP_STATUS.OK) {
                navigate("/start-interview")
            }
        })
    }

    useEffect(() => {
        chrome.runtime.sendMessage({ Type: "validate" }, (response) => {
            if (response === HTTP_STATUS.UNAUTHORIZED) {
                toast("Login Failed", {
                    description: "Invalid credentials",
                    action: {
                        label: "OK",
                        onClick: () => { },
                    },
                })
                return
            }

            if (response === HTTP_STATUS.OK) {
                navigate("/start-interview")
            }
        })
    }, [])

    return (
        <div className="w-full h-full">
            <Card className="w-full h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="text-white">Login to your account</CardTitle>
                    <CardDescription className="text-gray-500">
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center">
                    <form className="w-full max-w-sm">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label className="text-white" htmlFor="email">Email</Label>
                                <Input
                                    className="text-gray-500"
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label className="text-white" htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="text-gray-500"
                                    id="password"
                                    type="password"
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                        type="submit"
                        className="bg-white w-full max-w-sm mx-auto transform transition-transform duration-200 active:scale-95 hover:bg-gray-200"
                        onClick={handleSubmit}
                    >
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}