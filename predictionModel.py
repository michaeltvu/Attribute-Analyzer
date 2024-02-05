import tensorflow as tf
import tensorflow.keras as keras
import matplotlib.pyplot as plt
import numpy as np
import os

class Model:
    def __init__(self, model_filepath):
        self.model = keras.models.load_model(model_filepath)
    
    def load_and_process_image(self, img_name):
        full_path = img_name
        image = tf.io.read_file(full_path)
        image = tf.io.decode_jpeg(contents=image, channels=3)
        image = tf.cast(image, tf.float32)
        image = tf.divide(image, 255.)
        image = tf.image.resize(image, size=(112, 112))
        return image
    
    def get_label_string(self, label):
        attributes = ['5_o_Clock_Shadow', 'Arched_Eyebrows', 'Attractive', 'Bags_Under_Eyes', 'Bald', 'Bangs', 'Big_Lips', 'Big_Nose', 'Black_Hair', 'Blond_Hair', 'Blurry', 'Brown_Hair', 'Bushy_Eyebrows', 'Chubby', 'Double_Chin', 'Eyeglasses', 'Goatee', 'Gray_Hair', 'Heavy_Makeup', 'High_Cheekbones', 'Male', 'Mouth_Slightly_Open', 'Mustache', 'Narrow_Eyes', 'No_Beard', 'Oval_Face', 'Pale_Skin', 'Pointy_Nose', 'Receding_Hairline', 'Rosy_Cheeks', 'Sideburns', 'Smiling', 'Straight_Hair', 'Wavy_Hair', 'Wearing_Earrings', 'Wearing_Hat', 'Wearing_Lipstick', 'Wearing_Necklace', 'Wearing_Necktie', 'Young']
        true_label = np.array(attributes)[label==1]
        return ', '.join(true_label)

    def plot_prediction(self, image, preds):
        _ = plt.figure(figsize=(4, 4))
        print('-----------------------')
        print('Predicted Attributes:', self.get_label_string(preds[0]))
        plt.imshow(image)
        plt.xticks([])
        plt.yticks([])
        plt.show()
        print('-----------------------')

    def predict(self, imagename):
        threshold = 0.4

        image = self.load_and_process_image(imagename)
        image = np.reshape(image, (1, 112, 112, 3))

        # Predicting Labels
        preds = self.model.predict(image)

        preds[preds >= threshold] = 1
        preds[preds < threshold] = 0

        return(preds[0].tolist(), self.get_label_string(preds[0]))