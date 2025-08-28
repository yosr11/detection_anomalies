from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.schemas import StockRequest
from app.model_loader import load_lstm_model
from app.anomaly_detector import detect_anomalies
from app.charts_generator import generate_all_charts, save_plot_anomalies

app = FastAPI(title="Anomaly Detection API")

# Autoriser CORS pour le frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # adapte selon ton frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Charger le modèle au démarrage
model = load_lstm_model()

# Exposer le dossier "output" pour les images
app.mount("/output", StaticFiles(directory="output"), name="output")

# Générer les graphiques au démarrage pour une liste de symboles connus
@app.on_event("startup")
async def startup_event():
    print("🚀 Génération des graphiques en cours...")
    generate_all_charts()

@app.post("/detect")
def detect(request: StockRequest):
    try:
        # Détection des anomalies
        result = detect_anomalies(
            model,
            symbol=request.symbol,
            from_date=request.from_date,
            to_date=request.to_date
        )

        # Génération dynamique de la courbe pour n'importe quel symbole
        save_plot_anomalies(
            dates=result["dates"],
            close_prices=result["close_prices"],
            anomaly_flags=result["anomaly_flags"],
            symbol=result["symbol"],
            output_dir="output"
        )

        return {
            "symbol": request.symbol,
            "image_url": f"/output/anomalies_{request.symbol}.png",
            "anomaly_count": result.get("anomalies_detected", 0)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
