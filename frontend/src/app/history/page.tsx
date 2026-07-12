"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { FolderOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CaseCard from "@/components/history/CaseCard";
import HudPanel from "@/components/ui/HudPanel";
import GlowButton from "@/components/ui/GlowButton";
import { getCases, deleteCase, type CaseRecord } from "@/lib/storage";

const COMPARE_KEY = "pneumovision_compare_selection";

export default function HistoryPage() {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [compareSelection, setCompareSelection] = useState<string[]>([]);

  useEffect(() => {
    setCases(getCases());
    try {
      const stored = localStorage.getItem(COMPARE_KEY);
      if (stored) setCompareSelection(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compareSelection));
  }, [compareSelection]);

  const handleDelete = useCallback((id: string) => {
    const updated = deleteCase(id);
    setCases(updated);
    setCompareSelection((prev) => prev.filter((s) => s !== id));
  }, []);

  const handleToggleCompare = useCallback((id: string) => {
    setCompareSelection((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id].slice(-4)
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-void">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <p className="text-xs font-mono text-cyan uppercase tracking-[0.25em] mb-2">
              {cases.length} {cases.length === 1 ? "case" : "cases"} on file
            </p>
            <h1 className="text-3xl font-display font-bold text-bright">
              Case History
            </h1>
          </div>

          {compareSelection.length >= 2 && (
            <GlowButton href="/compare">
              Compare {compareSelection.length} Cases
            </GlowButton>
          )}
        </motion.div>

        {cases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="max-w-md mx-auto mt-16"
          >
            <HudPanel>
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-ink flex items-center justify-center">
                  <FolderOpen className="h-7 w-7 text-muted" />
                </div>
                <p className="text-muted font-display">
                  No cases recorded yet
                </p>
                <p className="text-xs text-muted/60 max-w-xs">
                  Run your first diagnostic from the Workspace to see case
                  history here.
                </p>
                <GlowButton href="/workspace" variant="outline">
                  Go to Workspace
                </GlowButton>
              </div>
            </HudPanel>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
              >
                <CaseCard
                  caseData={c}
                  onDelete={handleDelete}
                  onToggleCompare={handleToggleCompare}
                  isSelectedForCompare={compareSelection.includes(c.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
