import urllib.request
import numpy as np
from tensorflow.keras.preprocessing import image as keras_image
import keras
import os

url = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Chest_Xray_PA_3-8-2010.png/800px-Chest_Xray_PA_3-8-2010.png"
filename = "wiki_normal.png"
urllib.request.urlretrieve(url, filename)

model = keras.models.load_model("best_pneumonia_model.h5")

pil_img = keras_image.load_img(filename, target_size=(224, 224))
img_array = keras_image.img_to_array(pil_img)
img_array = np.expand_dims(img_array, axis=0)
img_array = img_array / 255.0

pred = model.predict(img_array, verbose=0)[0][0]
print(f"Wikimedia Normal X-ray Score: {pred}")
