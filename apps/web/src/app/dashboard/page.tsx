"use client";

import { motion } from "framer-motion";
import {
    Activity,
    Flame,
    Trophy,
    GitCommit,
    GitPullRequest,
    GitMerge,
    Target,
    Calendar
} from "lucide-react";

export default function Dashboard() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <span className="text-git-neon">GYM</span> FLOOR
                    </h1>
                    <p className="text-gray-400">Welcome back, GitRat_Tester. Time to push some commits.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-hacker-border rounded-lg">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-git-neon opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-git-neon"></span>
                    </span>
                    <span className="text-xs font-mono text-git-neon">STREAK ACTIVE</span>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Current Streak"
                    value="12 Days"
                    icon={<Flame className="w-5 h-5 text-orange-500" />}
                    subtext="Personal Best: 15"
                    color="orange"
                />
                <StatCard
                    label="Total XP"
                    value="15,420"
                    icon={<Trophy className="w-5 h-5 text-yellow-400" />}
                    subtext="Level 12 (Script Kiddie)"
                    color="yellow"
                />
                <StatCard
                    label="Total Reps"
                    value="482"
                    icon={<GitCommit className="w-5 h-5 text-git-neon" />}
                    subtext="+24 today"
                    color="neon"
                />
                <StatCard
                    label="Contribution Rate"
                    value="Top 5%"
                    icon={<Activity className="w-5 h-5 text-blue-400" />}
                    subtext="Global Leaderboard"
                    color="blue"
                />
            </div>

            {/* Heatmap Section (Mock) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-900/50 border border-hacker-border rounded-xl p-6 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Calendar className="w-24 h-24 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    Workout History
                </h3>

                {/* Mock Heatmap Grid */}
                <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 53 * 7 }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-3 h-3 rounded-sm ${Math.random() > 0.8 ? 'bg-git-neon' :
                                    Math.random() > 0.6 ? 'bg-git-green' :
                                        Math.random() > 0.4 ? 'bg-green-900' : 'bg-gray-800'
                                }`}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Recent Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                    <div className="space-y-4">
                        <ActivityItem
                            type="push"
                            title="Pushed 3 commits to gitrats/web"
                            xp="+30 XP"
                            time="2 hours ago"
                        />
                        <ActivityItem
                            type="pr"
                            title="Opened PR: Feat/Dashboard-UI"
                            xp="+50 XP"
                            time="4 hours ago"
                        />
                        <ActivityItem
                            type="merge"
                            title="Merged PR: Fix/Auth-Flow"
                            xp="+100 XP"
                            time="Yesterday"
                        />
                    </div>
                </div>

                {/* Daily Goals / Quests */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Daily Quests</h3>
                    <div className="bg-gray-900/50 border border-hacker-border rounded-xl p-4 space-y-4">
                        <QuestItem title="Push 1 Commit" progress={100} complete />
                        <QuestItem title="Review 1 PR" progress={0} />
                        <QuestItem title="Earn 100 XP" progress={60} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, subtext, color }: any) {
    const colorClasses: any = {
        orange: "border-orange-500/20 hover:border-orange-500/50 bg-orange-500/5",
        yellow: "border-yellow-400/20 hover:border-yellow-400/50 bg-yellow-400/5",
        neon: "border-git-neon/20 hover:border-git-neon/50 bg-git-neon/5",
        blue: "border-blue-400/20 hover:border-blue-400/50 bg-blue-400/5"
    };

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`p-4 rounded-xl border transition-all ${colorClasses[color] || colorClasses.neon}`}
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-gray-400 text-sm font-mono">{label}</span>
                {icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-gray-500">{subtext}</div>
        </motion.div>
    );
}

function ActivityItem({ type, title, xp, time }: any) {
    const icons: any = {
        push: <GitCommit className="w-4 h-4 text-blue-400" />,
        pr: <GitPullRequest className="w-4 h-4 text-purple-400" />,
        merge: <GitMerge className="w-4 h-4 text-git-neon" />
    };

    return (
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900/30 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-gray-800">
                    {icons[type]}
                </div>
                <div>
                    <div className="text-sm font-medium text-gray-200">{title}</div>
                    <div className="text-xs text-gray-500">{time}</div>
                </div>
            </div>
            <div className="text-sm font-bold text-git-neon font-mono">{xp}</div>
        </div>
    );
}

function QuestItem({ title, progress, complete }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className={`${complete ? 'text-gray-400 line-through' : 'text-gray-200'}`}>{title}</span>
                <span className="text-git-neon">{complete ? 'DONE' : `${progress}%`}</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-git-neon transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
