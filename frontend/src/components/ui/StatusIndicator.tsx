"use client";

interface StatusIndicatorProps {
  status: "online" | "offline" | "checking";
}

const config = {
  online: { color: "bg-signal-green", label: "MODEL ONLINE", glow: "shadow-[0_0_8px_rgba(0,230,138,0.6)]" },
  offline: { color: "bg-signal-red", label: "MODEL OFFLINE", glow: "" },
  checking: { color: "bg-signal-amber", label: "CONNECTING…", glow: "shadow-[0_0_8px_rgba(255,184,0,0.6)]" },
};

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  const { color, label, glow } = config[status];
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${color} ${glow} ${status !== "offline" ? "animate-pulse-glow" : ""}`}
      />
      <span className="font-mono text-[11px] text-muted tracking-wider">{label}</span>
    </div>
  );
}
