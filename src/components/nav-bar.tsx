import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { useMutation } from "@tanstack/react-query";
import { storage } from "@/utils/storage"
import authAPIs from "@/api/auth-api";
import { toast } from "sonner";

export function Navbar() {
    const navigate = useNavigate();

    const logoutMutation = useMutation({
        mutationFn: async () => {
            const sessionToken = await storage.getSessionToken()
            await authAPIs.logout(sessionToken);
            await storage.removeSessionToken();
        },
        onSuccess: async () => {
            toast("Logged out successfully", {
                description: "You have been logged out",
            });
        },
        onError: async (error: any) => {
            console.error("Logout error:", error);
        }
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <NavigationMenu className="flex w-full bg-white h-100px">
            <NavigationMenuList>
                <NavigationMenuLink
                    className="cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                </NavigationMenuLink>
                <NavigationMenuItem>
                    <Link to="/history">
                        <NavigationMenuLink>History</NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link to="/home">
                        <NavigationMenuLink>Home</NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        className="cursor-pointer text-red-600 hover:text-red-700 flex items-center"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}