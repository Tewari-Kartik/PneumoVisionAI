import numpy as np
from tensorflow.keras.preprocessing import image as keras_image
from keras.applications.resnet50 import preprocess_input
import keras

MODEL_PATH = "best_pneumonia_model.h5"

print("Loading full model...")
try:
    model = keras.models.load_model(MODEL_PATH)
    print("Model loaded successfully!")
    model.summary()
    
    normal_img_path = "../frontend/public/samples/normal.png"
    pneumonia_img_path = "../frontend/public/samples/pneumonia.png"
    
    def test_image(img_path, preprocess_type):
        pil_img = keras_image.load_img(img_path, target_size=(224, 224))
        img_array = keras_image.img_to_array(pil_img)
        img_array = np.expand_dims(img_array, axis=0)
        
        if preprocess_type == 'resnet':
            img_array = preprocess_input(img_array.copy())
        elif preprocess_type == 'rescale':
            img_array = img_array.copy() / 255.0
            
        pred = model.predict(img_array, verbose=0)[0][0]
        return pred

    print("Normal Image (ResNet Preprocess):", test_image(normal_img_path, 'resnet'))
    print("Normal Image (1/255 Rescale):", test_image(normal_img_path, 'rescale'))
    print("Pneumonia Image (ResNet Preprocess):", test_image(pneumonia_img_path, 'resnet'))
    print("Pneumonia Image (1/255 Rescale):", test_image(pneumonia_img_path, 'rescale'))

except Exception as e:
    print("Failed to load full model:", e)
