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
import { useEffect, useState } from "react"
import { toast } from "sonner"

import authAPIs from "@/api/auth-api"
import type { LoginRequest, LoginResponse } from "@/api/auth-api"
import type { Message } from "@/types"
import { sendChromeMessage } from "@/common"
import { useNavigate } from "react-router-dom"

export function LoginForm() {
    const navigate = useNavigate()

    const [email, setEmail] = useState<string>("zhecheng555@gmail.com")
    const [password, setPassword] = useState<string>("zhecheng555")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const req: LoginRequest = {
            email: email,
            password: password
        }

        try {
            const res: LoginResponse = await authAPIs.login(req)
            const message: Message = {
                Type: "storeSessionID",
                Content: res.sessionID
            }
            await sendChromeMessage(message)
            navigate("/dashboard")
        } catch (error: any) {
            toast("Login Failed", {
                description: error.response?.data?.error || "Something went wrong, please try again",
                action: {
                    label: "OK",
                    onClick: () => { },
                },
            })
            return
        }
    }

    useEffect(() => {
        const checkSession = async () => {
            const message: Message = { Type: "getSessionID" };
            try {
                const response = await sendChromeMessage(message);
                const sessionID = response?.sessionID;
                if (sessionID == "") {
                    return;
                }
                try {
                    await authAPIs.authStatus(sessionID);
                    navigate("/dashboard")
                } catch (error: any) {
                    toast("Session Expired", {
                        description: error.response?.data?.error || "Something went wrong, please try again",
                        action: {
                            label: "OK",
                            onClick: () => { },
                        },
                    });
                }
            } catch (error: any) {
                toast("Session Expired", {
                    description: error.response?.data?.error || "Something went wrong, please try again",
                    action: {
                        label: "OK",
                        onClick: () => { },
                    },
                });
            }
        };

        checkSession()
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