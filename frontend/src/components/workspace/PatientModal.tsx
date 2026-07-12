"use client";

import { useState } from "react";
import { motion } from "motion/react";
import HudPanel from "@/components/ui/HudPanel";
import GlowButton from "@/components/ui/GlowButton";

export interface PatientInfo {
  patientName: string;
  patientId: string;
  age: string;
  sex: string;
  notes: string;
}

interface PatientModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (info: PatientInfo) => void;
}

const inputClass =
  "w-full bg-ink/80 border border-line rounded-lg px-3 py-2.5 text-sm text-bright placeholder:text-muted/50 focus-ring transition-all duration-300 hover:border-cyan/30 focus:border-cyan/50 focus:shadow-[0_0_20px_rgba(0,240,255,0.1)] focus:bg-ink outline-none";

const labelClass = "block text-[10px] text-muted font-mono uppercase tracking-widest mb-1.5";

export default function PatientModal({ open, onClose, onConfirm }: PatientModalProps) {
  const [form, setForm] = useState<PatientInfo>({
    patientName: "",
    patientId: "",
    age: "",
    sex: "",
    notes: "",
  });

  if (!open) return null;

  const update = (key: keyof PatientInfo, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(form);
    setForm({ patientName: "", patientId: "", age: "", sex: "", notes: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-void/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <HudPanel title="Patient Information" glowColor="cyan">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Patient Name</label>
              <input
                type="text"
                placeholder="Full name"
                value={form.patientName}
                onChange={(e) => update("patientName", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Patient ID / MRN</label>
                <input
                  type="text"
                  placeholder="MRN-000000"
                  value={form.patientId}
                  onChange={(e) => update("patientId", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Age</label>
                <input
                  type="text"
                  placeholder="e.g. 45"
                  value={form.age}
                  onChange={(e) => update("age", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Sex</label>
              <select
                value={form.sex}
                onChange={(e) => update("sex", e.target.value)}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Referring Notes</label>
              <textarea
                rows={3}
                placeholder="Clinical notes, symptoms, history…"
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <GlowButton
                variant="outline"
                onClick={onClose}
                type="button"
                className="flex-1"
              >
                Cancel
              </GlowButton>
              <GlowButton type="submit" className="flex-1">
                Run Diagnostic
              </GlowButton>
            </div>
          </form>
        </HudPanel>
      </motion.div>
    </div>
  );
}
