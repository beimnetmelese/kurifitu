import { useEffect, useState, type FormEvent } from "react";
import {
  fetchSentimentInsights,
  sendFeedback,
  type SentimentInsight,
  type SentimentLabel,
} from "../services/mockApi";

type FeedbackProps = {
  onNavigate?: (page: "home") => void;
};

const Feedback = ({ onNavigate }: FeedbackProps = {}) => {
  const goHome = () => {
    if (onNavigate) {
      onNavigate("home");
      return;
    }
    window.location.replace("/guest");
  };

  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sentiment, setSentiment] = useState<SentimentLabel | null>(null);
  const [insights, setInsights] = useState<SentimentInsight | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(true);

  useEffect(() => {
    let active = true;
    fetchSentimentInsights()
      .then((data) => {
        if (active) setInsights(data);
      })
      .finally(() => {
        if (active) setLoadingInsights(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitting(true);
    try {
      const result = await sendFeedback(feedback.trim());
      setSentiment(result.sentiment);
      setInsights(result.insights);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getSentimentColor = (sent: SentimentLabel) => {
    switch (sent) {
      case "positive":
        return "text-emerald-600";
      case "negative":
        return "text-rose-600";
      default:
        return "text-amber-600";
    }
  };

  const getSentimentBg = (sent: SentimentLabel) => {
    switch (sent) {
      case "positive":
        return "bg-emerald-50 border-emerald-200";
      case "negative":
        return "bg-rose-50 border-rose-200";
      default:
        return "bg-amber-50 border-amber-200";
    }
  };

  const getSentimentEmoji = (sent: SentimentLabel) => {
    switch (sent) {
      case "positive":
        return "🌟";
      case "negative":
        return "💔";
      default:
        return "🤔";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goHome}
              className="flex items-center gap-1 text-purple-600 hover:text-purple-700 transition-colors duration-200 font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
              Share Your Feedback
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Your voice matters</span>
          </div>
        </div>

        {/* Feedback Form / Thank You Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 overflow-hidden mb-8 hover:shadow-md transition-shadow duration-200">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-800">
                Tell us about your experience
              </h2>
            </div>
          </div>
          <div className="p-6 md:p-8">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How was your experience at Kuriftu African Village?
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us about your visit, the food, service, ambiance, and anything else you'd like to share..."
                    rows={6}
                    className="w-full border border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-gray-50 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                {sentiment && (
                  <>
                    <div className="text-7xl mb-5 animate-bounce">
                      {getSentimentEmoji(sentiment)}
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getSentimentBg(sentiment)} border mb-4`}
                    >
                      <span
                        className={`text-lg font-semibold ${getSentimentColor(sentiment)}`}
                      >
                        {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                      </span>
                    </div>
                    <h2
                      className={`text-2xl font-bold mb-3 ${getSentimentColor(sentiment)}`}
                    >
                      Thank You!
                    </h2>
                  </>
                )}
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  We've analyzed your response and will use this information to
                  improve our service at Kuriftu African Village.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFeedback("");
                    setSentiment(null);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-sm"
                >
                  Share Another Experience
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sentiment Dashboard */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-800">
                Real-Time Sentiment Dashboard
              </h2>
            </div>
          </div>
          <div className="p-6">
            {loadingInsights || !insights ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-pulse flex space-x-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-purple-400 rounded-full animation-delay-200"></div>
                  <div className="w-3 h-3 bg-purple-400 rounded-full animation-delay-400"></div>
                </div>
              </div>
            ) : (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Overall
                    </p>
                    <p
                      className={`text-xl font-bold mt-1 ${getSentimentColor(insights.overall)}`}
                    >
                      {insights.overall.charAt(0).toUpperCase() +
                        insights.overall.slice(1)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Score
                    </p>
                    <p className="text-xl font-bold text-gray-800 mt-1">
                      {insights.score}
                    </p>
                    <p className="text-xs text-gray-400">out of 10</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Trend
                    </p>
                    <p className="text-xl font-bold text-gray-800 mt-1">
                      {insights.trend === "up"
                        ? "📈 Up"
                        : insights.trend === "down"
                          ? "📉 Down"
                          : "➡️ Stable"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Feedback Totals
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-emerald-600 font-semibold">
                        +{insights.positives}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="text-amber-600 font-semibold">
                        {insights.neutrals}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="text-rose-600 font-semibold">
                        -{insights.negatives}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Praise & Issues */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-emerald-50/30 rounded-xl p-5 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">🌟</span>
                      <h3 className="font-semibold text-gray-800">
                        Top Praise
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {insights.topPraise.map((item) => (
                        <span
                          key={item}
                          className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-rose-50/30 rounded-xl p-5 border border-rose-100">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">⚠️</span>
                      <h3 className="font-semibold text-gray-800">
                        Areas to Improve
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {insights.topIssues.map((item) => (
                        <span
                          key={item}
                          className="text-sm bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Latest Feedback */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="font-semibold text-gray-800">
                      Latest Guest Feedback
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {insights.latestFeedback.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="text-xs text-gray-400">
                            {item.createdAt}
                          </span>
                          <div className="flex items-center gap-1">
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${getSentimentBg(item.sentiment)}`}
                            >
                              {item.sentiment}
                            </span>
                            <span className="text-xs text-gray-400">
                              ({item.score}/10)
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
};

export default Feedback;
