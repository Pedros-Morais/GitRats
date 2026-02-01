"use client";

import { motion } from "framer-motion";
import { Users, Trophy, Flame, ChevronLeft, Crown, Medal, User as UserIcon, Loader2, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = "http://localhost:4000/api";

type SquadMember = {
    role: string;
    joinedAt: string;
    user: {
        id: string;
        username: string;
        name: string | null;
        avatar: string | null;
        xp: number;
        level: number;
        streak: number;
    };
};

type SquadDetails = {
    id: string;
    name: string;
    description: string;
    inviteCode: string;
    isPrivate: boolean;
    _count: { members: number };
    members: SquadMember[];
};

export default function SquadDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [squad, setSquad] = useState<SquadDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!params.id) return;

        const fetchSquad = async () => {
            try {
                const res = await fetch(`${API_URL}/squads/${params.id}`);
                if (!res.ok) throw new Error("Squad not found");
                const data = await res.json();
                setSquad(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSquad();
    }, [params.id]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="w-8 h-8 text-git-neon animate-spin" />
        </div>
    );

    if (error || !squad) return (
        <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">{error || "Squad not found"}</h1>
            <Link href="/dashboard/squads" className="text-gray-400 hover:text-white underline">
                Return to Squads
            </Link>
        </div>
    );

    const orderedMembers = squad.members.sort((a, b) => b.user.xp - a.user.xp);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
            {/* Header / Nav */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg bg-gray-900 border border-hacker-border text-gray-400 hover:text-white hover:border-gray-600 transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-xl font-bold text-white font-mono">
                            {squad.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                {squad.name}
                                {squad.isPrivate && <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded border border-gray-700">PRIVATE</span>}
                            </h1>
                            <p className="text-gray-400 text-sm flex items-center gap-4">
                                <span>{squad.description || "No description provided."}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Invite Code Widget */}
                <div className="bg-gray-900 border border-hacker-border rounded-lg px-4 py-2 hidden md:block">
                    <span className="text-xs text-gray-500 font-mono block mb-1">INVITE CODE</span>
                    <div className="flex items-center gap-2 font-mono text-git-neon font-bold">
                        {squad.inviteCode}
                        <button
                            onClick={() => navigator.clipboard.writeText(squad.inviteCode)}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-gray-900/40 border border-hacker-border flex flex-col items-center justify-center">
                    <Users className="w-8 h-8 text-blue-400 mb-2" />
                    <div className="text-3xl font-bold text-white">{squad._count.members}</div>
                    <div className="text-gray-500 text-sm font-mono">MEMBERS</div>
                </div>
                <div className="p-6 rounded-xl bg-gray-900/40 border border-hacker-border flex flex-col items-center justify-center">
                    <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
                    <div className="text-3xl font-bold text-white">
                        {squad.members.reduce((sum, m) => sum + m.user.xp, 0).toLocaleString()}
                    </div>
                    <div className="text-gray-500 text-sm font-mono">TOTAL SQUAD XP</div>
                </div>
                <div className="p-6 rounded-xl bg-gray-900/40 border border-hacker-border flex flex-col items-center justify-center">
                    <Flame className="w-8 h-8 text-orange-500 mb-2" />
                    <div className="text-3xl font-bold text-white">
                        {Math.max(...squad.members.map(m => m.user.streak))}
                    </div>
                    <div className="text-gray-500 text-sm font-mono">TOP STREAK</div>
                </div>
            </div>

            {/* Dedicated Leaderboard */}
            <div className="bg-[#0d1117] border border-hacker-border rounded-xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-git-neon" />
                        SQUAD LEADERBOARD
                    </h2>
                </div>

                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 text-xs font-mono text-gray-500 uppercase tracking-wider">
                    <div className="col-span-1 text-center">Rank</div>
                    <div className="col-span-5">Member</div>
                    <div className="col-span-2 text-center">Role</div>
                    <div className="col-span-2 text-center">Streak</div>
                    <div className="col-span-2 text-right">XP</div>
                </div>

                <div className="divide-y divide-gray-800/50">
                    {orderedMembers.map((member, index) => {
                        const rank = index + 1;
                        return (
                            <motion.div
                                key={member.user.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors ${rank === 1 ? 'bg-yellow-400/5' :
                                    rank === 2 ? 'bg-gray-400/5' :
                                        rank === 3 ? 'bg-orange-700/5' : ''
                                    }`}
                            >
                                {/* Rank */}
                                <div className="col-span-1 flex justify-center">
                                    {rank === 1 ? <Crown className="w-5 h-5 text-yellow-400" /> :
                                        rank === 2 ? <Medal className="w-5 h-5 text-gray-300" /> :
                                            rank === 3 ? <Medal className="w-5 h-5 text-orange-400" /> :
                                                <span className="font-mono text-gray-500 font-bold">#{rank}</span>}
                                </div>

                                {/* User */}
                                <div className="col-span-5 flex items-center gap-3">
                                    <img
                                        src={member.user.avatar || `https://github.com/${member.user.username}.png`}
                                        alt={member.user.username}
                                        className="w-10 h-10 rounded-full border border-gray-700"
                                    />
                                    <div>
                                        <div className="font-bold text-white text-sm">{member.user.name || member.user.username}</div>
                                        <div className="text-xs text-git-neon font-mono">@{member.user.username}</div>
                                    </div>
                                </div>

                                {/* Role */}
                                <div className="col-span-2 text-center">
                                    <span className={`text-[10px] px-2 py-1 rounded font-bold ${member.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-800 text-gray-400'
                                        }`}>
                                        {member.role}
                                    </span>
                                </div>

                                {/* Streak */}
                                <div className="col-span-2 text-center flex items-center justify-center gap-1 text-orange-500 font-mono text-sm">
                                    <Flame className="w-3 h-3" />
                                    {member.user.streak}
                                </div>

                                {/* XP */}
                                <div className="col-span-2 text-right">
                                    <span className="font-bold text-white font-mono">{member.user.xp.toLocaleString()}</span>
                                    <span className="text-xs text-gray-500 ml-1">XP</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
