"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ZoomIn, ZoomOut, RotateCw, Maximize2 } from "lucide-react";
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
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleRotate = () => setRotation((r) => r + 90);
  const handleReset = () => { setZoom(1); setRotation(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
    >
      <HudPanel title="Scan Viewer">
        {/* Mode tabs + toolbar */}
        <div className="flex items-center justify-between gap-2 mb-4">
          {hasResult && (
            <div className="flex items-center gap-1 p-1 bg-ink/80 rounded-xl border border-line/50 flex-1">
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

          {/* Toolbar */}
          {previewUrl && (
            <div className="flex items-center gap-1 p-1 bg-ink/80 rounded-xl border border-line/50">
              <button onClick={handleZoomIn} className="p-1.5 rounded-lg text-muted hover:text-cyan hover:bg-cyan/10 transition-all" title="Zoom In">
                <ZoomIn size={14} />
              </button>
              <button onClick={handleZoomOut} className="p-1.5 rounded-lg text-muted hover:text-cyan hover:bg-cyan/10 transition-all" title="Zoom Out">
                <ZoomOut size={14} />
              </button>
              <button onClick={handleRotate} className="p-1.5 rounded-lg text-muted hover:text-cyan hover:bg-cyan/10 transition-all" title="Rotate">
                <RotateCw size={14} />
              </button>
              <button onClick={handleReset} className="p-1.5 rounded-lg text-muted hover:text-cyan hover:bg-cyan/10 transition-all" title="Reset">
                <Maximize2 size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="relative overflow-hidden rounded-xl border border-line bg-ink min-h-[280px] flex items-center justify-center group">
          {/* Corner measurement marks */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-cyan/20 pointer-events-none z-20" />
          <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-cyan/20 pointer-events-none z-20" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-cyan/20 pointer-events-none z-20" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-cyan/20 pointer-events-none z-20" />

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
              <AnimatePresence mode="wait">
                {mode !== "heatmap" && (
                  <motion.img
                    key="original"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={previewUrl}
                    alt="Original radiograph"
                    className="w-full h-full object-contain max-h-[420px] transition-transform duration-300"
                    style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
                  />
                )}

                {mode === "heatmap" && heatmapUrl && (
                  <motion.img
                    key="heatmap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={heatmapUrl}
                    alt="Heatmap visualization"
                    className="w-full h-full object-contain max-h-[420px] transition-transform duration-300"
                    style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
                  />
                )}
              </AnimatePresence>

              {mode === "overlay" && heatmapUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={heatmapUrl}
                  alt="Heatmap overlay"
                  className="absolute inset-0 w-full h-full object-contain max-h-[420px] transition-all duration-300"
                  style={{ opacity, transform: `scale(${zoom}) rotate(${rotation}deg)` }}
                />
              )}

              <ScanlineOverlay active={isRunning} />

              {/* Zoom indicator */}
              {zoom !== 1 && (
                <div className="absolute bottom-3 right-3 z-20 glass-panel px-2 py-1 rounded-lg">
                  <span className="text-[10px] font-mono text-cyan">{Math.round(zoom * 100)}%</span>
                </div>
              )}
            </>
          )}
        </div>

        {isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            {/* Progress bar */}
            <div className="w-full h-1 rounded-full bg-ink overflow-hidden mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan to-teal rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "linear" }}
              />
            </div>
            <p className="text-xs font-mono text-cyan animate-pulse-glow tracking-widest leading-relaxed text-center">
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
