import { useEffect, useState } from "react";
import {
  FiClock,
  FiMessageSquare,
  FiThumbsDown,
  FiThumbsUp,
} from "react-icons/fi";

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

  useEffect(() => {
    const url = "http://127.0.0.1:8000/";
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
    </div>
  );
};

export default FeedbackList;
