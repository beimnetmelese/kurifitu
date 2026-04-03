export type DietaryTag = "vegetarian" | "glutenFree" | "vegan" | "halal";
export type Ambiance = "cozy" | "energetic" | "romantic" | "quiet";
export type SentimentLabel = "positive" | "neutral" | "negative";

export type GuestProfile = {
  id: string;
  name: string;
  loyaltyTier: "Silver" | "Gold" | "Platinum";
  partySize: number;
  occasion: string;
  preferredSpiceLevel: "mild" | "medium" | "hot";
  dietaryTags: DietaryTag[];
  favoriteDishes: string[];
  lastVisit: string;
};

export type AssistantSuggestion = {
  id: string;
  title: string;
  description: string;
  category: "Dining" | "Events" | "Wellness" | "Logistics";
};

export type AssistantResponse = {
  reply: string;
  followUps: string[];
};

export type RecommendationPreferences = {
  spicy: boolean;
  vegetarian: boolean;
  glutenFree: boolean;
  adventurous: boolean;
  priceRange: "any" | "value" | "premium";
};

export type Recommendation = {
  id: string;
  name: string;
  description: string;
  price: number;
  spicy: boolean;
  vegetarian: boolean;
  glutenFree: boolean;
  tags: string[];
  matchScore: number;
};

export type RoomState = {
  lighting: number;
  music: number;
  temperature: number;
  ambiance: Ambiance;
  noiseReduction: number;
  scent: "citrus" | "vanilla" | "none";
  automation: {
    autoLighting: boolean;
    autoClimate: boolean;
    autoMusic: boolean;
    occupancyAware: boolean;
  };
};

export type RoomRecommendation = {
  id: string;
  title: string;
  detail: string;
  action: Partial<RoomState>;
};

export type FeedbackItem = {
  id: string;
  text: string;
  sentiment: SentimentLabel;
  score: number;
  tags: string[];
  createdAt: string;
};

