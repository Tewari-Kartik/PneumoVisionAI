import io
import base64
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.preprocessing import image as keras_image
from tensorflow.keras.applications.resnet50 import preprocess_input
import uvicorn
import numpy as np
import cv2
import tensorflow as tf

# Using standalone Keras imports to prevent Pylance visual errors
from keras.applications import ResNet50
from keras.models import Sequential
from keras.layers import Dense, GlobalAveragePooling2D, Dropout

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Initialize ResNet50 with 'imagenet' to match Colab's layer topology
base_resnet = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_resnet.trainable = False 

# 2. Rebuild the exact custom top layers you trained
model = Sequential([
    base_resnet,
    GlobalAveragePooling2D(),
    Dense(512, activation='relu'),
    Dropout(0.5),
    Dense(1, activation='sigmoid')
])

# 3. Load your custom weights safely by matching layer names
model.load_weights('best_pneumonia_model.h5')
# 4. Set up the Grad-CAM feature extractor
base_model_layer = model.layers[0]
last_conv_layer_name = 'conv5_block3_out'

feature_extractor = tf.keras.Model(
    inputs=base_model_layer.inputs,
    outputs=[base_model_layer.get_layer(last_conv_layer_name).output, base_model_layer.output]
)
top_layers = model.layers[1:]

def get_heatmap(img_array):
    with tf.GradientTape() as tape:
        conv_outputs, x = feature_extractor(img_array)
        tape.watch(conv_outputs)
        for layer in top_layers:
            x = layer(x)
        preds = x
        class_channel = preds[:, 0]
        
    grads = tape.gradient(class_channel, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    
    # 1. Load exactly like Colab (using PIL/Keras)
    pil_img = keras_image.load_img(io.BytesIO(contents), target_size=(224, 224))
    img_array = keras_image.img_to_array(pil_img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0 # Exact same scaling as your Colab generator
    
    # 2. Get Prediction
    pred_raw = model.predict(img_array, verbose=0)[0][0]
    print(f"DEBUG - Raw Score: {pred_raw}") # Watch this in your terminal!
    
    # 3. Logic based on your {'NORMAL': 0, 'PNEUMONIA': 1} mapping
    if pred_raw > 0.8:
        diagnosis = "Pneumonia Detected"
        confidence = float(pred_raw)
    else:
        diagnosis = "Normal"
        confidence = float(1.0 - pred_raw)
    
    # 4. Prepare Heatmap (using OpenCV for visualization)
    nparr = np.frombuffer(contents, np.uint8)
    original_cv2_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    heatmap = get_heatmap(img_array)
    heatmap_resized = cv2.resize(heatmap, (original_cv2_img.shape[1], original_cv2_img.shape[0]))
    heatmap_resized = np.uint8(255 * heatmap_resized)
    heatmap_colored = cv2.applyColorMap(heatmap_resized, cv2.COLORMAP_JET)
    
    superimposed_img = cv2.addWeighted(original_cv2_img, 0.6, heatmap_colored, 0.4, 0)
    
    _, buffer = cv2.imencode('.png', superimposed_img)
    heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return {
        "diagnosis": diagnosis,
        "confidence": confidence,
        "heatmap_image": heatmap_base64
    }