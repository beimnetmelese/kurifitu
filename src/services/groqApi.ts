// Groq API service for AI Assistant

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GroqResponse {
  reply: string;
  followUps?: string[];
}

export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export type RoleAwareMode = "guest" | "admin";

type AdminAssistantContext = {
  currentPage?: string;
  scenario?: string;
  kpis?: string[];
  recommendation?: string;
  modules?: string[];
};

type FeedbackEntryForAI = {
  feedback_text: string;
  feedback_type: "positive" | "negative";
  feedback_time: string;
  sector?: string | null;
};

interface GuestContext {
  name?: string;
  occasion?: string;
  dietaryTags?: string[];
}

const getSystemPrompt = (
  guestName?: string,
  occasion?: string,
  dietaryTags?: string[],
): string => {
  return `You are an AI Assistant for Kuriftu African Village, a premier African cuisine restaurant. 
Your role is to provide helpful, warm, and professional assistance to guests.

Key Information:
- Restaurant Name: Kuriftu African Village
- Cuisine: Authentic African dishes with a modern twist
${guestName ? `- Guest Name: ${guestName}` : ""}
${occasion ? `- Dining Occasion: ${occasion}` : ""}
${dietaryTags && dietaryTags.length > 0 ? `- Dietary Preferences: ${dietaryTags.join(", ")}` : ""}

Guidelines:
1. Be warm, welcoming, and professional
2. Keep responses concise but helpful (2-3 sentences max)
3. Suggest menu items when appropriate
4. Offer to help with room ambiance settings if relevant
5. Use a friendly but sophisticated tone
6. If asked about pricing, provide general ranges

Menu Highlights:
- Doro Wat (Spicy chicken stew) - $24.99
- Tibs Platter (Sautéed beef/lamb) - $28.99  
- Vegetarian Combo - $19.99
- Kitfo (Minced beef) - $32.99
- Sambusa Trio (Appetizer) - $12.99
- Ethiopian Coffee Ceremony - $15.99

Respond naturally as a knowledgeable restaurant assistant.`;
};

export const sendGroqMessage = async (
  userMessage: string,
  conversationHistory: ConversationMessage[] = [],
  guestContext?: GuestContext,
): Promise<GroqResponse> => {
  try {
    console.log("Sending request to Groq API...");

    const messages: GroqMessage[] = [
      {
        role: "system",
        content: getSystemPrompt(
          guestContext?.name,
          guestContext?.occasion,
          guestContext?.dietaryTags,
        ),
      },
      ...(conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })) as GroqMessage[]),
      { role: "user", content: userMessage },
    ];

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Using currently available models from Groq
        model: "llama-3.3-70b-versatile", // Latest available model
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
      }),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API Error Details:", errorData);
      throw new Error(
        `API Error: ${response.status} - ${JSON.stringify(errorData)}`,
      );
    }

    const data = await response.json();
    const reply: string =
      data.choices[0]?.message?.content ||
      "I apologize, but I'm having trouble responding. Please try again.";

    // Generate follow-up suggestions
    const lowerReply = reply.toLowerCase();
    let followUps: string[] = [];

    if (
      lowerReply.includes("menu") ||
      lowerReply.includes("dish") ||
      lowerReply.includes("recommend")
    ) {
      followUps = [
        "Tell me more about Doro Wat",
        "What vegetarian options?",
        "Show me appetizers",
      ];
    } else if (
      lowerReply.includes("ambiance") ||
      lowerReply.includes("lighting") ||
      lowerReply.includes("room")
    ) {
      followUps = [
        "Set romantic lighting",
        "Make it cozy",
        "Adjust temperature",
      ];
    } else if (lowerReply.includes("price") || lowerReply.includes("cost")) {
      followUps = [
        "What's your most popular dish?",
        "Any daily specials?",
        "Do you have set menus?",
      ];
    } else {
      followUps = [
        "Menu recommendations",
        "Set room ambiance",
        "Dietary options",
        "Make a reservation",
      ];
    }

    return { reply, followUps };
  } catch (error) {
    console.error("Groq API call failed with error:", error);
    return {
      reply:
        "I apologize, but I'm having trouble connecting. Please try again in a moment, or speak with our staff for immediate assistance. We're here to help!",
      followUps: ["Menu recommendations", "Room settings", "Speak to staff"],
    };
  }
};

export const getPersonalizedResponse = async (
  message: string,
  guestProfile: GuestContext | null,
  previousMessages: ConversationMessage[],
): Promise<GroqResponse> => {
  const context: GuestContext = {
    name: guestProfile?.name,
    occasion: guestProfile?.occasion,
    dietaryTags: guestProfile?.dietaryTags,
  };

  return await sendGroqMessage(message, previousMessages, context);
};

