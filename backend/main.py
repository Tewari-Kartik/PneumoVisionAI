import io
import base64
import logging
import time

import numpy as np
import cv2
import tensorflow as tf
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.preprocessing import image as keras_image
from keras.applications import ResNet50
from keras.models import Sequential
from keras.layers import Dense, GlobalAveragePooling2D, Dropout

# --------------------------------------------------------------------------
# Config
# --------------------------------------------------------------------------
MODEL_PATH = "best_pneumonia_model.h5"
MODEL_VERSION = "resnet50-ft-v1.0"
LAST_CONV_LAYER = "conv5_block3_out"
IMG_SIZE = (224, 224)
PNEUMONIA_THRESHOLD = 0.70
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/jpg", "image/webp"}
MAX_FILE_SIZE_MB = 15

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("pneumovision")

# --------------------------------------------------------------------------
# App setup
# --------------------------------------------------------------------------
app = FastAPI(
    title="PneumoVision AI API",
    version=MODEL_VERSION,
    description="Chest X-ray pneumonia screening with Grad-CAM localization.",
)

# NOTE: for production, replace "*" with your deployed frontend origin(s),
# e.g. ["https://pneumovision.yourdomain.com"], to avoid exposing the API
# to arbitrary origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------------------------------
# Model loading (once, at startup)
# --------------------------------------------------------------------------
model = None
feature_extractor = None
w1 = None
b1 = None
w2 = None
b2 = None


