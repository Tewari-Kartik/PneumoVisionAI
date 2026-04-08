# 🫁 PneumoVision AI 
**Clinical-Grade Chest X-Ray Analysis Network**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/AI-TensorFlow%20/%20Keras-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![JavaScript](https://img.shields.io/badge/Frontend-Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Deployment](https://img.shields.io/badge/Deployed_On-Render_%7C_Hugging_Face-informational?style=for-the-badge)]()

**PneumoVision AI** is a high-performance, full-stack medical imaging application. By leveraging a heavily fine-tuned **ResNet50 Deep Learning architecture**, it acts as a digital assistant for detecting Pneumonia from Chest X-ray scans with remarkable precision. 

Wrapped in a sleek, glassmorphic "Dark Mode" UI, the system bridges the gap between complex artificial intelligence and intuitive user experience.

---

## 🟢 Live Demo

Experience the AI in action! Drop a Chest X-ray into the dashboard and watch the ResNet50 model process it in real-time.

> **🌐 Launch App:** [pneumovision-app.onrender.com](https://pneumovision-app.onrender.com)
> *(Note: The AI backend is hosted on a free tier and may take a few seconds to wake up upon your first request!)*

---

## ✨ Key Features

* ⚡ **Instant AI Diagnostics:** Upload a scan and receive a prediction in under 2 seconds.
* 🎯 **Precision Confidence Scoring:** The AI doesn't just guess; it provides a percentage-based confidence metric for its diagnosis.
* 🔮 **Glassmorphic UI:** A beautifully crafted, responsive dashboard using modern CSS paradigms—no clunky templates.
* 🚀 **Asynchronous Processing:** Powered by FastAPI, ensuring the backend handles heavy image arrays without bottlenecking.
* ☁️ **Cloud-Native Architecture:** Fully decoupled frontend and backend, successfully deployed across Render and Hugging Face.

---

## 🛠️ The Tech Stack

**The Brain (Deep Learning)**
* TensorFlow & Keras
* ResNet50 Architecture (Global Average Pooling, Dense Sigmoid Output)
* Image Processing: OpenCV, Pillow, NumPy

**The Engine (Backend API)**
* Python 3.10+
* FastAPI & Uvicorn (ASGI)
* RESTful API & CORS Middleware

**The Face (Frontend UI)**
* HTML5 & CSS3 (Custom Glassmorphism)
* Vanilla JavaScript (Fetch API integration)

---

## 📂 Project Structure

```text
pneumonia-vision/
├── backend/
│   ├── main.py
│   ├── best_pneumonia_model.h5
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
