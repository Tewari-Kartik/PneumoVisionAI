"use client";

import { motion } from "motion/react";

interface MetricBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: "cyan" | "red" | "green" | "teal";
}

const colorMap = {
  cyan: "from-cyan/80 to-cyan",
  red: "from-signal-red/80 to-signal-red",
  green: "from-signal-green/80 to-signal-green",
  teal: "from-teal/80 to-teal",
};

const glowMapBar = {
  cyan: "shadow-[0_0_12px_rgba(0,240,255,0.3)]",
  red: "shadow-[0_0_12px_rgba(255,77,106,0.3)]",
  green: "shadow-[0_0_12px_rgba(0,230,138,0.3)]",
  teal: "shadow-[0_0_12px_rgba(23,195,178,0.3)]",
};

export default function MetricBar({ label, value, maxValue = 100, color = "cyan" }: MetricBarProps) {
  const pct = Math.min((value / maxValue) * 100, 100);

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-muted">{label}</span>
        <span className="mono-num text-sm font-medium text-secondary">
          {value.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-ink/80 overflow-hidden border border-line/40">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]} ${glowMapBar[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
