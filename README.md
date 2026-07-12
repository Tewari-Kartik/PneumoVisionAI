# PneumoVision AI

AI-assisted chest X-ray screening console: ResNet50 classifier + Grad-CAM localization, wrapped in a clinical-grade case management UI.

## Structure

```
pneumovision-ai/
├── frontend/     Vite + React + Tailwind SPA
└── backend/      FastAPI + TensorFlow inference server
```

## What's new in this version

**Frontend (complete rebuild)**
- Vite + React, Tailwind design system (clinical navy/teal palette, Space Grotesk + IBM Plex type)
- Three views: **Workspace** (upload → analyze → report), **Case History**, **Compare**
- Patient/case metadata capture before each run (name, MRN, age, sex, notes)
- Grad-CAM viewer with original / overlay / heatmap-only modes and an opacity slider
- Signature "scan-line" sweep animation during inference — a nod to actual radiographic scanning
- Client-side case history (stored in `localStorage`, no backend DB needed)
- Multi-case **Compare** view — select any cases from history to view side by side
- One-click **PDF report export** (patient info, diagnosis, confidence, both images, disclaimer) via `jsPDF`
- Live backend health indicator in the header
- Proper error states (network failure, non-2xx responses) instead of a blind `alert()`

**Backend (`main.py`)**
- Model loads once at startup instead of import time; `/health` endpoint reports load status
- File validation: content-type allowlist + max size (413/415 errors instead of silent failure)
- Structured error handling with meaningful HTTP status codes at every failure point (model not loaded, bad image, inference failure, Grad-CAM failure)
- Richer response payload: `probability_pneumonia`, `probability_normal`, `model_version`, `inference_ms` (the frontend surfaces all of these)
- Logging instead of bare `print()`

## Running locally

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Place best_pneumonia_model.h5 in this folder (pulled via git-lfs from your repo)
uvicorn main:app --reload --port 8000
```

Visit `http://localhost:8000/health` to confirm the model loaded.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env: point VITE_API_URL at your backend (localhost:8000 for local dev,
# or your Hugging Face Space URL for the deployed model)
npm run dev
```

Visit `http://localhost:5173`.

### Production build

```bash
cd frontend
npm run build   # outputs static files to frontend/dist
```

Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages). Keep the backend on Hugging Face Spaces (or move it to Render/Fly.io if you need more CPU/RAM for TensorFlow).

## Notes on data

Case history and patient info are stored **only in the browser's `localStorage`** — nothing is sent anywhere except the single image per diagnostic request to your backend. There is no server-side database in this version. If you need multi-device sync or a real patient record system, that's the natural next step (would need auth + a backend datastore).

## Disclaimer

This tool is an AI-assisted screening aid. It is not a certified medical device and must not be used as the sole basis for diagnosis or treatment — all results require confirmation by a licensed clinician.
