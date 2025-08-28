import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // ou l'URL de ton backend
});

export const detectAnomalies = async (symbol, from_date, to_date) => {
  const response = await api.post("/detect", {
    symbol,
    from_date,
    to_date,
  });
  return response.data;
};
