import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter
} from "recharts";

export default function AnomalyChart({ data }) {
  const chartData = data.dates.map((date, i) => ({
    date,
    close: data.close_prices[i],
    isAnomaly: data.anomaly_flags[i],
  }));

  return (
    <div className="w-full h-[400px] bg-white rounded shadow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="close" stroke="#8884d8" strokeWidth={2} dot={false} />
          <Scatter
            data={chartData.filter((d) => d.isAnomaly)}
            fill="red"
            shape="circle"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
