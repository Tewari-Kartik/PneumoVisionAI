"use client";

import { motion } from "motion/react";
import { User } from "lucide-react";
import HudPanel from "@/components/ui/HudPanel";
import MetricBar from "@/components/ui/MetricBar";
import type { CaseRecord } from "@/lib/storage";

interface ComparePanelProps {
  caseData: CaseRecord;
}

export default function ComparePanel({ caseData }: ComparePanelProps) {
  const isPneumonia = caseData.diagnosis.toLowerCase().includes("pneumonia");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-w-[280px]"
    >
      <HudPanel glowColor={isPneumonia ? "red" : "teal"}>
        <div className="space-y-4">
          <div className="relative h-52 bg-ink rounded-lg overflow-hidden border border-line/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={caseData.heatmapImage || caseData.originalImage}
              alt={`Case ${caseData.id}`}
              className="w-full h-full object-contain"
            />
          </div>

          <div
            className={`text-center py-2 rounded-lg border ${
              isPneumonia
                ? "bg-signal-red/10 border-signal-red/30"
                : "bg-signal-green/10 border-signal-green/30"
            }`}
          >
            <p
              className={`font-display font-bold text-sm ${
                isPneumonia ? "text-signal-red" : "text-signal-green"
              }`}
            >
              {caseData.diagnosis}
            </p>
          </div>

          <MetricBar
            label="Confidence"
            value={caseData.confidence * 100}
            color={isPneumonia ? "red" : "green"}
          />

          <div className="space-y-1.5 pt-1 border-t border-line/40">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted" />
              <span className="text-sm text-bright font-display truncate">
                {caseData.patientName || "Unknown Patient"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan">
                {caseData.id}
              </span>
              <span className="text-[10px] font-mono text-muted">
                {new Date(caseData.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </HudPanel>
    </motion.div>
  );
}
