import authAPIs from "@/api/auth-api"
import {
    useMutation,
} from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { storage } from "@/utils/storage"
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { SESSION_TOKEN_HEADER, LOCAL_STORAGE_SESSION_TOKEN_KEY } from "@/types"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"
import { DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT } from '@/types'

export default function LoginPage({ onResize }: { onResize: (width: number, height: number) => void }) {
    const navigate = useNavigate()

    const [email, setEmail] = useState<string>("123@gmail.com")
    const [password, setPassword] = useState<string>("123456789")

    const loginMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            return await authAPIs.login(email, password)
        },
        onSuccess: async (res) => {
            const sessionToken = res.headers[SESSION_TOKEN_HEADER]
            await storage.set(LOCAL_STORAGE_SESSION_TOKEN_KEY, sessionToken)
            navigate("/home")
        }, onError: (error: any) => {
            toast("Login Failed", {
                description: error.response?.data?.error || "Something went wrong, please try again",
                action: {
                    label: "OK",
                    onClick: () => { },
                },
            })
        }
    })

    useEffect(() => {
        const resize = () => {
            onResize(DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT)
        }
        resize()
    }, [])


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        loginMutation.mutate({ email, password })
    }

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <CardHeader className="w-full space-y-4">
                <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent className="w-full">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loginMutation.isPending}
                    />
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loginMutation.isPending}
                    />
                    <Button
                        type="submit"
                        className="bg-white w-full max-w-sm mx-auto transform transition-transform duration-200 active:scale-95 hover:bg-gray-200"
                        onClick={handleSubmit}
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </CardContent>
        </div>
    )
}
