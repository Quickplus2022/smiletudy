"use client";
import { ReactNode } from "react";

interface NeonCardProps {
  children: ReactNode;
  glow?: "primary" | "cyan" | "pink" | "none";
  className?: string;
  onClick?: () => void;
}

const glowMap = {
  primary: "hover:shadow-neon hover:border-primary/60",
  cyan: "hover:shadow-neon-cyan hover:border-secondary/60",
  pink: "hover:shadow-neon-pink hover:border-kpop/60",
  none: "",
};

export default function NeonCard({ children, glow = "primary", className = "", onClick }: NeonCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card border border-border rounded-2xl p-5 transition-all duration-300 ${glowMap[glow]} ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
