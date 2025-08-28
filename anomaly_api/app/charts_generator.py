import os
import matplotlib.pyplot as plt
from app.anomaly_detector import detect_anomalies
from app.model_loader import load_lstm_model
import numpy as np
import pandas as pd
import matplotlib.dates as mdates
from datetime import datetime 

# Liste fixe des symboles à générer au démarrage
symbols = ["AAPL", "TSLA", "MSFT", "META", "ORA.PA", "AMZN", "AIR.PA", "GOOGL"]

# Dossier de sortie des courbes
OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def save_plot_anomalies(dates, close_prices, anomaly_flags, symbol, output_dir):
    """
    Affiche et sauvegarde la courbe des prix avec les anomalies détectées
    """
    plt.figure(figsize=(14, 6))

    if isinstance(dates[0], str) or not isinstance(dates[0], (pd.Timestamp, datetime)):
        dates = pd.to_datetime(dates)

    dates = np.array(dates)
    close_prices = np.array(close_prices)
    anomaly_flags = np.array(anomaly_flags)

    plt.plot(dates, close_prices, label='Close Price', color='blue', linewidth=1)

    if np.any(anomaly_flags):
        plt.scatter(dates[anomaly_flags], close_prices[anomaly_flags],
                    color='red', label='Anomalies détectées', s=30, zorder=5)

    plt.xlabel('Date')
    plt.ylabel('Close Price')
    plt.title(f"Détection d'anomalies - {symbol}")
    plt.legend()
    plt.grid(True, alpha=0.3)

    ax = plt.gca()
    ax.xaxis.set_major_locator(mdates.YearLocator())
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
    plt.setp(ax.xaxis.get_majorticklabels(), rotation=45, ha='right')

    plt.tight_layout()
    filename = os.path.join(output_dir, f"anomalies_{symbol}.png")
    plt.savefig(filename, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"📁 Courbe enregistrée : {filename}")

def generate_all_charts():
    print("🚀 Génération des courbes d'anomalies...")
    model = load_lstm_model()

    for symbol in symbols:
        try:
            print(f"🔍 Analyse de {symbol}...")
            result = detect_anomalies(
                model=model,
                symbol=symbol,
                from_date="2018-01-01",
                to_date="2025-07-15"
            )
            num_anomalies = int(np.sum(result["anomaly_flags"]))
            print(f"📊 {symbol} → {num_anomalies} anomalies détectées")

            save_plot_anomalies(
                result["dates"],
                result["close_prices"],
                result["anomaly_flags"],
                result["symbol"],
                OUTPUT_DIR
            )

        except Exception as e:
            print(f"❌ Erreur pour {symbol} : {e}")
