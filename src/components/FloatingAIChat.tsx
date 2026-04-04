import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { FiMessageCircle, FiMinimize2, FiSend, FiX } from "react-icons/fi";
import {
  getRoleAwareResponse,
  type ConversationMessage,
  type RoleAwareMode,
} from "../services/groqApi";

type FloatingAIChatProps = {
  mode: RoleAwareMode;
  title: string;
  subtitle: string;
  adminContext?: {
    currentPage?: string;
    scenario?: string;
    kpis?: string[];
    recommendation?: string;
    modules?: string[];
  };
};

type ChatEntry = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

export default function FloatingAIChat({
  mode,
  title,
  subtitle,
  adminContext,
}: FloatingAIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      id: 1,
      role: "assistant",
      text:
        mode === "admin"
          ? "I am your Kurifitu Go Admin AI copilot. Ask about dashboard trends, feedback signals, staffing, strategy, or operational decisions."
          : "I am your Kurifitu Go Guest AI companion. Ask me for dining guidance, room comfort help, menu ideas, or personalized recommendations.",
    },
  ]);

  const historyRef = useRef<ConversationMessage[]>([]);

  const quickPrompts = useMemo(
    () =>
      mode === "admin"
        ? [
            "Summarize key dashboard priorities right now",
            "What should we improve from recent feedback?",
            "Give staffing and scheduling recommendations",
            "What are the top risks this shift?",
          ]
        : [
            "Recommend dinner options for me",
            "What are your best dishes tonight?",
            "Help me set the room ambiance",
            "Suggest healthy options",
          ],
    [mode],
  );

  const submit = async (content: string) => {
    const prompt = content.trim();
    if (!prompt || sending) return;

    setInput("");
    setSending(true);

    const userMsg: ChatEntry = {
      id: Date.now(),
      role: "user",
      text: prompt,
    };
    setMessages((prev) => [...prev, userMsg]);
    historyRef.current.push({ role: "user", content: prompt });

    try {
      const response = await getRoleAwareResponse({
        mode,
        userMessage: prompt,
        previousMessages: historyRef.current,
        adminContext,
      });

      const assistantText = response.reply;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: assistantText,
        },
      ]);
      historyRef.current.push({ role: "assistant", content: assistantText });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "I could not process that right now. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onEnterSend = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void submit(input);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80]">
      {isOpen ? (
        <div className="w-[92vw] max-w-[390px] overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-[0_26px_70px_rgba(15,23,42,0.24)] backdrop-blur-xl">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-4 py-3 text-white">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-slate-300">{subtitle}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-slate-200 transition hover:bg-white/10 hover:text-white"
                  aria-label="Minimize AI chat"
                >
                  <FiMinimize2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-slate-200 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close AI chat"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-[52vh] space-y-3 overflow-y-auto bg-slate-50 px-4 py-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl px-3 py-2 text-sm leading-6 ${message.role === "assistant" ? "mr-8 border border-slate-200 bg-white text-slate-700" : "ml-8 bg-slate-950 text-white"}`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-white px-4 py-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {quickPrompts.slice(0, 2).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void submit(prompt)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 transition hover:bg-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onEnterSend}
                placeholder={
                  mode === "admin"
                    ? "Ask about dashboards, feedback, staffing..."
                    : "Ask for recommendations..."
                }
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
              <button
                type="button"
                onClick={() => void submit(input)}
                disabled={sending}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 transition hover:brightness-105 disabled:opacity-60"
              >
                <FiSend className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group inline-flex items-center gap-2 rounded-full border border-white/70 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_18px_44px_rgba(20,184,166,0.34)] transition hover:-translate-y-0.5"
        >
          <span className="absolute -inset-1 -z-10 rounded-full bg-cyan-400/35 blur-xl transition group-hover:bg-cyan-400/45" />
          <FiMessageCircle className="h-5 w-5" />
          AI Assistant
        </button>
      )}
    </div>
  );
}
