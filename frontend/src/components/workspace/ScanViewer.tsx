"use client";

import { useState } from "react";
import { motion } from "motion/react";
import HudPanel from "@/components/ui/HudPanel";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";

type ViewMode = "original" | "overlay" | "heatmap";

interface ScanViewerProps {
  previewUrl: string | null;
  heatmapUrl: string | null;
  isRunning: boolean;
  hasResult: boolean;
}

const modes: { key: ViewMode; label: string }[] = [
  { key: "original", label: "Original" },
  { key: "overlay", label: "Overlay" },
  { key: "heatmap", label: "Heatmap" },
];

export default function ScanViewer({
  previewUrl,
  heatmapUrl,
  isRunning,
  hasResult,
}: ScanViewerProps) {
  const [mode, setMode] = useState<ViewMode>("original");
  const [opacity, setOpacity] = useState(0.55);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
    >
      <HudPanel title="Scan Viewer">
        {hasResult && (
          <div className="flex items-center gap-1 mb-4 p-1 bg-ink/80 rounded-xl border border-line/50">
            {modes.map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-display font-semibold tracking-wide transition-all duration-200 ${
                  mode === m.key
                    ? "bg-cyan/15 text-cyan shadow-[0_0_12px_rgba(0,240,255,0.15)] border border-cyan/30"
                    : "text-muted hover:text-secondary"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}

        <div className="relative overflow-hidden rounded-xl border border-line bg-ink min-h-[280px] flex items-center justify-center">
          {!previewUrl ? (
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-full bg-slate/50 flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-1.5 rounded-full bg-line" />
              </div>
              <p className="text-muted text-sm font-display">
                No image loaded
              </p>
            </div>
          ) : (
            <>
              {mode !== "heatmap" && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewUrl}
                  alt="Original radiograph"
                  className="w-full h-full object-contain max-h-[420px]"
                />
              )}

              {mode === "heatmap" && heatmapUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={heatmapUrl}
                  alt="Heatmap visualization"
                  className="w-full h-full object-contain max-h-[420px]"
                />
              )}

              {mode === "overlay" && heatmapUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={heatmapUrl}
                  alt="Heatmap overlay"
                  className="absolute inset-0 w-full h-full object-contain max-h-[420px]"
                  style={{ opacity }}
                />
              )}

              <ScanlineOverlay active={isRunning} />
            </>
          )}
        </div>

        {isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center"
          >
            <p className="text-xs font-mono text-cyan animate-pulse-glow tracking-widest leading-relaxed">
              RUNNING RESNET50 INFERENCE
              <br />
              GRAD-CAM LOCALIZATION IN PROGRESS
            </p>
          </motion.div>
        )}

        {mode === "overlay" && hasResult && heatmapUrl && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-muted font-mono shrink-0">
              OPACITY
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none bg-line accent-cyan cursor-pointer"
            />
            <span className="text-xs text-secondary font-mono w-10 text-right">
              {Math.round(opacity * 100)}%
            </span>
          </div>
        )}
      </HudPanel>
    </motion.div>
  );
}
