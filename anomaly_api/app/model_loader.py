from tensorflow.keras.models import load_model

def load_lstm_model(path="models/lstm_autoencoder_model.keras"):
    import os
    if not os.path.exists(path):
        raise FileNotFoundError(f"⚠️ Modèle introuvable à {path}")
    return load_model(path)

 
