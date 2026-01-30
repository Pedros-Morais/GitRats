"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Hash, Trophy, ArrowRight, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- API Helpers ---
const API_URL = "http://localhost:4000/api"; // Direct to backend

async function fetchPublicSquads() {
    const res = await fetch(`${API_URL}/squads/public`);
    if (!res.ok) throw new Error("Failed to fetch squads");
    return res.json();
}

async function fetchMySquads() {
    const token = localStorage.getItem("gitrats_token");
    if (!token) return [];

    const res = await fetch(`${API_URL}/squads/my`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return res.json();
}

async function createSquad(data: any) {
    const token = localStorage.getItem("gitrats_token");
    const res = await fetch(`${API_URL}/squads`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create squad");
    return res.json();
}

async function joinSquad(code: string) {
    const token = localStorage.getItem("gitrats_token");
    const res = await fetch(`${API_URL}/squads/join`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to join squad");
    }
    return res.json();
}

export default function SquadsPage() {
    const [squads, setSquads] = useState<any[]>([]);
    const [mySquads, setMySquads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [showJoin, setShowJoin] = useState(false);
    const router = useRouter();

    const loadData = async () => {
        try {
            const [pub, my] = await Promise.all([fetchPublicSquads(), fetchMySquads()]);
            setSquads(pub);
            setMySquads(my);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Users className="w-8 h-8 text-git-neon" />
                        <span className="text-git-neon">SQUADS</span>
                    </h1>
                    <p className="text-gray-400">Compete with friends and climb the clan leaderboards.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowJoin(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-hacker-border bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors text-white"
                    >
                        <Hash className="w-4 h-4" />
                        Join with Code
                    </button>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-git-green text-white font-bold rounded-lg hover:bg-green-600 transition-colors shadow-lg shadow-git-green/20"
                    >
                        <Plus className="w-4 h-4" />
                        Create Squad
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 text-git-neon animate-spin" />
                </div>
            ) : (
                <>
                    {/* My Squads */}
                    {mySquads.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-white mb-4">My Squads</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {mySquads.map((squad: any) => (
                                    <SquadCard key={squad.id} squad={squad} isMember />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Public Squads */}
                    <h2 className="text-xl font-bold text-white mb-4">Explore Squads</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {squads.map((squad: any) => (
                            <SquadCard key={squad.id} squad={squad} />
                        ))}

                        {squads.length === 0 && (
                            <div className="col-span-full text-center py-12 border border-dashed border-gray-800 rounded-xl text-gray-500">
                                No active squads found. Be the first to create one!
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Modals */}
            <AnimatePresence>
                {showCreate && <CreateSquadModal onClose={() => setShowCreate(false)} onSuccess={loadData} />}
                {showJoin && <JoinSquadModal onClose={() => setShowJoin(false)} onSuccess={loadData} />}
            </AnimatePresence>
        </div>
    );
}

function SquadCard({ squad, isMember }: any) {
    const memberCount = squad._count?.members || squad.members?.length || 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            className={`p-6 rounded-xl border ${isMember ? 'border-git-neon/30 bg-git-neon/5' : 'border-hacker-border bg-gray-900/50'} hover:border-git-neon/50 transition-all relative overflow-hidden group`}
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-xl font-bold text-white font-mono">
                    {squad.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-git-neon transition-colors truncate max-w-[150px]">{squad.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {memberCount}
                        </div>
                        {isMember && <span className="bg-git-neon/20 text-git-neon px-2 py-0.5 rounded-full text-[10px] font-bold">MEMBER</span>}
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">
                {squad.description || "No description provided."}
            </p>

            <div className="pt-4 border-t border-gray-800/50 flex justify-between items-center">
                <div className="text-xs font-mono text-gray-500">
                    CODE: <span className="text-white select-all cursor-copy">{squad.inviteCode}</span>
                </div>
            </div>
        </motion.div>
    )
}

function CreateSquadModal({ onClose, onSuccess }: any) {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createSquad({ name, description: desc, isPrivate: false });
            onSuccess();
            onClose();
        } catch (error) {
            alert("Failed to create squad");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#0d1117] border border-hacker-border rounded-xl w-full max-w-md p-6 shadow-2xl shadow-git-green/10"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Create New Squad</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-mono text-gray-400 mb-1">SQUAD NAME</label>
                        <input
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-git-neon outline-none transition-colors"
                            placeholder="e.g. Vercel Ship Team"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-mono text-gray-400 mb-1">DESCRIPTION</label>
                        <textarea
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-git-neon outline-none transition-colors h-24 resize-none"
                            placeholder="What is this squad about?"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-3 bg-git-green hover:bg-green-600 text-white font-bold rounded-lg transition-all flex justify-center items-center gap-2 mt-4"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        LAUNCH SQUAD
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

function JoinSquadModal({ onClose, onSuccess }: any) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await joinSquad(code);
            onSuccess();
            onClose();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#0d1117] border border-hacker-border rounded-xl w-full max-w-sm p-6 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Join Squad</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-mono text-gray-400 mb-1">INVITE CODE</label>
                        <input
                            required
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white font-mono text-center tracking-wider text-lg focus:border-git-neon outline-none transition-colors"
                            placeholder="0000-0000"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{error}</p>}

                    <button
                        disabled={loading}
                        className="w-full py-3 bg-transparent border border-hacker-border hover:bg-white/5 text-white font-bold rounded-lg transition-all flex justify-center items-center gap-2 mt-4"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "JOIN SQUAD"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
