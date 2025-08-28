import numpy as np
import requests
import pandas as pd
from app.utils import normalize_close_column, create_sequences, calculate_reconstruction_errors

def detect_anomalies(model, symbol, from_date, to_date, window_size=10):
    url = f"https://financialmodelingprep.com/api/v3/technical_indicator/daily/{symbol}"
    params = {
        "type": "standardDeviation",
        "period": 10,
        "from": from_date,
        "to": to_date,
        "apikey": "016fd8297eb7a8be6bc3fdf9cc65240d"
    }

    response = requests.get(url, params=params)
    data = response.json()

    if not isinstance(data, list) or len(data) == 0:
        raise Exception(f"Aucune donnée valide pour {symbol}")

    df = pd.DataFrame(data)
    df['close'] = pd.to_numeric(df['close'], errors='coerce')
    df = df.dropna(subset=['close']).sort_values('date')
    df['date'] = pd.to_datetime(df['date'])

    if len(df) < window_size + 1:
        raise Exception(f"Pas assez de données pour {symbol}")

    normalized, _ = normalize_close_column(df)
    sequences = create_sequences(normalized, window_size).reshape((-1, window_size, 1))
    errors = calculate_reconstruction_errors(model, sequences)
    threshold = np.mean(errors) + 2 * np.std(errors)
    anomalies = errors > threshold

    aligned_dates = df['date'].iloc[window_size:].astype(str).tolist()
    aligned_closes = df['close'].iloc[window_size:].tolist()

    return {
        "symbol": symbol,
        "threshold": float(threshold),
        "anomalies_detected": int(np.sum(anomalies)),
        "dates": aligned_dates,
        "close_prices": aligned_closes,
        "anomaly_flags": anomalies.tolist()
    }
