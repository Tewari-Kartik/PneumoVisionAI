"use client";

import type { ReactNode } from "react";

interface HudPanelProps {
  children: ReactNode;
  className?: string;
  title?: string;
  glowColor?: "cyan" | "teal" | "red";
}

const glowMap = {
  cyan: "glow-cyan",
  teal: "glow-teal",
  red: "glow-red",
};

export default function HudPanel({ children, className = "", title, glowColor }: HudPanelProps) {
  return (
    <div
      className={`relative bg-panel backdrop-blur-xl border border-line rounded-2xl overflow-hidden ${glowColor ? glowMap[glowColor] : ""} ${className}`}
    >
      {/* HUD corner brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan/60 rounded-tl-sm" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan/60 rounded-tr-sm" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan/60 rounded-bl-sm" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan/60 rounded-br-sm" />

      {title && (
        <div className="px-6 py-3 border-b border-line/60 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-glow" />
          <h3 className="font-display font-semibold text-sm tracking-wide uppercase text-secondary">
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
