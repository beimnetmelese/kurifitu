export type SmartPackage = {
  id: string;
  packageName: string;
  includedServices: string[];
  targetSegments: Array<"Luxury" | "Family" | "Business" | "Budget">;
  bundlePrice: number;
  baseBookingValue: number;
  conversionLikelihood: number;
  confidence: number;
  aiInsight: string;
  reason: string;
  recommendedWhen: string;
};

export const smartPackages: SmartPackage[] = [
  {
    id: "romantic-escape",
    packageName: "Romantic Escape Package",
    includedServices: [
      "Ocean-view room upgrade",
      "Couples spa ritual",
      "Private sunset dining",
      "Late checkout",
    ],
    targetSegments: ["Luxury"],
    bundlePrice: 690,
    baseBookingValue: 520,
    conversionLikelihood: 0.74,
    confidence: 0.9,
    aiInsight:
      "Luxury guests convert better on premium bundles that combine wellness and exclusivity.",
    reason:
      "Guest preference data shows repeated interest in spa and fine dining during weekend stays.",
    recommendedWhen: "Best for weekends, anniversaries, and high-demand periods.",
  },
  {
    id: "family-adventure",
    packageName: "Family Adventure Package",
    includedServices: [
      "Family suite upgrade",
      "Kids club premium pass",
      "Meal plan for 4",
      "Adventure park transport",
    ],
    targetSegments: ["Family"],
    bundlePrice: 480,
    baseBookingValue: 340,
    conversionLikelihood: 0.72,
    confidence: 0.87,
    aiInsight:
      "Families respond strongly to convenience bundles that reduce planning friction.",
    reason:
      "Holiday booking patterns and kids-activity preferences indicate high package affinity.",
    recommendedWhen: "Ideal during school holidays and weekend family travel windows.",
  },
  {
    id: "executive-productivity",
    packageName: "Executive Productivity Package",
    includedServices: [
      "Executive room",
      "Airport transfer",
      "Express laundry",
      "Meeting lounge credits",
    ],
    targetSegments: ["Business"],
    bundlePrice: 430,
    baseBookingValue: 305,
    conversionLikelihood: 0.69,
    confidence: 0.84,
    aiInsight:
      "Business guests convert better when speed and convenience are bundled together.",
    reason:
      "Midweek booking behavior and service usage favor transport and time-saving add-ons.",
    recommendedWhen: "Best for midweek corporate arrivals and event periods.",
  },
  {
    id: "value-explorer",
    packageName: "Value Explorer Package",
    includedServices: [
      "Standard room",
      "Breakfast bundle",
      "City tour pass",
      "Flexible checkout",
    ],
    targetSegments: ["Budget"],
    bundlePrice: 250,
    baseBookingValue: 185,
    conversionLikelihood: 0.63,
    confidence: 0.79,
    aiInsight:
      "Budget guests still upsell when bundle value is explicit and price-transparent.",
    reason:
      "Price-sensitive behavior improves conversion when tours and meals are combined into one offer.",
    recommendedWhen: "Effective during low-demand weekdays and promo campaigns.",
  },
  {
    id: "wellness-weekend",
    packageName: "Wellness Weekend Package",
    includedServices: [
      "Premium room",
      "Daily wellness class",
      "Spa credit",
      "Healthy dining set menu",
    ],
    targetSegments: ["Luxury", "Business"],
    bundlePrice: 560,
    baseBookingValue: 410,
    conversionLikelihood: 0.67,
    confidence: 0.82,
    aiInsight:
      "Cross-segment behavior indicates wellness bundles drive high-margin upgrades.",
    reason:
      "Demand spikes for spa and curated dining during short weekend stays.",
    recommendedWhen: "Use on weekends and wellness-focused campaign windows.",
  },
];
