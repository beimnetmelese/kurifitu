import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function RevenueChart({ data = [] }) {
  const chartData = data.map((item) => ({
    name: item.name || item.label || 'Revenue',
    beforeAI: Number(item.beforeAI ?? item.before ?? 0),
    afterAI: Number(item.afterAI ?? item.after ?? 0),
  }));

  return (
    <div className="content-block">
      <h2>Revenue Before vs After AI</h2>
      <div className="chart-shell">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dbe4e8" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="beforeAI" name="Before AI" fill="#94a3b8" radius={[6, 6, 0, 0]} />
            <Bar dataKey="afterAI" name="After AI" fill="#0f766e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
