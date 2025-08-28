import { useState } from "react";

export default function SymbolForm({ onSubmit }) {
  const [symbol, setSymbol] = useState("AAPL");
  const [fromDate, setFromDate] = useState("2018-01-01");
  const [toDate, setToDate] = useState("2025-07-15");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(symbol, fromDate, toDate);
  };

  return (
    <form onSubmit={handleSubmit} className="space-x-4 p-4 bg-white rounded shadow">
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Symbol"
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Detect
      </button>
    </form>
  );
}