export type SentimentInsight = {
  overall: SentimentLabel;
  score: number;
  trend: "up" | "down" | "steady";
  positives: number;
  neutrals: number;
  negatives: number;
  topPraise: string[];
  topIssues: string[];
  latestFeedback: FeedbackItem[];
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const guestProfile: GuestProfile = {
  id: "guest_0451",
  name: "Amina Tesfaye",
  loyaltyTier: "Gold",
  partySize: 3,
  occasion: "Anniversary Dinner",
  preferredSpiceLevel: "medium",
  dietaryTags: ["halal", "glutenFree"],
  favoriteDishes: ["Jollof Rice", "Tilapia with Berbere", "Injera Platter"],
  lastVisit: "2026-03-18",
};

const assistantSuggestions: AssistantSuggestion[] = [
  {
    id: "sug_1",
    title: "Chef’s Tasting Experience",
    description:
      "A five-course celebration menu tailored to your spice preference.",
    category: "Dining",
  },
  {
    id: "sug_2",
    title: "Live Jazz at 8:00 PM",
    description: "Reserve a front-row table with a quieter ambiance preset.",
    category: "Events",
  },
  {
    id: "sug_3",
    title: "Tea Ceremony Pairing",
    description: "Ethiopian coffee & tea ritual to close your meal.",
    category: "Wellness",
  },
  {
    id: "sug_4",
    title: "Ride Coordination",
    description: "We can schedule a ride for your preferred departure time.",
    category: "Logistics",
  },
];

const menu: Omit<Recommendation, "matchScore">[] = [
  {
    id: "dish_1",
    name: "Jollof Rice",
    description: "Fragrant rice with tomatoes, peppers, and African spices.",
    price: 15,
    spicy: true,
    vegetarian: true,
    glutenFree: true,
    tags: ["signature", "crowd-favorite"],
  },
  {
    id: "dish_2",
    name: "Suya Skewers",
    description: "Char-grilled beef with spicy peanut rub.",
    price: 14,
    spicy: true,
    vegetarian: false,
    glutenFree: true,
    tags: ["street-food", "bold"],
  },
  {
    id: "dish_3",
    name: "Egusi Soup",
    description: "Melon seed stew with leafy greens and slow-cooked beef.",
    price: 19,
    spicy: false,
    vegetarian: false,
    glutenFree: true,
    tags: ["comfort", "rich"],
  },
  {
    id: "dish_4",
    name: "Plantain Fritters",
    description: "Sweet plantain bites with aromatic spices.",
    price: 8,
    spicy: false,
    vegetarian: true,
    glutenFree: true,
    tags: ["snack", "family"],
  },
  {
    id: "dish_5",
    name: "Tibs Platter",
    description: "Sautéed beef with berbere and caramelized onions.",
    price: 22,
    spicy: true,
    vegetarian: false,
    glutenFree: true,
    tags: ["premium", "spicy"],
  },
  {
    id: "dish_6",
    name: "Injera Garden Plate",
    description: "Injera with lentils, greens, and turmeric vegetables.",
    price: 17,
    spicy: false,
    vegetarian: true,
    glutenFree: false,
    tags: ["vegetarian", "balanced"],
  },
];

const baseRoomState: RoomState = {
  lighting: 68,
  music: 45,
  temperature: 22,
  ambiance: "cozy",
  noiseReduction: 30,
  scent: "vanilla",
  automation: {
    autoLighting: true,
    autoClimate: true,
    autoMusic: false,
    occupancyAware: true,
  },
};

const feedbackStore: FeedbackItem[] = [
  {
    id: "fb_1",
    text: "Loved the ambience and the staff were incredibly thoughtful.",
    sentiment: "positive",
    score: 0.76,
    tags: ["service", "ambience"],
    createdAt: "2026-03-30 19:12",
  },
  {
    id: "fb_2",
    text: "Food was tasty but the wait time felt a bit long.",
    sentiment: "neutral",
    score: 0.12,
    tags: ["speed"],
    createdAt: "2026-03-30 20:45",
  },
  {
    id: "fb_3",
    text: "Absolutely amazing flavors, will come again!",
    sentiment: "positive",
    score: 0.88,
    tags: ["food", "loyalty"],
    createdAt: "2026-03-31 18:05",
  },
  {
    id: "fb_4",
    text: "The music was a bit loud near our table.",
    sentiment: "negative",
    score: -0.42,
    tags: ["music", "ambience"],
    createdAt: "2026-03-31 19:40",
  },
];

const quickReplies = [
  "Reserve a table for tonight",
  "What are the chef’s specials?",
  "Can you recommend a gluten-free dish?",
  "Set a romantic table ambiance",
];

const getRecommendationScore = (
  dish: Omit<Recommendation, "matchScore">,
  prefs: RecommendationPreferences,
) => {
  let score = 50;

  if (prefs.spicy) score += dish.spicy ? 18 : -8;
  if (prefs.vegetarian) score += dish.vegetarian ? 18 : -14;
  if (prefs.glutenFree) score += dish.glutenFree ? 18 : -12;
  if (prefs.adventurous)
    score +=
      dish.tags.includes("bold") || dish.tags.includes("premium") ? 8 : -4;

  if (prefs.priceRange === "value" && dish.price <= 15) score += 8;
  if (prefs.priceRange === "premium" && dish.price >= 19) score += 8;

  return Math.max(15, Math.min(98, score));
};

const analyzeSentiment = (text: string) => {
  const positiveWords = [
    "great",
    "excellent",
    "amazing",
    "delicious",
    "wonderful",
    "love",
    "best",
    "fantastic",
    "thoughtful",
  ];
  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "disgusting",
    "horrible",
    "worst",
    "hate",
    "disappointed",
    "slow",
    "loud",
  ];

  const lower = text.toLowerCase();
  const positiveCount = positiveWords.filter((word) =>
    lower.includes(word),
  ).length;
  const negativeCount = negativeWords.filter((word) =>
    lower.includes(word),
  ).length;

  if (positiveCount > negativeCount)
    return { label: "positive" as const, score: 0.6 + positiveCount * 0.1 };
  if (negativeCount > positiveCount)
    return { label: "negative" as const, score: -0.4 - negativeCount * 0.1 };
  return { label: "neutral" as const, score: 0.05 };
};

const extractTags = (text: string) => {
  const lower = text.toLowerCase();
  const tags: string[] = [];
  if (lower.includes("music")) tags.push("music");
  if (lower.includes("wait") || lower.includes("slow")) tags.push("speed");
  if (lower.includes("service") || lower.includes("staff"))
    tags.push("service");
  if (lower.includes("ambience") || lower.includes("ambiance"))
    tags.push("ambience");
  if (lower.includes("food") || lower.includes("flavor")) tags.push("food");
  return tags.length ? tags : ["general"];
};

