import { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchAssistantSuggestions,
  fetchGuestProfile,
  sendAssistantMessage,
  type AssistantSuggestion,
  type GuestProfile,
} from "../services/mockApi";

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

const Assistant = ({ isOverlay = false, onClose }: AssistantProps = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Good evening! I'm your AI assistant at Kuriftu African Village. How may I assist you with your dining experience today?",
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
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {isOverlay ? (
            <button
              onClick={onClose}
              className="inline-flex items-center text-[#8B2C2D] hover:text-[#6B2021] transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate?.("home")}
              className="inline-flex items-center text-[#8B2C2D] hover:text-[#6B2021] transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Back to Home
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Guest Info & Recommendations */}
          <div className="lg:col-span-1 space-y-6">
            {/* Guest Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#8B2C2D] px-6 py-4">
                <h2 className="text-white font-semibold">Guest Profile</h2>
              </div>
              <div className="p-6">
                {loadingProfile ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : profile ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Name
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {profile.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Membership
                      </p>
                      <p className="text-lg font-semibold text-[#D4A373]">
                        {profile.loyaltyTier}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Dining Occasion
                      </p>
                      <p className="text-gray-700">{profile.occasion}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Party Size
                      </p>
                      <p className="text-gray-700">
                        {profile.partySize} guests
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Dietary Preferences
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile.dietaryTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Unable to load profile</p>
                )}
              </div>
            </div>

            {/* Recommendations Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#8B2C2D] px-6 py-4">
                <h2 className="text-white font-semibold">
                  Recommended for You
                </h2>
              </div>
              <div className="p-6">
                {loadingSuggestions ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-20 bg-gray-100 rounded-lg"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestions.map((item) => (
                      <div
                        key={item.id}
                        className="border-b border-gray-100 pb-4 last:border-0"
                      >
                        <p className="text-xs font-semibold text-[#D4A373] uppercase tracking-wider mb-1">
                          {item.category}
                        </p>
                        <p className="font-semibold text-gray-900 mb-1">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[calc(100vh-12rem)] flex flex-col">
              {/* Chat Header */}
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="font-semibold text-gray-900">AI Assistant</h2>
                <p className="text-sm text-gray-500">
                  Ask me anything about your dining experience
                </p>
              </div>

              {/* Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-[#8B2C2D] text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Replies */}
              {quickReplies.length > 0 && (
                <div className="border-t border-gray-100 px-6 py-3">
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleSend(reply)}
                        disabled={sending}
                        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-gray-100 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A373] focus:border-transparent"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={sending}
                    className="px-6 py-2 bg-[#8B2C2D] text-white rounded-xl hover:bg-[#6B2021] transition-colors disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
