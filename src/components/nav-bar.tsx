import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"

export function Navbar() {
    const navigate = useNavigate();
    return (
        <NavigationMenu>
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
            </NavigationMenuList>
        </NavigationMenu>
    );
}