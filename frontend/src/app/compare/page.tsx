"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Layers } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComparePanel from "@/components/compare/ComparePanel";
import HudPanel from "@/components/ui/HudPanel";
import GlowButton from "@/components/ui/GlowButton";
import { getCases, type CaseRecord } from "@/lib/storage";

const COMPARE_KEY = "pneumovision_compare_selection";

export default function ComparePage() {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setCases(getCases());
    try {
      const stored = localStorage.getItem(COMPARE_KEY);
      if (stored) setSelectedIds(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const selectedCases = useMemo(
    () => cases.filter((c) => selectedIds.includes(c.id)),
    [cases, selectedIds]
  );

  return (
    <div className="min-h-screen flex flex-col bg-void">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p className="text-xs font-mono text-cyan uppercase tracking-[0.25em] mb-2">
            {selectedCases.length} {selectedCases.length === 1 ? "case" : "cases"} selected
          </p>
          <h1 className="text-3xl font-display font-bold text-bright">
            Compare
          </h1>
        </motion.div>

        {selectedCases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="max-w-md mx-auto mt-16"
          >
            <HudPanel>
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-ink flex items-center justify-center">
                  <Layers className="h-7 w-7 text-muted" />
                </div>
                <p className="text-muted font-display">
                  No cases selected for comparison
                </p>
                <p className="text-xs text-muted/60 max-w-xs">
                  Select two or more cases from the Case History page using the
                  compare checkboxes, then return here.
                </p>
                <GlowButton href="/history" variant="outline">
                  Go to History
                </GlowButton>
              </div>
            </HudPanel>
          </motion.div>
        ) : (
          <div className="overflow-x-auto pb-4 -mx-6 px-6">
            <div className="grid auto-cols-fr grid-flow-col gap-6" style={{ gridTemplateColumns: `repeat(${Math.min(selectedCases.length, 4)}, minmax(280px, 1fr))` }}>
              {selectedCases.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                >
                  <ComparePanel caseData={c} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
