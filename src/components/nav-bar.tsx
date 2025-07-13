import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu"

export function Navbar({ width }: { width: number }) {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-white" style={{ width: `${width}px` }}>
            <NavigationMenu className="flex w-full bg-white h-10">
                <NavigationMenuLink
                    className="cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                </NavigationMenuLink>
            </NavigationMenu>
        </div>
    );
}