const buildInsights = () => {
  const positives = feedbackStore.filter(
    (item) => item.sentiment === "positive",
  ).length;
  const negatives = feedbackStore.filter(
    (item) => item.sentiment === "negative",
  ).length;
  const neutrals = feedbackStore.filter(
    (item) => item.sentiment === "neutral",
  ).length;

  const score =
    Math.round(
      (feedbackStore.reduce((sum, item) => sum + item.score, 0) /
        feedbackStore.length) *
        100,
    ) / 100;

  const latest = [...feedbackStore].slice(-5).reverse();

  const issueCounts = new Map<string, number>();
  const praiseCounts = new Map<string, number>();

  feedbackStore.forEach((item) => {
    item.tags.forEach((tag) => {
      if (item.sentiment === "negative") {
        issueCounts.set(tag, (issueCounts.get(tag) ?? 0) + 1);
      } else if (item.sentiment === "positive") {
        praiseCounts.set(tag, (praiseCounts.get(tag) ?? 0) + 1);
      }
    });
  });

  const trend = score > 0.4 ? "up" : score < -0.1 ? "down" : "steady";

  return {
    overall: score > 0.2 ? "positive" : score < -0.1 ? "negative" : "neutral",
    score,
    trend,
    positives,
    neutrals,
    negatives,
    topPraise: [...praiseCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag),
    topIssues: [...issueCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag),
    latestFeedback: latest,
  } as SentimentInsight;
};

export const fetchGuestProfile = async () => {
  await delay(550);
  return guestProfile;
};

export const fetchAssistantSuggestions = async () => {
  await delay(450);
  return { suggestions: assistantSuggestions, quickReplies };
};

export const sendAssistantMessage = async (message: string) => {
  await delay(700);
  const lower = message.toLowerCase();

  if (lower.includes("reservation") || lower.includes("table")) {
    return {
      reply:
        "I can reserve a table for 7:30 PM. Would you like a quiet corner or live-music view?",
      followUps: ["Quiet corner seating", "Live-music view", "Change time"],
    } satisfies AssistantResponse;
  }

  if (lower.includes("gluten")) {
    return {
      reply:
        "Our best gluten-free picks are Jollof Rice and the Berbere Tilapia. I can also alert the kitchen to avoid cross-contact.",
      followUps: [
        "Order Jollof Rice",
        "Order Berbere Tilapia",
        "Set dietary note",
      ],
    } satisfies AssistantResponse;
  }

  if (lower.includes("romantic") || lower.includes("anniversary")) {
    return {
      reply:
        "I can switch your table to our romantic preset with softer lighting and lower music. Shall I apply it now?",
      followUps: [
        "Apply romantic preset",
        "Keep current ambiance",
        "Show other presets",
      ],
    } satisfies AssistantResponse;
  }

  return {
    reply:
      "Absolutely. I can handle dining, entertainment, and room controls. Tell me what you’d like to personalize.",
    followUps: [
      "Chef’s specials",
      "Set cozy ambiance",
      "Reserve dessert pairing",
    ],
  } satisfies AssistantResponse;
};

export const fetchRecommendations = async (
  prefs: RecommendationPreferences,
) => {
  await delay(600);
  return menu
    .map((dish) => ({
      ...dish,
      matchScore: getRecommendationScore(dish, prefs),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
};

export const fetchRoomState = async () => {
  await delay(500);
  return { ...baseRoomState };
};

export const updateRoomState = async (partial: Partial<RoomState>) => {
  await delay(350);
  Object.assign(baseRoomState, partial);
  return { ...baseRoomState };
};

export const fetchRoomRecommendations = async () => {
  await delay(400);
  return [
    {
      id: "room_1",
      title: "Soft Anniversary Glow",
      detail:
        "Lower lighting to 55% and warm the music mix for a romantic mood.",
      action: { lighting: 55, music: 35, ambiance: "romantic" },
    },
    {
      id: "room_2",
      title: "Live Music Balance",
      detail:
        "Reduce noise reflection and lift ambient lighting for the stage area.",
      action: { noiseReduction: 45, lighting: 72, ambiance: "energetic" },
    },
    {
      id: "room_3",
      title: "Quiet Celebration",
      detail:
        "Raise temperature slightly and keep music low for small group comfort.",
      action: { temperature: 23, music: 28, ambiance: "quiet" },
    },
  ] satisfies RoomRecommendation[];
};

export const fetchSentimentInsights = async () => {
  await delay(500);
  return buildInsights();
};

export const sendFeedback = async (text: string) => {
  await delay(650);
  const sentiment = analyzeSentiment(text);
  const tags = extractTags(text);
  const newItem: FeedbackItem = {
    id: `fb_${feedbackStore.length + 1}`,
    text,
    sentiment: sentiment.label,
    score: sentiment.score,
    tags,
    createdAt: "2026-04-02 19:10",
  };

  feedbackStore.push(newItem);

  return {
    sentiment: sentiment.label,
    score: sentiment.score,
    tags,
    insights: buildInsights(),
  };
};
