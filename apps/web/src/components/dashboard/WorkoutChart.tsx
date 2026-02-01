"use client";

import { motion } from "framer-motion";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";
import { format, parseISO } from "date-fns";

export default function WorkoutChart({ heatmap }: { heatmap: any }) {
    if (!heatmap || !heatmap.weeks) {
        return (
            <div className="h-64 flex items-center justify-center border border-dashed border-gray-800 rounded-xl text-gray-500">
                Loading workout history...
            </div>
        );
    }

    // Transform heatmap weeks data into a flat array for the area chart
    // We want the last 30 days for the detail view
    const flatData = heatmap.weeks
        .flat()
        .filter((d: any) => d && d.date) // Filter out padding
        .map((d: any) => ({
            date: d.date,
            count: d.contributionCount || 0,
            color: d.color
        }));

    // Take last 30 days
    const last30Days = flatData.slice(-30);

    // Calculate max for Y-axis domain
    const maxCount = Math.max(...last30Days.map((d: any) => d.count), 5);

    return (
        <div className="bg-[#0d1117] border border-hacker-border rounded-xl p-6 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-git-neon">WORKOUT</span> VOLUME
                    </h3>
                    <p className="text-gray-400 text-sm">Contribution intensity over the last 30 days</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-mono font-bold text-white">
                        {heatmap.totalContributions}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">Total Reps (YTD)</div>
                </div>
            </div>

            {/* Area Chart */}
            <div className="h-48 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={last30Days}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00ff9d" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#8b949e', fontSize: 10 }}
                            tickFormatter={(str) => format(parseISO(str), 'MMM dd')}
                            axisLine={false}
                            tickLine={false}
                            minTickGap={30}
                        />
                        <YAxis hide domain={[0, maxCount + 2]} />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#00ff9d', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#00ff9d"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCount)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Consistency Heatmap (Bottom) */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-gray-500 uppercase">Consistency (Last 6 Months)</span>
                    <div className="flex items-center gap-2 text-[10px] text-gray-600">
                        <span>Less</span>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-sm bg-[#161b22]" />
                            <div className="w-2 h-2 rounded-sm bg-[#0e4429]" />
                            <div className="w-2 h-2 rounded-sm bg-[#26a641]" />
                            <div className="w-2 h-2 rounded-sm bg-[#39d353]" />
                        </div>
                        <span>More</span>
                    </div>
                </div>

                {/* Scrollable Container */}
                <div className="overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex gap-1 min-w-max">
                        {heatmap.weeks.slice(-26).map((week: any[], i: number) => (
                            <div key={i} className="flex flex-col gap-1">
                                {week.map((day: any, j: number) => {
                                    if (!day) return <div key={j} className="w-2 h-2" />;
                                    // Calculate opacity/intensity based on count if color not provided
                                    const intensity = day.contributionCount > 0
                                        ? Math.min(day.contributionCount / 5, 1)
                                        : 0;

                                    return (
                                        <motion.div
                                            key={j}
                                            whileHover={{ scale: 1.5, zIndex: 10 }}
                                            className="w-2 h-2 rounded-[1px] cursor-pointer relative group"
                                            style={{
                                                backgroundColor: day.color || (intensity > 0 ? `rgba(0, 255, 157, ${0.2 + intensity * 0.8})` : '#161b22')
                                            }}
                                        >
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 text-white text-[10px] p-2 rounded whitespace-nowrap z-20 border border-gray-700 shadow-xl">
                                                <span className="font-bold text-git-neon">{day.contributionCount} reps</span> on {day.date}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 border border-hacker-border p-3 rounded-lg shadow-xl">
                <p className="text-gray-400 text-xs mb-1">{format(parseISO(label), 'EEEE, MMMM do')}</p>
                <p className="text-white font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-git-neon" />
                    {payload[0].value} contributions
                </p>
            </div>
        );
    }
    return null;
}
