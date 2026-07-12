"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { UploadCloud, FileImage, X } from "lucide-react";
import HudPanel from "@/components/ui/HudPanel";
import GlowButton from "@/components/ui/GlowButton";

interface UploadZoneProps {
  file: File | null;
  previewUrl: string | null;
  onFileSelected: (f: File) => void;
  onClear: () => void;
  onRun: () => void;
  isRunning: boolean;
  onSampleSelect?: (url: string, filename: string) => void;
}

export default function UploadZone({
  file,
  previewUrl,
  onFileSelected,
  onClear,
  onRun,
  isRunning,
  onSampleSelect,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped && dropped.type.startsWith("image/")) {
        onFileSelected(dropped);
      }
    },
    [onFileSelected]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelected(selected);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <HudPanel title="Upload Radiograph">
        {!file || !previewUrl ? (
          <div className="flex flex-col w-full">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-10 transition-all duration-500 cursor-pointer overflow-hidden group ${
                isDragOver
                  ? "border-cyan bg-cyan/[0.03] shadow-[inset_0_0_50px_rgba(0,240,255,0.05)]"
                  : "border-line hover:border-cyan/50 hover:bg-cyan/[0.01]"
              }`}
              onClick={() => inputRef.current?.click()}
            >
              {/* Animated scanline on drag over */}
              {isDragOver && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan/10 to-transparent animate-sweep pointer-events-none" />
              )}
              
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
              />
              <div
                className={`relative rounded-full p-4 transition-all duration-500 ${
                  isDragOver ? "bg-cyan/15 scale-110" : "bg-ink group-hover:bg-cyan/5 group-hover:scale-105"
                }`}
              >
                {isDragOver && (
                  <div className="absolute inset-0 rounded-full border border-cyan/40 animate-ping opacity-50" />
                )}
                <UploadCloud
                  className={`relative z-10 h-10 w-10 transition-colors duration-500 ${
                    isDragOver ? "text-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" : "text-muted group-hover:text-cyan/70"
                  }`}
                />
              </div>
              <div className="text-center relative z-10">
                <p className={`font-display font-medium transition-colors duration-300 ${isDragOver ? 'text-cyan' : 'text-bright group-hover:text-cyan/90'}`}>
                  {isDragOver ? "Drop image to analyze" : "Drag & drop a chest X-ray"}
                </p>
                <p className="text-sm text-muted mt-1">
                  or{" "}
                  <span className="text-cyan underline underline-offset-2 cursor-pointer group-hover:text-cyan/80 transition-colors">
                    browse files
                  </span>
                </p>
              </div>
              <p className="text-[10px] text-muted/60 font-mono tracking-widest uppercase relative z-10">
                PNG, JPG, DICOM — Max 10MB
              </p>
            </div>
            
            {onSampleSelect && (
              <div className="mt-6 pt-5 border-t border-line/50">
                <p className="text-xs font-mono text-muted text-center mb-4 uppercase tracking-widest">
                  Or try a sample scan
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => onSampleSelect('/samples/normal.png', 'sample_normal_xray.png')}
                    className="group relative w-24 h-24 rounded-lg overflow-hidden border border-cyan/20 hover:border-cyan transition-colors"
                  >
                    <img src="/samples/normal.png" alt="Normal Lungs" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent opacity-90" />
                    <span className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-mono text-cyan group-hover:text-bright transition-colors">Normal</span>
                  </button>
                  <button
                    onClick={() => onSampleSelect('/samples/pneumonia.png', 'sample_pneumonia_xray.png')}
                    className="group relative w-24 h-24 rounded-lg overflow-hidden border border-cyan/20 hover:border-cyan transition-colors"
                  >
                    <img src="/samples/pneumonia.png" alt="Pneumonia Lungs" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent opacity-90" />
                    <span className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-mono text-cyan group-hover:text-bright transition-colors">Pneumonia</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative group"
          >
            <div className="relative overflow-hidden rounded-xl border border-line bg-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Uploaded radiograph"
                className="w-full h-48 object-contain"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/90 to-transparent px-4 py-3">
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4 text-cyan" />
                  <span className="text-xs font-mono text-secondary truncate">
                    {file.name}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-void/80 border border-line hover:border-signal-red hover:bg-signal-red/10 transition-all duration-200 group"
            >
              <X className="h-4 w-4 text-muted group-hover:text-signal-red transition-colors" />
            </button>
          </motion.div>
        )}

        <div className="mt-5">
          <GlowButton
            onClick={onRun}
            disabled={!file || isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <span className="inline-block h-4 w-4 rounded-full border-2 border-void border-t-transparent animate-spin" />
                Processing…
              </>
            ) : (
              "Run AI Diagnostic"
            )}
          </GlowButton>
        </div>
      </HudPanel>
    </motion.div>
  );
}
