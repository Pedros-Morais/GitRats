import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // GitHub Dark Dimmed palette + Neon accents
        background: "#0d1117",
        foreground: "#c9d1d9",
        "hacker-border": "#30363d",
        "git-green": "#238636",
        "git-neon": "#39d353", // The bright neon pop
        "git-gray": "#8b949e",
      },
      fontFamily: {
        mono: ["var(--font-jetbrains-mono)"],
        sans: ["var(--font-inter)"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #39d353, 0 0 10px #39d353" },
          "100%": { boxShadow: "0 0 20px #39d353, 0 0 30px #39d353" },
        },
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(to right, #30363d 1px, transparent 1px), linear-gradient(to bottom, #30363d 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
