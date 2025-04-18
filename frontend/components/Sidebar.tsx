"use client";

import { Home, CheckCircle2, User, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen border-r bg-white dark:bg-zinc-900 flex flex-col justify-between">
            <div>
                <div className="px-6 py-4 border-b">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        Taskify
                    </h1>
                </div>
                <nav className="flex flex-col gap-1 p-4">
                    <SidebarLink
                        icon={<Home className="w-4 h-4" />}
                        text="Dashboard"
                        href="/dashboard"
                    />
                    <SidebarLink
                        icon={<CheckCircle2 className="w-4 h-4" />}
                        text="My Tasks"
                        href="/dashboard"
                    />
                    <SidebarLink
                        icon={<User className="w-4 h-4" />}
                        text="Profile"
                        href="/profile"
                    />
                </nav>
            </div>
            <div className="p-4 border-t">
                <SidebarLink
                    icon={<LogOut className="w-4 h-4" />}
                    text="Logout"
                    href="/logout"
                />
            </div>
        </aside>
    );
}

function SidebarLink({
    icon,
    text,
    href,
}: {
    icon: React.ReactNode;
    text: string;
    href: string;
}) {
    return (
        <Link
            href={href}
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

// ✅ SidebarTrigger bileşeni
export function SidebarTrigger() {
    return (
        <button className="block md:hidden p-2 text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
        </button>
    );
}
