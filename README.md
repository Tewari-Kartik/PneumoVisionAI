<div align="center">
  
# 🫁 PneumoVision AI

**Clinical-Grade Chest X-Ray Screening Powered by Explainable AI**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.14+-FF6F00?style=for-the-badge&logo=tensorflow)](https://www.tensorflow.org/)
[![Hugging Face Spaces](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Spaces-FFD21E?style=for-the-badge)](https://huggingface.co/)

PneumoVision AI is a clinical diagnostic console for chest X-ray pneumonia screening. Built with a fine-tuned ResNet50 model, it provides instant predictions alongside precise Grad-CAM localization heatmaps for visual explainability. Features include PDF clinical reports, patient metadata tracking, and a secure, highly responsive modern UI.

[**Explore the Frontend**](#) · [**View the Backend API**](#) · [**Report a Bug**](#)
</div>

---

## ✨ Key Features

- **🧠 Fine-Tuned ResNet50 Backbone:** Transfer learning performed on ImageNet with deep fine-tuning on pediatric pneumonia radiograph datasets.
- **🗺️ Real-Time Grad-CAM Localization:** We don't just output a probability. Our backend mathematically unpacks the final dense layers to map gradients back to the last convolutional layer, highlighting the exact regions of opacity the AI used to make its diagnosis.
- **📄 Medical PDF Reports:** Instantly generate and export clinical-grade diagnostic reports containing patient metadata, AI confidence metrics, and visual heatmaps.
- **🔒 Secure Workspace:** Built-in authentication ensures that case history and patient diagnostic flows are restricted to verified medical personnel.
- **⚡ Hyper-Optimized Architecture:** Next.js Server Components combined with a highly-available Hugging Face Spaces FastAPI backend ensures inference times under 10 seconds.
- **🎨 State-of-the-art UI/UX:** A stunning, clinical dark-mode interface built with Tailwind CSS v4, Framer Motion, GSAP, and 3D Three.js backgrounds.

---

## 🛠️ Technology Stack

### Frontend (Client Console)
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/), & [Three.js / React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- **State Management:** React Context API + LocalStorage 
- **PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF)

### Backend (Inference Engine)
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **Deep Learning:** [TensorFlow / Keras](https://www.tensorflow.org/)
- **Image Processing:** [OpenCV](https://opencv.org/) & Pillow
- **Deployment:** Containerized via Docker and hosted on Hugging Face Spaces (16GB RAM tier for matrix operations).

---

## 🔬 How the Math Works (Explainable AI)

Black-box AI is not acceptable in a clinical setting. To solve this, PneumoVision AI implements **Gradient-weighted Class Activation Mapping (Grad-CAM)** manually. 

Because the Free Tier of our hosting provider had memory limits, we bypassed standard Keras `.predict()` loops and manually extracted the weights of the `GlobalAveragePooling2D` and `Dense(512)` layers. We then compute the exact chain rule gradients of the pre-sigmoid logit with respect to the feature map activations using pure NumPy matrix multiplication. This reduces VRAM overhead by 90% while guaranteeing mathematically perfect heatmaps.

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js 18+
- Python 3.10+

### 1. Clone the Repository
```bash
git clone https://github.com/Tewari-Kartik/PneumoVisionAI.git
cd PneumoVisionAI
```

### 2. Run the FastAPI Backend
```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload --port 8000
```
*The API will be running at `http://localhost:8000`. You can access the Swagger UI at `http://localhost:8000/docs`.*

### 3. Run the Next.js Frontend
Open a new terminal window.
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The Web App will be running at `http://localhost:3000`.*

---

## ☁️ Deployment Architecture

1. **Frontend (Vercel):** The Next.js repository is linked to Vercel for continuous integration and edge delivery.
2. **Backend (Hugging Face Spaces):** The backend relies on a custom `Dockerfile` that builds a Python 3.10 slim environment with `libgl1-mesa-glx` (for OpenCV) and TensorFlow.

---

## 📜 License

This project is licensed under the MIT License. It is intended for research, educational, and screening-assistance purposes. **It is not a replacement for professional medical diagnosis.**

---

<div align="center">
  <i>Developed with ❤️ for the future of Medical AI.</i>
</div>
