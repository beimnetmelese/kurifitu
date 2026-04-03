import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getDemandLevel } from '../../utils/getDemandLevel';

function getDemandColor(demand) {
  const level = getDemandLevel(demand);
  if (level === 'High') return '#16a34a';
  if (level === 'Medium') return '#f59e0b';
  return '#ef4444';
}

export default function DemandChart({ data = [] }) {
  const chartData = data.map((item) => {
    const demand = Number(item.demand ?? item.baseDemand ?? 0);
    return {
      roomType: item.roomType || item.name || 'Room',
      demand,
      demandLevel: getDemandLevel(demand),
    };
  });

  return (
    <div className="content-block">
      <h2>Demand Intensity by Room Type</h2>
      <div className="chart-shell">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dbe4e8" />
            <XAxis dataKey="roomType" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              formatter={(value, _name, payload) => [`${value}%`, payload?.payload?.demandLevel || 'Demand']}
            />
            <Bar dataKey="demand" radius={[6, 6, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.roomType} fill={getDemandColor(entry.demand)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
