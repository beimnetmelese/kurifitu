import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

type OccupancyChartPoint = {
  date?: string;
  day?: string;
  occupancy?: number;
  predicted?: number;
};

type OccupancyChartProps = {
  data?: OccupancyChartPoint[];
};

export default function OccupancyChart({ data = [] }: OccupancyChartProps) {
  const chartData = data.map((point) => ({
    date: point.date || point.day || "N/A",
    occupancy: Number(point.occupancy ?? point.predicted ?? 0),
  }));

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Forecast view
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Predicted Occupancy
          </h2>
        </div>
        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
          Live trend
        </span>
      </div>
      <div className="mt-5 h-[340px]">
        <Line
          data={{
            labels: chartData.map((point) => point.date),
            datasets: [
              {
                label: "Occupancy",
                data: chartData.map((point) => point.occupancy),
                borderColor: "#0f766e",
                backgroundColor: "rgba(15, 118, 110, 0.12)",
                borderWidth: 3,
                tension: 0.35,
                fill: true,
                pointRadius: 4,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context: TooltipItem<"line">) =>
                    `${context.parsed.y}%`,
                },
              },
            },
            scales: {
              y: {
                min: 0,
                max: 100,
                ticks: {
                  callback: (value) => `${value}%`,
                  color: "#64748b",
                },
                grid: { color: "#dbe4e8" },
              },
              x: {
                ticks: { color: "#64748b" },
                grid: { color: "#eef2f7" },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
