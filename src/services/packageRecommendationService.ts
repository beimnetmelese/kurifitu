import { smartPackages, type SmartPackage } from "../data/smartPackages";

type GuestProfile = {
  name?: string;
  segment?: string;
  preferences?: string[];
  predictedSpend?: number;
  purchaseLikelihood?: number;
};

const SEGMENT_KEYWORDS: Record<string, string[]> = {
  Luxury: ["spa", "fine dining", "concierge", "private"],
  Family: ["kids", "family", "pool", "meal"],
  Business: ["airport", "laundry", "meeting", "express"],
  Budget: ["breakfast", "discount", "tour", "bundle"],
};

function getPreferenceScore(guest: GuestProfile, pkg: SmartPackage): number {
  const preferences = (guest.preferences || []).map((item) => item.toLowerCase());
  const keywordMatches = (SEGMENT_KEYWORDS[guest.segment || "Budget"] || []).filter(
    (keyword) => preferences.some((pref) => pref.includes(keyword)),
  ).length;

  const serviceMatches = pkg.includedServices.filter((service) =>
    preferences.some((pref) => service.toLowerCase().includes(pref.toLowerCase())),
  ).length;

  return keywordMatches * 1.4 + serviceMatches;
}

function getPackageScore(guest: GuestProfile, pkg: SmartPackage): number {
  const segmentFit = pkg.targetSegments.includes((guest.segment || "Budget") as SmartPackage["targetSegments"][number])
    ? 3
    : 0;
  const preferenceScore = getPreferenceScore(guest, pkg);
  const spendScore = Number(guest.predictedSpend || 0) >= pkg.baseBookingValue ? 1.2 : 0.4;

  return segmentFit + preferenceScore + spendScore + pkg.conversionLikelihood;
}

export function getSmartPackageForGuest(guest: GuestProfile): SmartPackage {
  const ranked = smartPackages
    .map((pkg) => ({
      pkg,
      score: getPackageScore(guest, pkg),
    }))
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.pkg || smartPackages[0];
}

export function getPackagesForSegment(segment: string): SmartPackage[] {
  return smartPackages.filter((pkg) => pkg.targetSegments.includes(segment as SmartPackage["targetSegments"][number]));
}

export function getTopPerformingPackages(limit = 3): SmartPackage[] {
  return smartPackages
    .slice()
    .sort((left, right) => {
      const leftExpected = (left.bundlePrice - left.baseBookingValue) * left.conversionLikelihood;
      const rightExpected = (right.bundlePrice - right.baseBookingValue) * right.conversionLikelihood;
      return rightExpected - leftExpected;
    })
    .slice(0, limit);
}

export function estimatePackageRevenueBoost(pkg: SmartPackage): {
  boostValue: number;
  boostPercent: number;
  expectedUpsellRevenue: number;
} {
  const boostValue = Math.max(0, pkg.bundlePrice - pkg.baseBookingValue);
  const boostPercent = pkg.baseBookingValue > 0 ? (boostValue / pkg.baseBookingValue) * 100 : 0;
  const expectedUpsellRevenue = boostValue * pkg.conversionLikelihood;

  return {
    boostValue,
    boostPercent,
    expectedUpsellRevenue,
  };
}
