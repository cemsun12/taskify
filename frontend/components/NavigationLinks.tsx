import { Home, CheckCircle2, User, LogOut } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NavigationLinks({ onClick }: { onClick?: () => void }) {
    return (
        <>
            <NavLink
                href="/dashboard"
                icon={<Home className="w-4 h-4" />}
                text="Dashboard"
                onClick={onClick}
            />
            <NavLink
                href="/dashboard"
                icon={<CheckCircle2 className="w-4 h-4" />}
                text="My Tasks"
                onClick={onClick}
            />
            <NavLink
                href="/profile"
                icon={<User className="w-4 h-4" />}
                text="Profile"
                onClick={onClick}
            />
            <NavLink
                href="/logout"
                icon={<LogOut className="w-4 h-4" />}
                text="Logout"
                onClick={onClick}
            />
        </>
    );
}

function NavLink({
    href,
    icon,
    text,
    onClick,
}: {
    href: string;
    icon: React.ReactNode;
    text: string;
    onClick?: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-muted transition-colors",
                "text-muted-foreground hover:text-foreground"
            )}
        >
            {icon}
            <span>{text}</span>
        </Link>
    );
}
