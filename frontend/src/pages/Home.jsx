import React, { useState } from "react";
import {
  TrendingUp,
  Search,
  Calendar,
  AlertTriangle,
  BarChart3,
  Download,
  Zap,
} from "lucide-react";
import { detectAnomalies } from "../services/api"; // appel réel API FastAPI

const Home = () => {
  const [symbol, setSymbol] = useState("AAPL");
  const [fromDate, setFromDate] = useState("2018-01-01");
  const [toDate, setToDate] = useState("2025-07-15");
  const [imageUrl, setImageUrl] = useState(null);
  const [anomalyCount, setAnomalyCount] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const popularSymbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "META"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setImageUrl(null);
    setAnomalyCount(null);
    setLoading(true);

    try {
      const result = await detectAnomalies(symbol, fromDate, toDate);
      setImageUrl(`http://localhost:8000${result.image_url}`);
      setAnomalyCount(result.anomaly_count);
    } catch (err) {
      console.error("Erreur API:", err);
      setError("Erreur lors de la détection des anomalies. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-slate-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4 animate-pulse">
            Détecteur d'Anomalies
          </h1>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 mb-8 transform hover:scale-105 transition-all duration-300">
            {/* Symbol Buttons */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-400" />
                Symboles populaires
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSymbols.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => setSymbol(sym)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      symbol === sym
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Symbol Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Symbole boursier
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:bg-white/15"
                      placeholder="Ex: AAPL"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <BarChart3 className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" />
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/15"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/15"
                    required
                  />
                </div>
              </div>

              {/* Button */}
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Détecter les Anomalies
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 backdrop-blur-lg border border-red-500/20 rounded-2xl p-6 mb-8 animate-pulse">
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
                <p className="text-red-300 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {imageUrl && (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 opacity-0 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-emerald-400" />
                  Résultats de l'analyse - {symbol}
                </h2>
                <a
                  href={imageUrl}
                  download={`anomalies_${symbol}.png`}
                  className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 hover:text-white transition-all duration-200 hover:scale-105"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </a>
              </div>

              <img
                src={imageUrl}
                alt={`Anomalies ${symbol}`}
                className="w-full rounded-xl shadow-lg"
              />

              {anomalyCount !== null && (
                <div className="mt-6 text-center text-white text-xl font-semibold">
                  📌 Nombre d'anomalies détectées :{" "}
                  <span className="text-blue-400">{anomalyCount}</span>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Footer */}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Home;