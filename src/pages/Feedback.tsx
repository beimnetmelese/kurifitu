import { useEffect, useState, type FormEvent } from "react";
import {
  fetchSentimentInsights,
  sendFeedback,
  type SentimentInsight,
  type SentimentLabel,
} from "../services/mockApi";
import {
  FiArrowLeft,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiThumbsUp,
  FiThumbsDown,
  FiMeh,
  FiAlertCircle,
  FiBarChart2,
  FiClock,
  FiStar,
  FiAward,
  FiHeart,
  FiSmile,
  FiFrown,
  FiSend,
  FiActivity,
  FiPieChart,
} from "react-icons/fi";
import {
  MdSentimentVerySatisfied,
  MdSentimentDissatisfied,
  MdSentimentNeutral,
  MdAnalytics,
  MdOutlineFeedback,
} from "react-icons/md";

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

  const getSentimentIcon = (sent: SentimentLabel) => {
    switch (sent) {
      case "positive":
        return <MdSentimentVerySatisfied className="w-6 h-6" />;
      case "negative":
        return <MdSentimentDissatisfied className="w-6 h-6" />;
      default:
        return <MdSentimentNeutral className="w-6 h-6" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <FiTrendingUp className="w-4 h-4 text-emerald-600" />;
      case "down":
        return <FiTrendingDown className="w-4 h-4 text-rose-600" />;
      default:
        return <FiMinus className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goHome}
              className="group inline-flex items-center text-stone-600 hover:text-amber-700 transition-all duration-300"
            >
              <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium tracking-wide">
                RETURN TO SUITE
              </span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-stone-400 tracking-wide">
                LIVE SENTIMENT
              </span>
            </div>
          </div>

          <div className="mt-8 relative">
            <div className="absolute left-0 top-0 w-20 h-0.5 bg-gradient-to-r from-amber-500 to-amber-700"></div>
            <h1 className="text-4xl font-light text-stone-900 mt-4 mb-2 tracking-tight">
              Guest{" "}
              <span className="font-semibold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                Voice
              </span>
            </h1>
            <p className="text-stone-500 text-base font-light">
              Your insights shape our continuous pursuit of excellence
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form Column */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-100 overflow-hidden sticky top-8">
              <div className="relative bg-gradient-to-r from-stone-800 to-stone-900 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                    <MdOutlineFeedback className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-white font-semibold tracking-wide">
                    SHARE EXPERIENCE
                  </h2>
                </div>
              </div>
              <div className="p-6">
                {!submitted ? (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-stone-700 mb-3">
                        Describe your culinary journey
                      </label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Share details about your dining experience, service quality, ambiance, and any memorable moments..."
                        rows={8}
                        className="w-full border border-stone-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-stone-50 resize-none text-stone-700 placeholder-stone-400"
                        required
                      />
                      <p className="text-xs text-stone-400 mt-2">
                        <FiActivity className="w-3 h-3 inline mr-1" />
                        AI will analyze sentiment in real-time
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-stone-800 to-stone-900 text-white px-8 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-medium flex items-center justify-center gap-2 group"
                    >
                      {submitting ? (
                        <>
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
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <FiSend className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          <span>Submit Feedback</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    {sentiment && (
                      <>
                        <div
                          className={`inline-flex p-4 rounded-full ${getSentimentBg(sentiment)} mb-5`}
                        >
                          <div
                            className={`text-5xl ${getSentimentColor(sentiment)}`}
                          >
                            {getSentimentIcon(sentiment)}
                          </div>
                        </div>
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getSentimentBg(sentiment)} border mb-4`}
                        >
                          <span
                            className={`text-sm font-semibold ${getSentimentColor(sentiment)} uppercase tracking-wide`}
                          >
                            {sentiment.charAt(0).toUpperCase() +
                              sentiment.slice(1)}
                          </span>
                        </div>
                        <h2
                          className={`text-2xl font-bold mb-3 ${getSentimentColor(sentiment)}`}
                        >
                          Thank You
                        </h2>
                        <p className="text-stone-600 mb-8 max-w-md mx-auto leading-relaxed text-sm">
                          Your feedback has been analyzed and will help us
                          elevate the Kuriftu experience.
                        </p>
                        <button
                          onClick={() => {
                            setSubmitted(false);
                            setFeedback("");
                            setSentiment(null);
                          }}
                          className="bg-gradient-to-r from-stone-800 to-stone-900 text-white px-6 py-2.5 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-md text-sm font-medium"
                        >
                          Share Another Experience
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sentiment Dashboard Column */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
              <div className="relative bg-gradient-to-r from-stone-800 to-stone-900 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                    <MdAnalytics className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-white font-semibold tracking-wide">
                    SENTIMENT INTELLIGENCE
                  </h2>
                </div>
              </div>
              <div className="p-6">
                {loadingInsights || !insights ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-gradient-to-br from-stone-50 to-white rounded-xl p-4 border border-stone-100 hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <FiBarChart2 className="w-4 h-4 text-amber-600" />
                          <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                            Overall Sentiment
                          </p>
                        </div>
                        <p
                          className={`text-xl font-bold mt-1 ${getSentimentColor(insights.overall)}`}
                        >
                          {insights.overall.charAt(0).toUpperCase() +
                            insights.overall.slice(1)}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-stone-50 to-white rounded-xl p-4 border border-stone-100 hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <FiStar className="w-4 h-4 text-amber-600" />
                          <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                            Satisfaction Score
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-stone-800 mt-1">
                          {insights.score}
                          <span className="text-sm font-normal text-stone-400">
                            /10
                          </span>
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-stone-50 to-white rounded-xl p-4 border border-stone-100 hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <FiTrendingUp className="w-4 h-4 text-amber-600" />
                          <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                            Sentiment Trend
                          </p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {getTrendIcon(insights.trend)}
                          <p className="text-lg font-semibold text-stone-800">
                            {insights.trend === "up"
                              ? "Improving"
                              : insights.trend === "down"
                                ? "Declining"
                                : "Stable"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-stone-50 to-white rounded-xl p-4 border border-stone-100 hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <FiPieChart className="w-4 h-4 text-amber-600" />
                          <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                            Feedback Distribution
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <FiThumbsUp className="w-3 h-3 text-emerald-600" />
                            <span className="font-semibold text-emerald-600">
                              {insights.positives}
                            </span>
                          </div>
                          <span className="text-stone-300">|</span>
                          <div className="flex items-center gap-1">
                            <FiMeh className="w-3 h-3 text-amber-600" />
                            <span className="font-semibold text-amber-600">
                              {insights.neutrals}
                            </span>
                          </div>
                          <span className="text-stone-300">|</span>
                          <div className="flex items-center gap-1">
                            <FiThumbsDown className="w-3 h-3 text-rose-600" />
                            <span className="font-semibold text-rose-600">
                              {insights.negatives}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Praise & Issues */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-emerald-50/40 rounded-xl p-5 border border-emerald-100">
                        <div className="flex items-center gap-2 mb-3">
                          <FiAward className="w-5 h-5 text-emerald-600" />
                          <h3 className="font-semibold text-stone-800">
                            Distinguished Accolades
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {insights.topPraise.map((item) => (
                            <span
                              key={item}
                              className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full inline-flex items-center gap-1"
                            >
                              <FiHeart className="w-3 h-3" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-rose-50/40 rounded-xl p-5 border border-rose-100">
                        <div className="flex items-center gap-2 mb-3">
                          <FiAlertCircle className="w-5 h-5 text-rose-600" />
                          <h3 className="font-semibold text-stone-800">
                            Refinement Opportunities
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {insights.topIssues.map((item) => (
                            <span
                              key={item}
                              className="text-sm bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full inline-flex items-center gap-1"
                            >
                              <FiAlertCircle className="w-3 h-3" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Latest Feedback */}
                    <div>
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-stone-100">
                        <FiClock className="w-4 h-4 text-amber-600" />
                        <h3 className="font-semibold text-stone-800 tracking-wide">
                          RECENT GUEST TESTIMONIALS
                        </h3>
                      </div>
                      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                        {insights.latestFeedback.map((item) => (
                          <div
                            key={item.id}
                            className="group bg-stone-50 rounded-xl p-4 border border-stone-100 hover:border-amber-200 hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    item.sentiment === "positive"
                                      ? "bg-emerald-500"
                                      : item.sentiment === "negative"
                                        ? "bg-rose-500"
                                        : "bg-amber-500"
                                  }`}
                                ></div>
                                <span className="text-xs text-stone-400 font-mono">
                                  {item.createdAt}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${getSentimentBg(item.sentiment)}`}
                                >
                                  {item.sentiment === "positive" && (
                                    <FiSmile className="w-3 h-3 text-emerald-600" />
                                  )}
                                  {item.sentiment === "negative" && (
                                    <FiFrown className="w-3 h-3 text-rose-600" />
                                  )}
                                  {item.sentiment === "neutral" && (
                                    <FiMeh className="w-3 h-3 text-amber-600" />
                                  )}
                                  <span
                                    className={`text-xs font-medium ${getSentimentColor(item.sentiment)}`}
                                  >
                                    {item.sentiment}
                                  </span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                  <FiStar className="w-3 h-3 text-amber-500 fill-amber-500" />
                                  <span className="text-xs font-medium text-stone-600">
                                    {item.score}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-stone-600 leading-relaxed">
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
        </div>
      </div>

      {/* Custom CSS for scrollbar and animations */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4a373;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b88352;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce {
          animation: bounce 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Feedback;
