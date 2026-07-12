import numpy as np
from tensorflow.keras.preprocessing import image as keras_image
from keras.applications.resnet50 import preprocess_input
from keras.models import Sequential
from keras.layers import Dense, GlobalAveragePooling2D, Dropout
from keras.applications import ResNet50

MODEL_PATH = "best_pneumonia_model.h5"

print("Loading model structure...")
base_resnet = ResNet50(weights=None, include_top=False, input_shape=(224, 224, 3))
built_model = Sequential([
    base_resnet,
    GlobalAveragePooling2D(),
    Dense(512, activation="relu"),
    Dropout(0.5),
    Dense(1, activation="sigmoid"),
])

print("Loading weights...")
built_model.load_weights(MODEL_PATH)

# Test with a dummy image (all ones or random)
# Actually let's test with the sample images we have in frontend/public/samples
normal_img_path = "../frontend/public/samples/normal.png"
pneumonia_img_path = "../frontend/public/samples/pneumonia.png"

def test_image(img_path, preprocess_type):
    try:
        pil_img = keras_image.load_img(img_path, target_size=(224, 224))
        img_array = keras_image.img_to_array(pil_img)
        img_array = np.expand_dims(img_array, axis=0)
        
        if preprocess_type == 'resnet':
            img_array = preprocess_input(img_array.copy())
        elif preprocess_type == 'rescale':
            img_array = img_array.copy() / 255.0
            
        pred = built_model.predict(img_array, verbose=0)[0][0]
        return pred
    except Exception as e:
        return str(e)

print("Normal Image (ResNet Preprocess):", test_image(normal_img_path, 'resnet'))
print("Normal Image (1/255 Rescale):", test_image(normal_img_path, 'rescale'))
print("Pneumonia Image (ResNet Preprocess):", test_image(pneumonia_img_path, 'resnet'))
print("Pneumonia Image (1/255 Rescale):", test_image(pneumonia_img_path, 'rescale'))
