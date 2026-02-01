"use client";

import { Terminal, LayoutDashboard, Trophy, User, LogOut, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background font-sans flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-hacker-border bg-gray-900/30 hidden md:flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-2 font-mono text-xl font-bold text-white tracking-tighter mb-8">
                        <Terminal className="text-git-neon w-6 h-6" />
                        <span>GIT<span className="text-git-neon">RATS</span>_</span>
                    </div>

                    <nav className="space-y-2">
                        <NavItem href="/dashboard" icon={<LayoutDashboard />} label="Gym Floor" />
                        <NavItem href="/dashboard/squads" icon={<Users />} label="Squads" />
                        <NavItem href="/dashboard/leaderboard" icon={<Trophy />} label="Leaderboard" />
                        <NavItem href="/profile" icon={<User />} label="My Profile" />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-hacker-border">
                    <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header (visible only on small screens) */}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

function NavItem({ href, icon, label }: any) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                ? 'bg-git-neon/10 text-git-neon border border-git-neon/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            <div className="w-5 h-5">{icon}</div>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
