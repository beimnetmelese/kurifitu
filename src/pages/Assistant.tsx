import { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchAssistantSuggestions,
  fetchGuestProfile,
  sendAssistantMessage,
  type AssistantSuggestion,
  type GuestProfile,
} from "../services/mockApi";
import {
  FiArrowLeft,
  FiX,
  FiUser,
  FiUsers,
  FiMessageSquare,
  FiSend,
  FiAward,
  FiChevronRight,
  FiHeart,
  FiTrendingUp,
  FiGift,
} from "react-icons/fi";
import { MdVerified, MdGrass, MdNoFood } from "react-icons/md";

type ChatMessage = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

type AssistantProps = {
  isOverlay?: boolean;
  onClose?: () => void;
  onNavigate?: (page: "home") => void;
};

const Assistant = ({
  isOverlay = false,
  onClose,
  onNavigate,
}: AssistantProps = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Good evening. I'm your personal AI Assistant at Kuriftu African Village. How may I enhance your dining experience this evening?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [suggestions, setSuggestions] = useState<AssistantSuggestion[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [sending, setSending] = useState(false);
  const nextMessageId = useMemo(() => messages.length + 1, [messages.length]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let active = true;
    fetchGuestProfile()
      .then((data) => {
        if (active) setProfile(data);
      })
      .finally(() => {
        if (active) setLoadingProfile(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetchAssistantSuggestions()
      .then((data) => {
        if (!active) return;
        setSuggestions(data.suggestions);
        setQuickReplies(data.quickReplies);
      })
      .finally(() => {
        if (active) setLoadingSuggestions(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSend = async (payload?: string) => {
    const content = (payload ?? input).trim();
    if (!content || sending) return;

    setInput("");
    setSending(true);
    const newMessage: ChatMessage = {
      id: nextMessageId,
      text: content,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await sendAssistantMessage(content);
      const botMessage: ChatMessage = {
        id: nextMessageId + 1,
        text: response.reply,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
      if (response.followUps.length) {
        setQuickReplies(response.followUps);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Luxury Accent */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <button
              onClick={isOverlay ? onClose : () => onNavigate?.("home")}
              className="group inline-flex items-center text-stone-600 hover:text-amber-700 transition-all duration-300"
            >
              {isOverlay ? (
                <FiX className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              )}
              <span className="text-sm font-medium tracking-wide">
                {isOverlay ? "CLOSE" : "RETURN TO SUITE"}
              </span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-stone-400 tracking-wide">
                Assistant ACTIVE
              </span>
            </div>
          </div>

          <div className="mt-8 relative">
            <div className="absolute left-0 top-0 w-20 h-0.5 bg-gradient-to-r from-amber-500 to-amber-700"></div>
            <h1 className="text-4xl font-light text-stone-900 mt-4 mb-2 tracking-tight">
              AI{" "}
              <span className="font-semibold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                Assistant
              </span>
            </h1>
            <p className="text-stone-500 text-base font-light">
              Your personal assistant for an exceptional culinary journey
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Guest Info & Recommendations */}
          <div className="lg:col-span-1 space-y-6">
            {/* Guest Profile Card - Luxury Design */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
              <div className="relative bg-gradient-to-r from-stone-800 to-stone-900 px-6 py-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-white font-semibold tracking-wide">
                    GUEST PROFILE
                  </h2>
                </div>
              </div>
              <div className="p-6">
                {loadingProfile ? (
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <div className="h-3 bg-stone-200 rounded w-1/3 mb-2"></div>
                      <div className="h-5 bg-stone-200 rounded w-2/3"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-3 bg-stone-200 rounded w-1/3 mb-2"></div>
                      <div className="h-5 bg-stone-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ) : profile ? (
                  <div className="space-y-5">
                    <div className="border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2 text-stone-400 text-xs mb-1">
                        <FiUser className="w-3 h-3" />
                        <span className="tracking-wide">
                          DISTINGUISHED GUEST
                        </span>
                      </div>
                      <p className="text-xl font-semibold text-stone-800">
                        {profile.name}
                      </p>
                    </div>

                    <div className="border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2 text-stone-400 text-xs mb-1">
                        <FiAward className="w-3 h-3" />
                        <span className="tracking-wide">MEMBERSHIP STATUS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdVerified className="w-4 h-4 text-amber-600" />
                        <p className="text-base font-semibold text-amber-700">
                          {profile.loyaltyTier}
                        </p>
                      </div>
                    </div>

                    <div className="border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2 text-stone-400 text-xs mb-1">
                        <FiGift className="w-3 h-3" />
                        <span className="tracking-wide">DINING OCCASION</span>
                      </div>
                      <p className="text-stone-700 font-medium">
                        {profile.occasion}
                      </p>
                    </div>

                    <div className="border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2 text-stone-400 text-xs mb-1">
                        <FiUsers className="w-3 h-3" />
                        <span className="tracking-wide">PARTY SIZE</span>
                      </div>
                      <p className="text-stone-700 font-medium">
                        {profile.partySize} guests
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-stone-400 text-xs mb-2">
                        <FiHeart className="w-3 h-3" />
                        <span className="tracking-wide">
                          DIETARY PREFERENCES
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.dietaryTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1.5 bg-stone-50 text-stone-600 text-xs rounded-full border border-stone-200 inline-flex items-center gap-1"
                          >
                            {tag.toLowerCase().includes("vegetarian") && (
                              <MdGrass className="w-3 h-3" />
                            )}
                            {tag.toLowerCase().includes("gluten") && (
                              <MdNoFood className="w-3 h-3" />
                            )}
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-stone-500 text-center py-4">
                    Unable to load profile
                  </p>
                )}
              </div>
            </div>

            {/* Recommendations Card - Luxury Design */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
              <div className="relative bg-gradient-to-r from-stone-800 to-stone-900 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                    <FiTrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-white font-semibold tracking-wide">
                    CURATED INSIGHTS
                  </h2>
                </div>
              </div>
              <div className="p-6">
                {loadingSuggestions ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-stone-200 rounded w-1/4 mb-2"></div>
                        <div className="h-5 bg-stone-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-stone-100 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {suggestions.map((item, index) => (
                      <div
                        key={item.id}
                        className={`group cursor-pointer hover:translate-x-1 transition-all duration-300 ${
                          index !== suggestions.length - 1
                            ? "border-b border-stone-100 pb-4"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                                {item.category}
                              </span>
                              <FiChevronRight className="w-3 h-3 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="font-semibold text-stone-800 mb-1">
                              {item.title}
                            </p>
                            <p className="text-sm text-stone-500 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Chat Interface - Luxury Design */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-100 h-[calc(100vh-12rem)] flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="border-b border-stone-100 px-6 py-5 bg-gradient-to-r from-white to-stone-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center">
                    <FiMessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-stone-800">
                      Assistant Chat
                    </h2>
                    <p className="text-xs text-stone-400">
                      AI-powered personal assistance
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-stone-800 to-stone-900 text-white shadow-lg"
                          : "bg-stone-100 text-stone-800 border border-stone-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="bg-stone-100 rounded-2xl px-5 py-3 border border-stone-200">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Replies */}
              {quickReplies.length > 0 && (
                <div className="border-t border-stone-100 px-6 py-4 bg-stone-50/50">
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleSend(reply)}
                        disabled={sending}
                        className="px-4 py-2 text-sm bg-white text-stone-700 rounded-full border border-stone-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-all duration-300 disabled:opacity-50"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-stone-100 p-5 bg-white">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Type your message..."
                      className="w-full px-5 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-stone-700 placeholder-stone-400"
                    />
                  </div>
                  <button
                    onClick={() => handleSend()}
                    disabled={sending}
                    className="px-6 py-3 bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-2xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 group"
                  >
                    <FiSend className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom CSS for scrollbar and animations */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Assistant;