export const generateFeedbackExecutiveAnalysis = async (
  feedbackEntries: FeedbackEntryForAI[],
  focusNote?: string,
): Promise<string> => {
  if (!GROQ_API_KEY) {
    return "Groq API key is missing. Add VITE_GROQ_API_KEY to generate AI feedback analysis.";
  }

  const dataset = feedbackEntries.slice(0, 80).map((entry) => ({
    type: entry.feedback_type,
    sector: entry.sector ?? "General",
    text: entry.feedback_text,
    time: entry.feedback_time,
  }));

  const messages: GroqMessage[] = [
    {
      role: "system",
      content:
        "You are a senior customer-experience strategist for Kurifitu Go. Analyze guest feedback for executive decision-making. Respond in exactly 4 concise paragraphs (no bullets, no numbering): paragraph 1 = sentiment summary and trend, paragraph 2 = positive highlights and strengths, paragraph 3 = risks/pain points and likely root causes, paragraph 4 = actionable recommendations with measurable next steps. Keep the output professional and practical.",
    },
    {
      role: "user",
      content: `Analyze this feedback dataset and produce the 4-paragraph brief. ${focusNote ? `Focus note: ${focusNote}.` : ""}\n\nFeedback data:\n${JSON.stringify(dataset)}`,
    },
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.4,
        max_tokens: 700,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq analysis failed: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content: string =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Unable to produce analysis right now. Please try again.";

    return content;
  } catch (error) {
    console.error("Feedback analysis failed:", error);
    return "AI analysis is temporarily unavailable. Please try again in a moment.";
  }
};

export const getRoleAwareResponse = async ({
  mode,
  userMessage,
  previousMessages,
  adminContext,
}: {
  mode: RoleAwareMode;
  userMessage: string;
  previousMessages: ConversationMessage[];
  adminContext?: AdminAssistantContext;
}): Promise<GroqResponse> => {
  if (mode === "guest") {
    const normalized = userMessage.toLowerCase();
    const bookingIntent =
      /(book|booking|reserve|reservation)/.test(normalized) &&
      /(table|dinner|lunch|tonight|this|seat|for\s+\d+)/.test(normalized);

    if (bookingIntent) {
      const reference = `KG-${Math.floor(100000 + Math.random() * 900000)}`;
      return {
        reply: `Booked. Your reservation request is now confirmed in Kurifitu Go with reference ${reference}. I have secured your booking and the host team will prepare your table based on your request details. If you want, I can also add a note for dietary preferences, preferred seating area, or celebration setup before your arrival.`,
        followUps: [
          "Add dietary preference to my booking",
          "Set romantic seating",
          "Change party size",
        ],
      };
    }

    return sendGroqMessage(userMessage, previousMessages);
  }

  if (!GROQ_API_KEY) {
    return {
      reply:
        "Groq API key is missing. Add VITE_GROQ_API_KEY for the admin AI assistant.",
      followUps: [
        "Show dashboard priorities",
        "Summarize feedback risks",
        "Recommend staffing actions",
      ],
    };
  }

  const systemPrompt = `You are Kurifitu Go Admin AI Copilot. You support leaders with operational, feedback, scheduling, pricing, segmentation, maintenance, and strategy decisions.

Current context:
- Current page: ${adminContext?.currentPage ?? "Unknown"}
- Scenario: ${adminContext?.scenario ?? "Not provided"}
- KPI snapshot: ${(adminContext?.kpis ?? []).join(" | ") || "Not provided"}
- Active recommendation: ${adminContext?.recommendation ?? "Not provided"}
- Available modules: ${(adminContext?.modules ?? []).join(", ") || "Not provided"}

Response rules:
1. Answer in one compact paragraph first.
2. Then provide 3 concrete actions as short bullets using '-' prefix.
3. Prioritize measurable outcomes and operational impact.
4. If user asks about feedback, include positives, risks, and next actions.
5. If user asks about staffing/scheduling, include shift and workload guidance.`;

  try {
    const messages: GroqMessage[] = [
      { role: "system", content: systemPrompt },
      ...(previousMessages.map((msg) => ({ role: msg.role, content: msg.content })) as GroqMessage[]),
      { role: "user", content: userMessage },
    ];

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.45,
        max_tokens: 650,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq admin assistant failed: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const reply: string =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I could not prepare the admin insight right now. Please try again.";

    return {
      reply,
      followUps: [
        "What should we do in the next 60 minutes?",
        "Summarize biggest feedback risks",
        "Give staffing adjustments by area",
      ],
    };
  } catch (error) {
    console.error("Admin AI response failed:", error);
    return {
      reply:
        "I am temporarily unable to connect to AI services. Please retry in a moment.",
      followUps: ["Dashboard summary", "Feedback actions", "Staffing plan"],
    };
  }
};
