# 🫁 PneumoVision AI: Deep Learning Chest X-Ray Analyzer

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/AI-TensorFlow%20/%20Keras-FF6F00?style=flat&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![Nginx](https://img.shields.io/badge/Frontend-Vanilla%20JS%20%26%20Nginx-269539?style=flat&logo=nginx&logoColor=white)](https://www.nginx.com/)

**PneumoVision AI** is a full-stack medical imaging application that leverages a **ResNet50 Deep Learning model** to detect Pneumonia from Chest X-ray images with high precision. It features a modern, glassmorphic "Dark Mode" dashboard for a seamless user experience.



---

## 🚀 Features
* **Instant AI Analysis:** Upload a Chest X-ray and get a prediction in under 2 seconds.
* **Confidence Scoring:** The model provides a percentage-based confidence level for its diagnosis.
* **Glassmorphic UI:** A sleek, responsive frontend built with modern CSS and Vanilla JavaScript.
* **Production-Ready Backend:** Built with FastAPI for high-performance asynchronous processing.
* **Scalable Architecture:** Fully prepared for cloud deployment.

---

## 🛠️ Technical Stack
* **Deep Learning:** TensorFlow, Keras, ResNet50 Architecture.
* **Backend:** Python 3.10+, FastAPI, Uvicorn.
* **Image Processing:** OpenCV, Pillow, NumPy.
* **Frontend:** HTML5, CSS3 (Custom Glassmorphism), Vanilla JavaScript.



---

## 📂 Project Structure
```text
pneumonia-vision/
├── backend/
│   ├── main.py                # FastAPI API endpoints
│   ├── best_pneumonia_model.h5 # Trained ResNet50 Model (via Git LFS)
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── index.html             # Dashboard Structure
│   ├── style.css              # Glassmorphic Styling
│   └── script.js              # Frontend Logic & API Fetching
└── README.md                  # Project Documentation
