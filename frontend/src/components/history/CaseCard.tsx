"use client";

import { motion } from "motion/react";
import { User, FileDown, Trash2 } from "lucide-react";
import HudPanel from "@/components/ui/HudPanel";
import type { CaseRecord } from "@/lib/storage";
import { exportCasePdf } from "@/lib/pdf-export";

interface CaseCardProps {
  caseData: CaseRecord;
  onDelete: (id: string) => void;
  onToggleCompare: (id: string) => void;
  isSelectedForCompare: boolean;
}

export default function CaseCard({
  caseData,
  onDelete,
  onToggleCompare,
  isSelectedForCompare,
}: CaseCardProps) {
  const isPneumonia = caseData.diagnosis.toLowerCase().includes("pneumonia");

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <HudPanel className="h-full">
        <div className="relative">
          <div className="relative h-40 bg-ink rounded-lg overflow-hidden border border-line/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={caseData.heatmapImage || caseData.originalImage}
              alt={`Case ${caseData.id}`}
              className="w-full h-full object-contain"
            />

            <div
              className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                isPneumonia
                  ? "bg-signal-red/20 text-signal-red border border-signal-red/30"
                  : "bg-signal-green/20 text-signal-green border border-signal-green/30"
              }`}
            >
              {isPneumonia ? "ATTENTION" : "CLEAR"}
            </div>

            <label className="absolute top-2 left-2 flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isSelectedForCompare}
                onChange={() => onToggleCompare(caseData.id)}
                className="w-3.5 h-3.5 rounded border-line accent-cyan bg-ink"
              />
              <span className="text-[10px] text-muted font-mono">CMP</span>
            </label>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted" />
              <p className="text-sm text-bright font-display font-medium truncate">
                {caseData.patientName || "Unknown Patient"}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan">
                {caseData.id}
              </span>
              <span className="text-[10px] font-mono text-muted">
                {new Date(caseData.date).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-display font-semibold ${
                  isPneumonia ? "text-signal-red" : "text-signal-green"
                }`}
              >
                {caseData.diagnosis}
              </span>
              <span className="text-xs font-mono text-secondary">
                {(caseData.confidence * 100).toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-line/40">
              <button
                onClick={() => exportCasePdf(caseData)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-muted hover:text-cyan hover:bg-cyan/5 border border-transparent hover:border-cyan/20 transition-all duration-200"
              >
                <FileDown className="h-3.5 w-3.5" />
                PDF
              </button>
              <button
                onClick={() => onDelete(caseData.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-muted hover:text-signal-red hover:bg-signal-red/5 border border-transparent hover:border-signal-red/20 transition-all duration-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </HudPanel>
    </motion.div>
  );
}
