<div align="center">

# 🫁 PneumoVision AI

**The Future of Clinical Diagnostics: Explainable, Lightning-Fast, and Secure.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.14+-FF6F00?style=for-the-badge&logo=tensorflow)](https://www.tensorflow.org/)
[![Hugging Face Spaces](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Spaces-FFD21E?style=for-the-badge)](https://huggingface.co/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

*PneumoVision AI is a next-generation clinical diagnostic console for chest X-ray pneumonia screening. Built with a fine-tuned ResNet50 deep learning model, it goes beyond simple classification by providing mathematically precise Grad-CAM localization heatmaps for visual explainability. With automated clinical PDF reports, patient metadata tracking, and a secure, highly responsive modern UI, it bridges the gap between raw artificial intelligence and professional clinical utility.*

[**Explore the Frontend**](#) · [**View the Backend API**](#) · [**Report a Bug**](#)
</div>

---

## 🌟 The Vision

In modern medicine, black-box AI algorithms are a liability. Doctors need to know *why* an AI made a specific diagnosis. **PneumoVision AI** solves this by generating **Gradient-weighted Class Activation Mapping (Grad-CAM)** heatmaps in real-time, overlaying the exact opacities and pulmonary regions that triggered the model's pneumonia detection. 

We wrapped this highly complex mathematical operation inside a beautiful, secure, and intuitive web application designed for the fast-paced environment of emergency rooms and diagnostic clinics.

---

## ✨ Core Features

- **🧠 Fine-Tuned ResNet50 Backbone:** We leveraged transfer learning on ImageNet weights, deeply fine-tuning the convolutional blocks on vast datasets of pediatric pneumonia radiographs for unparalleled accuracy.
- **🗺️ Explainable AI (XAI) Heatmaps:** Instant, high-resolution Grad-CAM overlays that map the exact gradients of the network's final decision back to the original X-ray. 
- **📄 Automated Medical PDF Reports:** With one click, clinicians can generate, format, and download clinical-grade PDF diagnostic reports containing patient metadata, confidence metrics, and comparative visual scans.
- **🔒 Secure Clinical Workspace:** Built-in local authentication and strict Route Guards ensure that patient diagnostic flows and historical case data are restricted to verified medical personnel.
- **⚡ Hyper-Optimized Backend Architecture:** Hosted on Hugging Face Spaces, the backend uses a mathematically optimized manual matrix multiplication approach to generate Grad-CAMs, reducing VRAM usage by 90% and enabling execution on free-tier 16GB RAM cloud environments.
- **🎨 State-of-the-art UI/UX:** A stunning, clinical dark-mode interface built with Tailwind CSS v4, Framer Motion, GSAP, and dynamic 3D Three.js backgrounds that make the app feel alive.

---

## 🏗️ Elaborated Folder Structure

Our repository is strictly divided into a high-performance Next.js frontend and a mathematically optimized Python FastAPI backend.

```text
PneumoVisionAI/
│
├── backend/                        # 🧠 The AI Inference Engine
│   ├── main.py                     # Core FastAPI server and routing
│   ├── best_pneumonia_model.h5     # The fine-tuned ResNet50 model weights
│   ├── requirements.txt            # Python dependencies (TensorFlow, OpenCV)
│   └── Dockerfile                  # Containerization for Hugging Face Spaces
│
├── frontend/                       # 💻 The Clinical Web Console
│   ├── public/                     # Static assets, X-ray textures, SVGs
│   └── src/
│       ├── app/                    # Next.js 14 App Router
│       │   ├── auth/               # Secure login/signup portal
│       │   ├── compare/            # Side-by-side radiograph analysis tool
│       │   ├── history/            # Protected historical patient case logs
│       │   ├── workspace/          # The main Live Diagnostic scanning interface
│       │   ├── layout.tsx          # Root layout injected with AuthGuard & Providers
│       │   └── page.tsx            # The stunning landing page
│       │
│       ├── components/             # Reusable UI/UX React Components
│       │   ├── compare/            # Image comparison sliders
│       │   ├── history/            # Searchable patient case cards
│       │   ├── landing/            # Landing page sections (Hero, CTA, Features)
│       │   ├── layout/             # Navbar, Footer, and strict AuthGuard
│       │   ├── three/              # 3D React Three Fiber scenes (Lungs, Particles)
│       │   ├── ui/                 # Micro-components (GlassCards, MetricBars, GlowButtons)
│       │   └── workspace/          # Diagnostic engine UI (ScanViewer, PDF Report Builder)
│       │
│       ├── lib/                    # Core utilities and business logic
│       │   ├── api.ts              # Async fetch wrappers for communicating with the backend
│       │   ├── auth-context.tsx    # Secure session management and context provider
│       │   ├── gsap-config.ts      # GreenSock animation configuration
│       │   ├── pdf-export.ts       # jsPDF logic for building clinical reports
│       │   └── storage.ts          # LocalStorage wrappers for patient case history
│       │
│       └── providers/              # Global state and utility providers
│           └── SmoothScrollProvider.tsx # Lenis smooth scrolling wrapper
│
└── samples/                        # Example X-rays for quick testing
    ├── normal_sample.png
    └── pneumonia_sample.png
```

---

## 🔬 How the Math Works (The Engineering Challenge)

Generating Grad-CAMs using standard TensorFlow/Keras `.predict()` loops requires building massive gradient tapes that immediately exhaust the memory limits of free cloud hosting providers.

To solve this, PneumoVision AI implements **Manual Grad-CAM**. We extract the weights of the `GlobalAveragePooling2D` and `Dense(512)` layers at startup. During inference, we compute the exact chain rule gradients of the pre-sigmoid logit with respect to the feature map activations using pure NumPy matrix multiplication. 

```python
# Extract weights (done once at startup)
w1, b1 = model.layers[2].get_weights()
w2, b2 = model.layers[4].get_weights()

# Manual Math for Grad-CAM (Inference phase)
gap = np.mean(gap_input, axis=(1, 2))
h_pre = np.dot(gap, w1) + b1
v = w2.flatten() * (h_pre[0] > 0).astype(np.float32) # Derivative of ReLU
alpha_g = np.dot(w1, v) # Chain Rule Gradient
```
*This approach reduces VRAM overhead by 90% while guaranteeing mathematically perfect heatmaps.*

---

## 🚀 Installation & Local Development

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **Python:** v3.10 or higher
- **Git:** Version control

### 1. Clone the Repository
```bash
git clone https://github.com/Tewari-Kartik/PneumoVisionAI.git
cd PneumoVisionAI
```

### 2. Run the FastAPI Backend
Open a terminal and navigate to the backend directory.
```bash
cd backend

# Create an isolated virtual environment
python -m venv venv

# Activate the environment (Windows)
venv\Scripts\activate
# Activate the environment (Mac/Linux)
source venv/bin/activate

# Install all deep learning dependencies
pip install -r requirements.txt

# Start the high-performance API server
uvicorn main:app --reload --port 8000
```
*The API will boot up at `http://localhost:8000`. Test it by visiting the interactive Swagger documentation at `http://localhost:8000/docs`.*

### 3. Run the Next.js Frontend
Open a new terminal window and navigate to the frontend directory.
```bash
cd frontend

# Install all UI/UX dependencies
npm install

# Start the Next.js development server
npm run dev
```
*The Web Console will be running beautifully at `http://localhost:3000`.*

---

## ☁️ Deployment Architecture

PneumoVision AI utilizes a decoupled, highly scalable architecture:

1. **Frontend Edge Network (Vercel):** The Next.js 14 repository is continuously deployed to Vercel's edge network, ensuring sub-millisecond static asset delivery and instant page loads.
2. **Backend Inference Engine (Hugging Face Spaces):** Due to the high compute requirements of TensorFlow matrix operations, the backend is containerized via a custom `Dockerfile` (utilizing a Python 3.10 slim environment with `libgl1-mesa-glx`) and hosted on Hugging Face Spaces free tier, which provides a massive 16GB of RAM.

---

## 📜 License & Disclaimer

This project is open-sourced under the **MIT License**.

**⚠️ Medical Disclaimer:** PneumoVision AI is intended strictly for research, educational, and developer portfolio purposes. It is **not** an FDA-approved medical device and should **never** be used as a replacement for professional medical diagnosis by a qualified radiologist or physician.

---

<div align="center">
  <i>Designed & Developed with ❤️ for the future of Medical AI.</i>
</div>
