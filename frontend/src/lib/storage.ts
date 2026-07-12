const STORAGE_KEY = "pneumovision_cases";

export interface CaseRecord {
  id: string;
  date: string;
  diagnosis: string;
  confidence: number;
  probabilityPneumonia: number;
  probabilityNormal: number;
  modelVersion: string;
  originalImage: string;
  heatmapImage: string;
  patientName?: string;
  patientId?: string;
  age?: string;
  sex?: string;
  notes?: string;
}

export function getCases(): CaseRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCase(record: CaseRecord): CaseRecord[] {
  const cases = getCases();
  cases.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  return cases;
}

export function deleteCase(id: string): CaseRecord[] {
  const cases = getCases().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  return cases;
}

export function makeCaseId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let id = "PV-";
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}
