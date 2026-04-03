import { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
);

type FeedbackStats = {
  total_feedbacks: number;
  total_positive: number;
  total_negative: number;
  sector_breakdown: {
    [sector: string]: {
      total: number;
      positive: number;
      negative: number;
    };
  };
};

type Feedback = {
  id: number;
  feedback_text: string;
  feedback_type: string;
  feedback_time: string;
  sector: string | null;
};

const Dashboard = () => {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = "https://bewnet.pythonanywhere.com/";
    const fetchData = async () => {
      try {
        setLoading(true);

        const statsResponse = await fetch(url + "api/feedbackstats/?days=7");
        if (!statsResponse.ok) throw new Error("Failed to fetch stats");
        const statsData: FeedbackStats = await statsResponse.json();
        setStats(statsData);

        const feedbacksResponse = await fetch(url + "api/feedback");
        if (!feedbacksResponse.ok) throw new Error("Failed to fetch feedbacks");
        const feedbacksData: Feedback[] = await feedbacksResponse.json();
        setFeedbacks(feedbacksData);

        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
        No data available
      </div>
    );
  }

  const sentimentData = {
    labels: ["Positive", "Negative"],
    datasets: [
      {
        data: [stats.total_positive, stats.total_negative],
        backgroundColor: ["#22c55e", "#ef4444"],
        hoverBackgroundColor: ["#16a34a", "#dc2626"],
      },
    ],
  };

  const sectors = Object.keys(stats.sector_breakdown);
  const sectorPositiveData = sectors.map(
    (sector) => stats.sector_breakdown[sector].positive,
  );
  const sectorNegativeData = sectors.map(
    (sector) => stats.sector_breakdown[sector].negative,
  );

  const sectorChartData = {
    labels: sectors,
    datasets: [
      {
        label: "Positive",
        data: sectorPositiveData,
        backgroundColor: "#22c55e",
      },
      {
        label: "Negative",
        data: sectorNegativeData,
        backgroundColor: "#ef4444",
      },
    ],
  };

  const lastSevenDays = [
    "Day 1",
    "Day 2",
    "Day 3",
    "Day 4",
    "Day 5",
    "Day 6",
    "Day 7",
  ];
  const lastSevenDaysPositive = [12, 19, 15, 8, 12, 10, 9];
  const lastSevenDaysNegative = [4, 3, 5, 7, 2, 5, 4];

  const trendData = {
    labels: lastSevenDays,
    datasets: [
      {
        label: "Positive",
        data: lastSevenDaysPositive,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.1,
        fill: true,
      },
      {
        label: "Negative",
        data: lastSevenDaysNegative,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-6 p-1">
      <h2 className="text-2xl font-bold text-emerald-600">
        Feedback Dashboard
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Feedbacks</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {stats.total_feedbacks}
          </p>
          <p className="text-xs text-slate-500">Today</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <p className="text-sm text-emerald-700">Positive Feedbacks</p>
          <p className="mt-1 text-3xl font-bold text-emerald-800">
            {stats.total_positive}
          </p>
          <p className="text-xs text-emerald-700">
            {((stats.total_positive / stats.total_feedbacks) * 100).toFixed(1)}%
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
          <p className="text-sm text-rose-700">Negative Feedbacks</p>
          <p className="mt-1 text-3xl font-bold text-rose-800">
            {stats.total_negative}
          </p>
          <p className="text-xs text-rose-700">
            {((stats.total_negative / stats.total_feedbacks) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-base font-semibold text-slate-800">
            Feedback Sentiment
          </h3>
          <div className="h-[300px]">
            <Pie
              data={sentimentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom" },
                },
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-base font-semibold text-slate-800">
            Feedback by Sector
          </h3>
          <div className="h-[300px]">
            <Bar
              data={sectorChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { stacked: true },
                  y: { stacked: true },
                },
                plugins: {
                  legend: { position: "bottom" },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-slate-800">
          Feedback Trend (Last 7 Days)
        </h3>
        <div className="h-[300px]">
          <Line
            data={trendData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom" },
              },
            }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-slate-800">
          Recent Feedbacks
        </h3>
        {feedbacks.length === 0 ? (
          <p className="text-sm text-slate-500">
            No recent feedbacks available
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className={`rounded-xl border p-3 ${feedback.feedback_type.toLowerCase() === "positive" ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <p
                    className={`text-sm font-semibold ${feedback.feedback_type.toLowerCase() === "positive" ? "text-emerald-800" : "text-rose-800"}`}
                  >
                    {feedback.feedback_type}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(feedback.feedback_time).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-slate-800">
                  {feedback.feedback_text}
                </p>
                {feedback.sector ? (
                  <p className="mt-2 text-xs text-slate-500">
                    Sector: {feedback.sector}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
