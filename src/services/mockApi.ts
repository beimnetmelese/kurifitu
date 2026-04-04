import {
  fetchUserProfile,
  getUserProfileFromStorage,
} from "./userService";

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
  priceRange: {
    min: number;
    max: number;
  };
  serviceType: "all" | "food" | "spa" | "wellness";
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
  serviceType: "food" | "spa" | "wellness";
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
    name: "Sushi Omakase",
    description: "Premier selection of sashimi and nigiri, hand-crafted for a refined dining experience.",
    price: 28,
    spicy: false,
    vegetarian: false,
    glutenFree: true,
    tags: ["Japanese", "premium", "chef-special"],
    serviceType: "food",
  },
  {
    id: "dish_2",
    name: "Tacos Al Pastor",
    description: "Soft tortillas filled with marinated pork, pineapple, and house-made salsa.",
    price: 16,
    spicy: true,
    vegetarian: false,
    glutenFree: false,
    tags: ["Mexican", "street-food", "zesty"],
    serviceType: "food",
  },
  {
    id: "dish_3",
    name: "Margherita Pizza",
    description: "Thin-crust Italian classic topped with buffalo mozzarella, basil, and San Marzano tomato.",
    price: 18,
    spicy: false,
    vegetarian: true,
    glutenFree: false,
    tags: ["Italian", "classic", "comfort"],
    serviceType: "food",
  },
  {
    id: "dish_4",
    name: "Pad Thai",
    description: "Stir-fried rice noodles with prawns, tamarind, peanuts, and fresh lime.",
    price: 19,
    spicy: false,
    vegetarian: false,
    glutenFree: false,
    tags: ["Thai", "noodles", "savory"],
    serviceType: "food",
  },
  {
    id: "dish_5",
    name: "Moroccan Lamb Tagine",
    description: "Slow-braised lamb with apricots, fragrant spices, and toasted almonds.",
    price: 26,
    spicy: false,
    vegetarian: false,
    glutenFree: true,
    tags: ["Moroccan", "slow-cooked", "aromatic"],
    serviceType: "food",
  },
  {
    id: "dish_6",
    name: "Greek Mezze Platter",
    description: "Shareable plate of hummus, falafel, pita, olives, and grilled halloumi.",
    price: 21,
    spicy: false,
    vegetarian: true,
    glutenFree: false,
    tags: ["Mediterranean", "shareable", "fresh"],
    serviceType: "food",
  },
  {
    id: "spa_1",
    name: "Traditional Finnish Sauna",
    description: "Authentic wood-fired sauna experience with cold plunge and relaxation area.",
    price: 35,
    spicy: false,
    vegetarian: true,
    glutenFree: true,
    tags: ["spa", "wellness", "relaxation"],
    serviceType: "spa",
  },
  {
    id: "spa_2",
    name: "Aromatherapy Massage",
    description: "60-minute full-body massage with essential oils and hot stone therapy.",
    price: 85,
    spicy: false,
    vegetarian: true,
    glutenFree: true,
    tags: ["spa", "massage", "aromatherapy"],
    serviceType: "spa",
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

  // Since filtering is done upfront, these preferences are now bonuses
  if (prefs.spicy && dish.spicy) score += 10;
  if (prefs.vegetarian && dish.vegetarian) score += 10;
  if (prefs.glutenFree && dish.glutenFree) score += 10;

  // Adventurous preference bonus
  if (prefs.adventurous && (dish.tags.includes("bold") || dish.tags.includes("premium"))) {
    score += 8;
  }

  // Price preference bonuses (within the filtered range)
  const priceRange = prefs.priceRange.max - prefs.priceRange.min;
  const pricePosition = (dish.price - prefs.priceRange.min) / priceRange;

  if (pricePosition <= 0.3) score += 5; // Prefer lower end of range
  else if (pricePosition >= 0.7) score += 3; // Slight preference for higher end

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

export const fetchGuestProfile = async (): Promise<GuestProfile> => {
  // First, check local storage
  let userProfile = getUserProfileFromStorage();
  if (!userProfile) {
    // Fetch from API
    userProfile = await fetchUserProfile();
  }

  if (userProfile) {
    // Map to GuestProfile, hardcode preferences
    return {
      id: userProfile.id,
      name: userProfile.name,
      loyaltyTier: "Gold", // hardcoded
      partySize: 3, // hardcoded
      occasion: "Anniversary Dinner", // hardcoded
      preferredSpiceLevel: "medium", // hardcoded
      dietaryTags: ["halal", "glutenFree"], // hardcoded
      favoriteDishes: ["Jollof Rice", "Tilapia with Berbere", "Injera Platter"], // hardcoded
      lastVisit: "2026-03-18", // hardcoded
    };
  } else {
    // Fallback to mock
    await delay(550);
    return guestProfile;
  }
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

  // Filter items based on preferences
  const filteredMenu = menu.filter((dish) => {
    // Price range filter
    if (dish.price < prefs.priceRange.min || dish.price > prefs.priceRange.max) {
      return false;
    }

    // Service type filter
    if (prefs.serviceType !== "all" && dish.serviceType !== prefs.serviceType) {
      return false;
    }

    // Dietary preferences - if enabled, must match
    if (prefs.spicy && !dish.spicy) return false;
    if (prefs.vegetarian && !dish.vegetarian) return false;
    if (prefs.glutenFree && !dish.glutenFree) return false;

    return true;
  });

  return filteredMenu
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