def load_model():
    global model, feature_extractor, w1, b1, w2, b2
    logger.info("Loading ResNet50 backbone (imagenet weights)...")
    base_resnet = ResNet50(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
    base_resnet.trainable = False

    built_model = Sequential([
        base_resnet,
        GlobalAveragePooling2D(),
        Dense(512, activation="relu"),
        Dropout(0.5),
        Dense(1, activation="sigmoid"),
    ])

    logger.info("Loading fine-tuned weights from %s...", MODEL_PATH)
    built_model.load_weights(MODEL_PATH)

    # Extract Dense layer weights for manual mathematical Grad-CAM
    w1_val, b1_val = built_model.layers[2].get_weights()
    w2_val, b2_val = built_model.layers[4].get_weights()
    w1, b1, w2, b2 = w1_val, b1_val, w2_val, b2_val

    base_model_layer = built_model.layers[0]
    extractor = tf.keras.Model(
        inputs=base_model_layer.inputs,
        # Output both the Grad-CAM layer AND the gap input layer
        outputs=[base_model_layer.get_layer(LAST_CONV_LAYER).output, base_model_layer.output],
    )

    logger.info("Model ready.")
    # We no longer need to return top_layers since we do it mathematically
    return built_model, extractor


@app.on_event("startup")
def on_startup():
    global model, feature_extractor
    try:
        model, feature_extractor = load_model()
    except Exception:
        logger.exception("Failed to load model at startup")
        # Leave model as None; /health and /predict will report the outage
        # instead of crashing the whole process.


# --------------------------------------------------------------------------
# Inference helpers
# --------------------------------------------------------------------------
def get_heatmap(img_array: np.ndarray) -> np.ndarray:
    # Run forward pass through feature extractor ONLY (returns numpy arrays or tensors)
    # We use .predict to avoid adding to the graph
    outputs = feature_extractor.predict(img_array, verbose=0)
    conv_outputs = outputs[0]  # shape (1, 7, 7, 2048)
    gap_input = outputs[1]     # shape (1, 7, 7, 2048)
    
    # 1. Manual Global Average Pooling
    gap = np.mean(gap_input, axis=(1, 2))  # shape (1, 2048)
    
    # 2. Manual Dense(512) + ReLU
    h_pre = np.dot(gap, w1) + b1  # shape (1, 512)
    
    # 3. Calculate mathematically exact gradient of the pre-sigmoid logit
    # w.r.t the h_pre activations: derivative of ReLU is (h_pre > 0)
    v = w2.flatten() * (h_pre[0] > 0).astype(np.float32)  # shape (512,)
    
    # 4. Chain rule: Gradient of logit w.r.t the GAP layer output
    alpha_g = np.dot(w1, v)  # shape (2048,)
    
    # 5. Chain rule: Gradient of logit w.r.t the final conv layer
    # Since GAP averages over 7*7 = 49 spatial locations, the gradient distributes as 1/49
    alpha = alpha_g / 49.0  # shape (2048,)
    
    # 6. Build the heatmap (sum of conv_outputs weighted by alpha)
    # conv_outputs[0] is (7, 7, 2048), alpha is (2048,) -> dot product gives (7, 7)
    heatmap = np.dot(conv_outputs[0], alpha)
    
    # ReLU on the heatmap (keep only positive features)
    heatmap = np.maximum(heatmap, 0)
    
    # Normalize between 0 and 1
    max_val = np.max(heatmap)
    if max_val > 1e-8:
        heatmap = heatmap / max_val
        
    return heatmap


def build_heatmap_overlay(raw_bytes: bytes, heatmap: np.ndarray) -> str:
    nparr = np.frombuffer(raw_bytes, np.uint8)
    original_cv2_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if original_cv2_img is None:
        raise ValueError("Could not decode image for heatmap overlay.")

    heatmap_resized = cv2.resize(heatmap, (original_cv2_img.shape[1], original_cv2_img.shape[0]))
    heatmap_resized = np.uint8(255 * heatmap_resized)
    heatmap_colored = cv2.applyColorMap(heatmap_resized, cv2.COLORMAP_JET)

    superimposed = cv2.addWeighted(original_cv2_img, 0.6, heatmap_colored, 0.4, 0)
    ok, buffer = cv2.imencode(".png", superimposed)
    if not ok:
        raise ValueError("Could not encode heatmap overlay.")

    return base64.b64encode(buffer).decode("utf-8")


# --------------------------------------------------------------------------
# Routes
# --------------------------------------------------------------------------
@app.get("/health")
def health():
    return {
        "status": "ok" if model is not None else "model_unavailable",
        "model_version": MODEL_VERSION,
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded. Try again shortly.")

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{file.content_type}'. Upload a JPEG, PNG, or WEBP image.",
        )

    contents = await file.read()

    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=413, detail=f"File too large ({size_mb:.1f} MB). Max is {MAX_FILE_SIZE_MB} MB.")

    start = time.perf_counter()

    try:
        pil_img = keras_image.load_img(io.BytesIO(contents), target_size=IMG_SIZE)
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read this file as an image. Is it a valid JPEG/PNG?")

    img_array = keras_image.img_to_array(pil_img)
    img_array = np.expand_dims(img_array, axis=0)
    # The model was trained with rescale=1./255, not preprocess_input
    img_array = img_array / 255.0
    try:
        pred_raw = float(model.predict(img_array, verbose=0)[0][0])
    except Exception:
        logger.exception("Model inference failed")
        raise HTTPException(status_code=500, detail="Inference failed. Please retry.")

    logger.info("Raw score: %.4f", pred_raw)

    if pred_raw > PNEUMONIA_THRESHOLD:
        diagnosis = "Pneumonia Detected"
        confidence = pred_raw
    else:
        diagnosis = "Normal"
        confidence = 1.0 - pred_raw

    try:
        heatmap = get_heatmap(img_array)
        heatmap_base64 = build_heatmap_overlay(contents, heatmap)
    except Exception:
        logger.exception("Grad-CAM generation failed")
        raise HTTPException(status_code=500, detail="Diagnosis succeeded but heatmap generation failed.")

    inference_ms = round((time.perf_counter() - start) * 1000, 1)

    return {
        "diagnosis": diagnosis,
        "confidence": confidence,
        "probability_pneumonia": pred_raw,
        "probability_normal": 1.0 - pred_raw,
        "heatmap_image": heatmap_base64,
        "model_version": MODEL_VERSION,
        "inference_ms": inference_ms,
    }
