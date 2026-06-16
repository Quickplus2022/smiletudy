import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#080A1A",
        card: "#11162E",
        primary: "#8B5CF6",
        secondary: "#22D3EE",
        kpop: "#F472B6",
        success: "#34D399",
        warn: "#FBBF24",
        ink: "#F8FAFC",
        muted: "#CBD5E1",
        border: "#1E2547",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 16px 2px rgba(139,92,246,0.35)",
        "neon-cyan": "0 0 16px 2px rgba(34,211,238,0.3)",
        "neon-pink": "0 0 16px 2px rgba(244,114,182,0.3)",
      },
      backgroundImage: {
        "grid-dark":
          "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;
