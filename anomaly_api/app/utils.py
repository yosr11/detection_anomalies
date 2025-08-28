import numpy as np
from sklearn.preprocessing import MinMaxScaler

def normalize_close_column(df):
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(df[['close']]).flatten()
    return scaled, scaler

def create_sequences(data, window_size):
    return np.array([
        data[i:i+window_size] for i in range(len(data) - window_size)
    ], dtype=np.float32)

def calculate_reconstruction_errors(model, sequences):
    reconstructed = model.predict(sequences, verbose=0)
    mse = np.mean(np.square(sequences - reconstructed), axis=(1, 2))
    return mse
