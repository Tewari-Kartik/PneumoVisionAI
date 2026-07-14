import axios from "axios";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
});

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export interface DiagnosticResult {
  diagnosis: string;
  confidence: number;
  probability_pneumonia: number;
  probability_normal: number;
  heatmap_image: string;
  model_version: string;
  inference_ms: number;
}

export interface HealthStatus {
  status: string;
  model_version?: string;
}

export async function checkHealth(): Promise<HealthStatus> {
  try {
    const res = await api.get<HealthStatus>("/health", { timeout: 3000 });
    return res.data;
  } catch {
    return { status: "unreachable" };
  }
}

export async function runDiagnostic(file: File): Promise<DiagnosticResult> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api.post<DiagnosticResult>("/predict", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const detail = err.response?.data?.detail || "The diagnostic server rejected the request.";
      throw new ApiError(detail, err.response?.status || 0);
    }
    throw new ApiError("Could not reach the diagnostic server. Check your connection and try again.", 0);
  }
}
