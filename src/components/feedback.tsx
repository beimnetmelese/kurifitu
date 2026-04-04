import { useEffect, useState } from "react";
import {
  FiAward,
  FiClock,
  FiMessageSquare,
  FiTrendingUp,
  FiThumbsDown,
  FiThumbsUp,
} from "react-icons/fi";
import { generateFeedbackExecutiveAnalysis } from "../services/groqApi";

type Feedback = {
  id: number;
  feedback_text: string;
  feedback_type: "positive" | "negative";
  feedback_time: string;
  sector: string | null;
};

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "positive" | "negative">("ALL");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisFocus, setAnalysisFocus] = useState("");

  useEffect(() => {
    const url = "https://bewnet.pythonanywhere.com/";
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await fetch(url + "api/feedback");
        if (!response.ok) throw new Error("Failed to fetch feedbacks");
        const data: Feedback[] = await response.json();
        setFeedbacks(data);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    if (filter === "ALL") return true;
    return feedback.feedback_type.toLowerCase() === filter;
  });

  const positiveCount = filteredFeedbacks.filter(
    (item) => item.feedback_type === "positive",
  ).length;
  const negativeCount = filteredFeedbacks.filter(
    (item) => item.feedback_type === "negative",
  ).length;

  const runAiAnalysis = async () => {
    if (filteredFeedbacks.length === 0 || analysisLoading) return;

    setAnalysisLoading(true);
    setAnalysisError(null);

    try {
      const response = await generateFeedbackExecutiveAnalysis(
        filteredFeedbacks.map((entry) => ({
          feedback_text: entry.feedback_text,
          feedback_type: entry.feedback_type,
          feedback_time: entry.feedback_time,
          sector: entry.sector,
        })),
        analysisFocus.trim() || undefined,
      );

      setAnalysisResult(response);
    } catch (analysisErr) {
      setAnalysisError(
        analysisErr instanceof Error
          ? analysisErr.message
          : "Failed to generate AI analysis.",
      );
    } finally {
      setAnalysisLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
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
    <div className="mx-auto max-w-[1400px] space-y-6 p-1">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-emerald-600">
          Customer Feedback
        </h2>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            {filteredFeedbacks.length}{" "}
            {filteredFeedbacks.length === 1 ? "Item" : "Items"}
          </span>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "ALL" | "positive" | "negative")
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
          >
            <option value="ALL">All Feedback</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
          </select>
        </div>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-12 text-center">
          <FiMessageSquare className="mx-auto mb-2 h-8 w-8 text-slate-400" />
          <p className="text-base text-slate-500">
            No feedback found matching your criteria
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredFeedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className={`flex h-full flex-col rounded-xl border-l-4 border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${feedback.feedback_type.toLowerCase() === "positive" ? "border-l-emerald-500 border-emerald-100" : "border-l-rose-500 border-rose-100"}`}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${feedback.feedback_type.toLowerCase() === "positive" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                >
                  {feedback.feedback_type.toLowerCase() === "positive" ? (
                    <FiThumbsUp />
                  ) : (
                    <FiThumbsDown />
                  )}
                  {feedback.feedback_type}
                </span>

                {feedback.sector ? (
                  <span className="max-w-[120px] truncate rounded-full border border-sky-200 px-2 py-1 text-xs text-sky-700">
                    {feedback.sector}
                  </span>
                ) : null}
              </div>

              <p className="flex-1 text-sm leading-relaxed text-slate-800">
                {feedback.feedback_text}
              </p>

              <p className="mt-3 inline-flex items-center gap-1 text-xs text-slate-500">
                <FiClock />
                {new Date(feedback.feedback_time).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-white shadow-[0_20px_55px_rgba(15,23,42,0.24)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(52,211,153,0.2),transparent_28%)]" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
                <FiAward className="h-4 w-4" />
                AI Insight Brief
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                Kurifitu Go Feedback Intelligence
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                Get a structured paragraph brief with summary, positives, risks,
                and actionable recommendations.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm">
              <FiTrendingUp className="h-4 w-4 text-cyan-200" />
              <span>{positiveCount} positive</span>
              <span className="text-slate-400">/</span>
              <span>{negativeCount} negative</span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
            <input
              value={analysisFocus}
              onChange={(event) => setAnalysisFocus(event.target.value)}
              placeholder="Optional focus for AI (e.g., service speed, room comfort, breakfast quality)"
              className="h-11 rounded-xl border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-slate-300 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/35"
            />
            <button
              type="button"
              onClick={runAiAnalysis}
              disabled={analysisLoading || filteredFeedbacks.length === 0}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-5 text-sm font-semibold text-slate-950 shadow-[0_16px_36px_rgba(16,185,129,0.3)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {analysisLoading
                ? "Analyzing feedback..."
                : "Generate AI Analysis"}
            </button>
          </div>

          {analysisError ? (
            <div className="mt-4 rounded-xl border border-rose-200/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {analysisError}
            </div>
          ) : null}

          {analysisResult ? (
            <div className="mt-4 rounded-2xl border border-white/15 bg-slate-900/55 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                AI Executive Summary
              </p>
              <div className="space-y-3 text-sm leading-7 text-slate-100">
                {analysisResult
                  .split(/\n\s*\n/)
                  .filter((paragraph) => paragraph.trim().length > 0)
                  .map((paragraph, index) => (
                    <p key={`${index}-${paragraph.slice(0, 24)}`}>
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default FeedbackList;
