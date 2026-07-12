"use client";

import { motion } from "motion/react";
import { CheckCircle2, AlertTriangle, FileDown } from "lucide-react";
import HudPanel from "@/components/ui/HudPanel";
import GlowButton from "@/components/ui/GlowButton";
import MetricBar from "@/components/ui/MetricBar";
import type { DiagnosticResult } from "@/lib/api";
import type { CaseRecord } from "@/lib/storage";

interface DiagnosticReportProps {
  result: DiagnosticResult | null;
  caseRecord: CaseRecord | null;
  onExportPdf: () => void;
}

export default function DiagnosticReport({
  result,
  caseRecord,
  onExportPdf,
}: DiagnosticReportProps) {
  const isPneumonia = result?.diagnosis?.toLowerCase().includes("pneumonia");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
    >
      <HudPanel title="Diagnostic Report">
        {!result ? (
          <div className="flex flex-col items-center justify-center py-10 gap-5 text-center">
            <div className="waveform-rule" />
            <p className="text-sm text-muted font-display leading-relaxed max-w-xs">
              Upload a radiograph and run the diagnostic to generate a report.
            </p>
            <div className="waveform-rule" />
          </div>
        ) : (
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`flex items-center gap-3 p-4 rounded-xl border ${
                isPneumonia
                  ? "bg-signal-red/10 border-signal-red/30"
                  : "bg-signal-green/10 border-signal-green/30"
              }`}
            >
              {isPneumonia ? (
                <AlertTriangle className="h-6 w-6 text-signal-red shrink-0" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-signal-green shrink-0" />
              )}
              <div>
                <p
                  className={`font-display font-bold text-lg ${
                    isPneumonia ? "text-signal-red" : "text-signal-green"
                  }`}
                >
                  {result.diagnosis}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  AI screening verdict
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <MetricBar
                label="Model Confidence"
                value={result.confidence * 100}
                color="cyan"
              />
              <MetricBar
                label="P(Pneumonia)"
                value={result.probability_pneumonia * 100}
                color="red"
              />
              <MetricBar
                label="P(Normal)"
                value={result.probability_normal * 100}
                color="green"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { label: "Model", value: result.model_version || "ResNet50-FT v1" },
                { label: "Inference", value: `${result.inference_ms}ms` },
                { label: "Case ID", value: caseRecord?.id || "—" },
                {
                  label: "Date",
                  value: caseRecord
                    ? new Date(caseRecord.date).toLocaleDateString()
                    : "—",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-ink/60 border border-line/40 rounded-lg px-3 py-2.5"
                >
                  <p className="text-[10px] text-muted uppercase tracking-wider font-mono">
                    {item.label}
                  </p>
                  <p className="text-sm text-secondary font-mono mt-0.5 truncate">
                    {item.value}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              <GlowButton
                variant="outline"
                onClick={onExportPdf}
                className="w-full"
              >
                <FileDown className="h-4 w-4" />
                Export PDF Report
              </GlowButton>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="text-[10px] text-muted/70 leading-relaxed font-mono border-t border-line/40 pt-4"
            >
              DISCLAIMER: This is an AI screening tool, not a certified medical
              diagnosis. All findings must be reviewed and confirmed by a
              licensed clinician before any clinical decisions are made.
            </motion.p>
          </div>
        )}
      </HudPanel>
    </motion.div>
  );
}
