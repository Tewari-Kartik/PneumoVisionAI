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
import { AlertTriangle } from "lucide-react";

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
            Live Diagnostic
          </p>
          <h1 className="text-3xl font-display font-bold text-bright">
            Workspace
          </h1>
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
