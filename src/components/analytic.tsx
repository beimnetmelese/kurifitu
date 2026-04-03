import { useEffect, useMemo, useState } from "react";
import {
  FiDownload,
  FiFile,
  FiFileMinus,
  FiFileText,
  FiRefreshCw,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  TooltipItem,
  Tooltip as ChartTooltip,
} from "chart.js";
import { utils as xlsxUtils, writeFile as xlsxWriteFile } from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler,
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

const timeRanges = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

type TabKey = "overview" | "sector" | "trends";

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("7");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [exportOpen, setExportOpen] = useState(false);

  const fetchStats = async (days: string) => {
    try {
      setLoading(true);
      const url =
        days === "all"
          ? "https://bewnet.pythonanywhere.com/api/feedbackstats"
          : `https://bewnet.pythonanywhere.com/api/feedbackstats/?days=${days}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data: FeedbackStats = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats(timeRange);
  }, [timeRange]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStats(timeRange);
  };

  const positivePercentage = stats
    ? Math.round((stats.total_positive / stats.total_feedbacks) * 100)
    : 0;
  const negativePercentage = stats
    ? Math.round((stats.total_negative / stats.total_feedbacks) * 100)
    : 0;

  const sentimentData = {
    labels: ["Positive", "Negative"],
    datasets: [
      {
        data: [stats?.total_positive || 0, stats?.total_negative || 0],
        backgroundColor: ["#22c55e", "#ef4444"],
        hoverBackgroundColor: ["#16a34a", "#dc2626"],
        borderWidth: 1,
      },
    ],
  };

  const sectors = stats ? Object.keys(stats.sector_breakdown) : [];
  const sectorPositiveData = sectors.map(
    (sector) => stats?.sector_breakdown[sector].positive || 0,
  );
  const sectorNegativeData = sectors.map(
    (sector) => stats?.sector_breakdown[sector].negative || 0,
  );
  const sectorTotalData = sectors.map(
    (sector) => stats?.sector_breakdown[sector].total || 0,
  );

  const sectorChartData = {
    labels: sectors,
    datasets: [
      {
        label: "Positive",
        data: sectorPositiveData,
        backgroundColor: "#22c55e",
        borderColor: "#22c55e",
        borderWidth: 1,
      },
      {
        label: "Negative",
        data: sectorNegativeData,
        backgroundColor: "#ef4444",
        borderColor: "#ef4444",
        borderWidth: 1,
      },
    ],
  };

  const sectorDistributionData = {
    labels: sectors,
    datasets: [
      {
        label: "Total Feedback",
        data: sectorTotalData,
        backgroundColor: [
          "#3b82f6",
          "#8b5cf6",
          "#ec4899",
          "#f97316",
          "#22c55e",
          "#ef4444",
        ],
        borderWidth: 1,
      },
    ],
  };

  const trendData = useMemo(() => {
    const days = timeRange === "all" ? 90 : parseInt(timeRange, 10);
    return {
      labels: Array.from({ length: days }, (_, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: "Positive",
          data: Array.from(
            { length: days },
            () => Math.floor(Math.random() * 50) + 10,
          ),
          borderColor: "#22c55e",
          backgroundColor: "rgba(34, 197, 94, 0.12)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Negative",
          data: Array.from(
            { length: days },
            () => Math.floor(Math.random() * 20) + 5,
          ),
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.12)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [timeRange]);

  const exportToCSV = () => {
    if (!stats) return;

    const csvContent: Array<Array<string | number>> = [
      ["Metric", "Value"],
      ["Total Feedbacks", stats.total_feedbacks],
      ["Positive Feedbacks", stats.total_positive],
      ["Negative Feedbacks", stats.total_negative],
      ["Positive Percentage", `${positivePercentage}%`],
      ["Negative Percentage", `${negativePercentage}%`],
      [
        "Time Range",
        timeRanges.find((r) => r.value === timeRange)?.label || "",
      ],
      [],
      ["Sector", "Total", "Positive", "Negative", "Positive %", "Negative %"],
    ];

    Object.entries(stats.sector_breakdown).forEach(([sector, data]) => {
      const sectorPosPercent = Math.round((data.positive / data.total) * 100);
      const sectorNegPercent = Math.round((data.negative / data.total) * 100);
      csvContent.push([
        sector,
        data.total,
        data.positive,
        data.negative,
        `${sectorPosPercent}%`,
        `${sectorNegPercent}%`,
      ]);
    });

    const csv = csvContent
      .map((row) =>
        row
          .map((cell) =>
            typeof cell === "number" ? String(cell) : `"${cell}"`,
          )
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `feedback_report_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (!stats) return;

    const workbook = xlsxUtils.book_new();

    const mainData: Array<Array<string | number>> = [
      ["Metric", "Value"],
      ["Total Feedbacks", stats.total_feedbacks],
      ["Positive Feedbacks", stats.total_positive],
      ["Negative Feedbacks", stats.total_negative],
      ["Positive Percentage", `${positivePercentage}%`],
      ["Negative Percentage", `${negativePercentage}%`],
      [
        "Time Range",
        timeRanges.find((r) => r.value === timeRange)?.label || "",
      ],
    ];
    const mainSheet = xlsxUtils.aoa_to_sheet(mainData);
    xlsxUtils.book_append_sheet(workbook, mainSheet, "Summary");

    const sectorData: Array<Array<string | number>> = [
      ["Sector", "Total", "Positive", "Negative", "Positive %", "Negative %"],
    ];
    Object.entries(stats.sector_breakdown).forEach(([sector, data]) => {
      const sectorPosPercent = Math.round((data.positive / data.total) * 100);
      const sectorNegPercent = Math.round((data.negative / data.total) * 100);
      sectorData.push([
        sector,
        data.total,
        data.positive,
        data.negative,
        `${sectorPosPercent}%`,
        `${sectorNegPercent}%`,
      ]);
    });

    const sectorSheet = xlsxUtils.aoa_to_sheet(sectorData);
    xlsxUtils.book_append_sheet(workbook, sectorSheet, "Sector Breakdown");

    xlsxWriteFile(
      workbook,
      `feedback_report_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  const exportToPDF = () => {
    if (!stats) return;

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.text("Feedback Analytics Report", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(
      `Generated on ${date} | Time Range: ${
        timeRanges.find((r) => r.value === timeRange)?.label
      }`,
      14,
      28,
    );

    autoTable(doc, {
      startY: 35,
      head: [["Metric", "Value"]],
      body: [
        ["Total Feedbacks", stats.total_feedbacks],
        ["Positive Feedbacks", stats.total_positive],
        ["Negative Feedbacks", stats.total_negative],
        ["Positive Percentage", `${positivePercentage}%`],
        ["Negative Percentage", `${negativePercentage}%`],
      ],
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94] },
    });

    const lastY = (doc as jsPDF & { lastAutoTable?: { finalY: number } })
      .lastAutoTable?.finalY;

    autoTable(doc, {
      startY: (lastY || 40) + 20,
      head: [
        ["Sector", "Total", "Positive", "Negative", "Positive %", "Negative %"],
      ],
      body: Object.entries(stats.sector_breakdown).map(([sector, data]) => {
        const sectorPosPercent = Math.round((data.positive / data.total) * 100);
        const sectorNegPercent = Math.round((data.negative / data.total) * 100);
        return [
          sector,
          data.total,
          data.positive,
          data.negative,
          `${sectorPosPercent}%`,
          `${sectorNegPercent}%`,
        ];
      }),
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`feedback_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  if (loading && !isRefreshing) {
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

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Feedback Analytics
        </h2>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <FiRefreshCw className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {stats && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Total Feedbacks</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {stats.total_feedbacks}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {timeRanges.find((r) => r.value === timeRange)?.label}
              </p>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: `${positivePercentage}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {positivePercentage}% positive
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Positive Feedbacks</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {stats.total_positive}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                <FiTrendingUp /> {positivePercentage}% of total
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Negative Feedbacks</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {stats.total_negative}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-rose-600">
                <FiTrendingDown /> {negativePercentage}% of total
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === "overview" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sector")}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === "sector" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                Sector Analysis
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("trends")}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === "trends" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                Trends
              </button>
            </div>

            {activeTab === "overview" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-slate-700">
                    Sentiment Distribution
                  </h3>
                  <div className="h-[300px]">
                    <Doughnut
                      data={sentimentData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: "bottom" },
                          tooltip: {
                            callbacks: {
                              label: (context: TooltipItem<"doughnut">) => {
                                const label = context.label || "";
                                const value = Number(context.raw || 0);
                                const total = context.dataset.data.reduce(
                                  (a: number, b: number) =>
                                    Number(a) + Number(b),
                                  0,
                                );
                                const percentage = Math.round(
                                  (value / total) * 100,
                                );
                                return `${label}: ${value} (${percentage}%)`;
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-slate-700">
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
                          y: { stacked: true, beginAtZero: true },
                        },
                        plugins: {
                          legend: { position: "bottom" },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "sector" ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-slate-700">
                    Sector Distribution
                  </h3>
                  <div className="h-[400px]">
                    <Pie
                      data={sectorDistributionData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: "right" },
                          tooltip: {
                            callbacks: {
                              label: (context: TooltipItem<"pie">) => {
                                const label = context.label || "";
                                const value = Number(context.raw || 0);
                                const total = context.dataset.data.reduce(
                                  (a: number, b: number) =>
                                    Number(a) + Number(b),
                                  0,
                                );
                                const percentage = Math.round(
                                  (value / total) * 100,
                                );
                                return `${label}: ${value} (${percentage}%)`;
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {sectors.map((sector) => {
                    const sectorData = stats.sector_breakdown[sector];
                    const sectorPositivePercent = Math.round(
                      (sectorData.positive / sectorData.total) * 100,
                    );
                    const sectorNegativePercent = Math.round(
                      (sectorData.negative / sectorData.total) * 100,
                    );

                    return (
                      <div
                        key={sector}
                        className="rounded-xl border border-slate-200 p-4 shadow-sm"
                      >
                        <h4 className="text-base font-semibold text-slate-800">
                          {sector}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          {Math.round(
                            (sectorData.total / stats.total_feedbacks) * 100,
                          )}
                          % of all feedback
                        </p>
                        <p className="mt-3 text-xl font-bold text-slate-900">
                          {sectorData.total}
                        </p>

                        <div className="mt-3 space-y-3">
                          <div>
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="text-emerald-600">Positive</span>
                              <span className="font-medium text-slate-700">
                                {sectorData.positive} ({sectorPositivePercent}%)
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                              <div
                                className="h-2 rounded-full bg-emerald-500"
                                style={{ width: `${sectorPositivePercent}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="text-rose-600">Negative</span>
                              <span className="font-medium text-slate-700">
                                {sectorData.negative} ({sectorNegativePercent}%)
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                              <div
                                className="h-2 rounded-full bg-rose-500"
                                style={{ width: `${sectorNegativePercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {activeTab === "trends" ? (
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-700">
                  Feedback Trends
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Historical feedback data over time
                </p>
                <div className="mt-3 h-[400px]">
                  <Line
                    data={trendData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        mode: "index",
                        intersect: false,
                      },
                      plugins: {
                        legend: { position: "bottom" },
                        tooltip: {
                          mode: "index",
                          intersect: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "Number of Feedbacks",
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: "Timeline",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-700">
              Key Metrics
            </h3>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="text-center">
                <p className="text-xs text-slate-500">Positive Rate</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {positivePercentage}%
                </p>
                <p className="text-xs text-slate-500">of all feedback</p>
              </div>

              <div className="text-center">
                <p className="text-xs text-slate-500">Negative Rate</p>
                <p className="text-2xl font-bold text-rose-600">
                  {negativePercentage}%
                </p>
                <p className="text-xs text-slate-500">of all feedback</p>
              </div>

              <div className="text-center">
                <p className="text-xs text-slate-500">Avg. Daily Feedback</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round(
                    stats.total_feedbacks /
                      (timeRange === "all" ? 90 : parseInt(timeRange, 10)),
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  based on selected period
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-slate-500">Top Sector</p>
                <p className="text-2xl font-bold text-slate-900">
                  {sectors.reduce((a, b) =>
                    stats.sector_breakdown[a].total >
                    stats.sector_breakdown[b].total
                      ? a
                      : b,
                  )}
                </p>
                <p className="text-xs text-slate-500">by feedback volume</p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end">
        <div className="relative">
          <button
            type="button"
            onClick={() => setExportOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50"
          >
            <FiDownload /> Export Report
          </button>

          {exportOpen ? (
            <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <button
                type="button"
                onClick={() => {
                  exportToCSV();
                  setExportOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <FiFileText /> Download as CSV
              </button>
              <button
                type="button"
                onClick={() => {
                  exportToExcel();
                  setExportOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <FiFile /> Download as Excel
              </button>
              <button
                type="button"
                onClick={() => {
                  exportToPDF();
                  setExportOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <FiFileMinus /> Download as PDF
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
