"use client";

import { motion } from "framer-motion";
import { Github, Terminal, TrendingUp, Award, Zap } from "lucide-react";
import { useEffect, useState } from "react";

// Mock data structure matching the previous server component
// We'll move the data fetching to a client-side effect for this demo or keep it server-side if refined
// For now, let's make the landing page purely presentational and "Client" for animations
// In a real app, we'd pass server data as props or use server components with client leaves.

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans text-foreground">

      {/* Background Decor */}
      <div className="absolute inset-0 bg-grid-white [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-git-green/20 blur-[120px] rounded-full pointer-events-none opacity-20" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Navbar */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2 font-mono text-xl font-bold text-white tracking-tighter">
            <Terminal className="text-git-neon w-6 h-6" />
            <span>GIT<span className="text-git-neon">RATS</span>_</span>
          </div>
          <a
            href="/api/auth/github"
            className="px-6 py-2 rounded-lg border border-hacker-border bg-hacker-border/50 hover:bg-hacker-border text-sm font-semibold transition-all hover:border-git-gray text-white"
          >
            Log In
          </a>
        </nav>

        {/* Hero Section */}
        <section className="pt-20 pb-32 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-git-green/30 bg-git-green/10 text-git-neon text-xs font-mono mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-git-neon opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-git-neon"></span>
            </span>
            SYSTEM ONLINE // READY TO COMMIT
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6"
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-git-neon to-teal-400">Gym</span> for your <br />
            Open Source Journey.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Treat your commits like reps. Track your streaks, earn XP, and compete on the global leaderboard. Turn your GitHub activity into a game.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="/api/auth/github"
              className="group relative px-8 py-4 bg-git-green text-white font-bold rounded-lg overflow-hidden transition-transform active:scale-95 shadow-lg shadow-git-green/20 hover:shadow-git-green/40"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center gap-2">
                <Github className="w-5 h-5" />
                Start Your Workout
              </span>
            </a>
            <a
              href="http://localhost:4000/api/auth/mock"
              className="px-8 py-4 bg-transparent border border-hacker-border text-gray-300 font-semibold rounded-lg hover:border-git-neon hover:text-git-neon hover:bg-git-neon/10 transition-all flex items-center gap-2"
            >
              <Terminal className="w-5 h-5" />
              Mock Login (Dev)
            </a>
          </motion.div>
        </section>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          <FeatureCard
            icon={<TrendingUp />}
            title="Track Gains"
            desc="Visualize your commit history with advanced heatmaps that make GitHub's graph look boring."
          />
          <FeatureCard
            icon={<Award />}
            title="Earn XP"
            desc="Every PR, issue, and code review grants XP. Level up from 'Script Kiddie' to '10x Engineer'."
          />
          <FeatureCard
            icon={<Zap />}
            title="Maintain Streaks"
            desc="Don't break the chain. Daily coding quotas keep your discipline sharp and your streak alive."
          />
        </motion.div>

        {/* Social Proof / Stats Mockup */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="border border-hacker-border bg-[#0d1117]/80 backdrop-blur rounded-xl p-8 max-w-3xl mx-auto text-center"
        >
          <div className="flex justify-center items-center gap-8 text-gray-400 font-mono text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-white">1.2M+</span>
              <span>COMMITS TRACKED</span>
            </div>
            <div className="h-10 w-px bg-hacker-border" />
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-white">50k+</span>
              <span>DEV REPS</span>
            </div>
            <div className="h-10 w-px bg-hacker-border" />
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-white">99.9%</span>
              <span>UPTIME</span>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="group p-6 rounded-xl border border-hacker-border bg-gray-900/30 hover:bg-gray-800/50 hover:border-git-neon/50 transition-all duration-300">
      <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-git-neon mb-4 group-hover:scale-110 group-hover:bg-git-neon/10 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2 font-mono group-hover:text-git-neon transition-colors">{title}</h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
        {desc}
      </p>
    </div>
  )
}
