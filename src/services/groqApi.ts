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
