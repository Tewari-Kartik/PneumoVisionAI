"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UploadZone from "@/components/workspace/UploadZone";
import ScanViewer from "@/components/workspace/ScanViewer";
import DiagnosticReport from "@/components/workspace/DiagnosticReport";
import PatientModal from "@/components/workspace/PatientModal";
import type { PatientInfo } from "@/components/workspace/PatientModal";
import { runDiagnostic, ApiError, type DiagnosticResult } from "@/lib/api";
import { saveCase, makeCaseId, type CaseRecord } from "@/lib/storage";
import { exportCasePdf } from "@/lib/pdf-export";
import { AlertTriangle, Activity, Clock, Cpu, Shield } from "lucide-react";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function WorkspacePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = useCallback(async (f: File) => {
    setFile(f);
    setResult(null);
    setCaseRecord(null);
    setError(null);
    try {
      const url = await fileToDataUrl(f);
      setPreviewUrl(url);
    } catch {
      setError("Failed to read the selected file.");
    }
  }, []);

  const handleClear = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setCaseRecord(null);
    setError(null);
  }, []);

  const handleSampleClick = useCallback(async (url: string, filename: string) => {
    setError(null);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const sampleFile = new File([blob], filename, { type: blob.type || 'image/png' });
      handleFileSelected(sampleFile);
    } catch (e) {
      setError("Failed to load sample image.");
    }
  }, [handleFileSelected]);

  const handleRunClick = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleConfirmRun = useCallback(
    async (info: PatientInfo) => {
      if (!file || !previewUrl) return;
      setModalOpen(false);
      setIsRunning(true);
      setError(null);

      try {
        const res = await runDiagnostic(file);
        setResult(res);

        const heatmapUrl = res.heatmap_image.startsWith("data:")
          ? res.heatmap_image
          : `data:image/png;base64,${res.heatmap_image}`;

        const record: CaseRecord = {
          id: makeCaseId(),
          date: new Date().toISOString(),
          diagnosis: res.diagnosis,
          confidence: res.confidence,
          probabilityPneumonia: res.probability_pneumonia,
          probabilityNormal: res.probability_normal,
          modelVersion: res.model_version,
          originalImage: previewUrl,
          heatmapImage: heatmapUrl,
          patientName: info.patientName || undefined,
          patientId: info.patientId || undefined,
          age: info.age || undefined,
          sex: info.sex || undefined,
          notes: info.notes || undefined,
        };

        try {
          saveCase(record);
        } catch (storageErr) {
          console.warn("Could not save case to local storage (quota exceeded).", storageErr);
        }
        setCaseRecord(record);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setIsRunning(false);
      }
    },
    [file, previewUrl]
  );

  const handleExportPdf = useCallback(() => {
    if (caseRecord) exportCasePdf(caseRecord);
  }, [caseRecord]);

  const heatmapUrl = result
    ? result.heatmap_image.startsWith("data:")
      ? result.heatmap_image
      : `data:image/png;base64,${result.heatmap_image}`
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-void relative">
      {/* Background effects */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="fixed top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-cyan/[0.03] blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-0 w-[300px] h-[300px] rounded-full bg-teal/[0.03] blur-[100px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-24 pb-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <p className="text-xs font-mono text-cyan uppercase tracking-[0.25em] mb-2">
              Live Diagnostic
            </p>
            <h1 className="text-3xl font-display font-bold text-bright">
              Workspace
            </h1>
          </div>

          {/* Status bar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 glass-panel px-4 py-2.5 rounded-xl"
          >
            <div className="flex items-center gap-1.5">
              <Activity size={12} className="text-signal-green" />
              <span className="text-[10px] font-mono text-muted">MODEL READY</span>
            </div>
            <div className="w-px h-3 bg-line" />
            <div className="flex items-center gap-1.5">
              <Cpu size={12} className="text-cyan" />
              <span className="text-[10px] font-mono text-muted">RESNET50 v2.1</span>
            </div>
            <div className="w-px h-3 bg-line hidden sm:block" />
            <div className="items-center gap-1.5 hidden sm:flex">
              <Shield size={12} className="text-teal" />
              <span className="text-[10px] font-mono text-muted">LOCAL PROCESSING</span>
            </div>
          </motion.div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border border-signal-red/30 bg-signal-red/10"
          >
            <AlertTriangle className="h-4 w-4 text-signal-red shrink-0" />
            <p className="text-sm text-signal-red">{error}</p>
          </motion.div>
        )}

        {!file ? (
          <div className="max-w-2xl mx-auto mt-12">
            <UploadZone
              file={file}
              previewUrl={previewUrl}
              onFileSelected={handleFileSelected}
              onClear={handleClear}
              onRun={handleRunClick}
              isRunning={isRunning}
              onSampleSelect={handleSampleClick}
            />

            {/* Quick info cards below upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-3 mt-8"
            >
              {[
                { icon: Cpu, label: 'ResNet50', desc: 'Deep learning backbone', color: 'text-cyan' },
                { icon: Clock, label: '<10 seconds', desc: 'Average inference', color: 'text-teal' },
                { icon: Shield, label: 'Private', desc: 'Client-side only', color: 'text-neon-blue' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="glass-panel rounded-xl p-4 text-center group hover:border-cyan/20 transition-all duration-500">
                    <Icon size={18} className={`${item.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                    <p className="text-xs font-display font-semibold text-bright">{item.label}</p>
                    <p className="text-[10px] font-mono text-muted mt-0.5">{item.desc}</p>
                  </div>
                );
              })}
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <UploadZone
              file={file}
              previewUrl={previewUrl}
              onFileSelected={handleFileSelected}
              onClear={handleClear}
              onRun={handleRunClick}
              isRunning={isRunning}
            />
            <ScanViewer
              previewUrl={previewUrl}
              heatmapUrl={heatmapUrl}
              isRunning={isRunning}
              hasResult={!!result}
            />
            <DiagnosticReport
              result={result}
              caseRecord={caseRecord}
              onExportPdf={handleExportPdf}
            />
          </div>
        )}
      </main>

      <Footer />

      <PatientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmRun}
      />
    </div>
  );
}
