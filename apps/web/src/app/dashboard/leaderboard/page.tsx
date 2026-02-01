"use client";

import { motion } from "framer-motion";
import { Trophy, Search, ChevronLeft, ChevronRight, Loader2, Medal, Crown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:4000/api";

type User = {
    id: string;
    username: string;
    name: string | null;
    avatar: string | null;
    xp: number;
    level: number;
    streak: number;
};

type Meta = {
    total: number;
    page: number;
    lastPage: number;
};

export default function LeaderboardPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
            });
            if (search) params.append("search", search);

            const res = await fetch(`${API_URL}/users/leaderboard?${params}`);
            if (!res.ok) throw new Error("Failed to fetch leaderboard");

            const data = await res.json();
            setUsers(data.data);
            setMeta(data.meta);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLeaderboard();
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [fetchLeaderboard]);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                        <span className="text-git-neon">GLOBAL</span> LEADERBOARD
                    </h1>
                    <p className="text-gray-400">Top contributors pushing code and breaking limits.</p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search hackers..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // Reset to first page on search
                        }}
                        className="w-full bg-gray-900/50 border border-hacker-border rounded-lg pl-10 pr-4 py-2 text-white focus:border-git-neon outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Leaderboard Table */}
            <div className="bg-[#0d1117] border border-hacker-border rounded-xl overflow-hidden shadow-2xl shadow-black/50">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 text-xs font-mono text-gray-500 uppercase tracking-wider">
                    <div className="col-span-1 text-center">Rank</div>
                    <div className="col-span-5 md:col-span-4">User</div>
                    <div className="col-span-2 text-center hidden md:block">Level</div>
                    <div className="col-span-2 text-center hidden md:block">Streak</div>
                    <div className="col-span-4 md:col-span-3 text-right">XP</div>
                </div>

                <div className="divide-y divide-gray-800/50">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-git-neon animate-spin" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No hackers found matching your search.
                        </div>
                    ) : (
                        users.map((user, index) => {
                            const rank = (page - 1) * 10 + index + 1;
                            return (
                                <LeaderboardRow
                                    key={user.id}
                                    user={user}
                                    rank={rank}
                                />
                            );
                        })
                    )}
                </div>
            </div>

            {/* Pagination */}
            {meta && meta.lastPage > 1 && (
                <div className="flex justify-center items-center gap-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-mono text-gray-400">
                        Page <span className="text-white">{page}</span> of {meta.lastPage}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(meta.lastPage, p + 1))}
                        disabled={page === meta.lastPage}
                        className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}

function LeaderboardRow({ user, rank }: { user: User; rank: number }) {
    const isTop3 = rank <= 3;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors ${rank === 1 ? 'bg-yellow-400/5' :
                    rank === 2 ? 'bg-gray-400/5' :
                        rank === 3 ? 'bg-orange-700/5' : ''
                }`}
        >
            {/* Rank */}
            <div className="col-span-1 flex justify-center">
                {rank === 1 ? (
                    <Crown className="w-6 h-6 text-yellow-400" />
                ) : rank === 2 ? (
                    <Medal className="w-6 h-6 text-gray-300" />
                ) : rank === 3 ? (
                    <Medal className="w-6 h-6 text-orange-400" />
                ) : (
                    <span className="font-mono text-gray-500 font-bold">#{rank}</span>
                )}
            </div>

            {/* User */}
            <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                <div className="relative">
                    <img
                        src={user.avatar || `https://github.com/${user.username}.png`}
                        alt={user.username}
                        className={`w-10 h-10 rounded-full border-2 ${rank === 1 ? 'border-yellow-400' :
                                rank === 2 ? 'border-gray-300' :
                                    rank === 3 ? 'border-orange-400' :
                                        'border-gray-700'
                            }`}
                    />
                    {isTop3 && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center text-[10px]">
                            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                        </div>
                    )}
                </div>
                <div className="overflow-hidden">
                    <div className="font-bold text-white truncate">{user.name || user.username}</div>
                    <div className="text-xs text-gray-400 font-mono text-git-neon">@{user.username}</div>
                </div>
            </div>

            {/* Level */}
            <div className="col-span-2 hidden md:flex justify-center">
                <div className="bg-gray-800 px-2 py-1 rounded text-xs font-mono text-gray-300">
                    LVL {user.level}
                </div>
            </div>

            {/* Streak */}
            <div className="col-span-2 hidden md:flex justify-center items-center gap-1 text-orange-500 font-mono text-sm">
                <span>🔥</span>
                <span>{user.streak}</span>
            </div>

            {/* XP */}
            <div className="col-span-4 md:col-span-3 text-right">
                <span className="font-bold text-git-neon text-lg font-mono">
                    {user.xp.toLocaleString()} XP
                </span>
            </div>
        </motion.div>
    );
}
