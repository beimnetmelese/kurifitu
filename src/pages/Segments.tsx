import { useMemo, useState } from "react";
import DecisionInsightCard from "../components/common/DecisionInsightCard";
import { guests } from "../data/guests";
import {
  estimatePackageRevenueBoost,
  getPackagesForSegment,
} from "../services/packageRecommendationService";
import type { DecisionInsight } from "../types/decisionInsight";
import { formatCurrency } from "../utils/formatCurrency";

type SegmentPlaybook = {
  name: "Luxury" | "Budget" | "Family" | "Business";
  avgSpend: number;
  totalRevenueContribution: number;
  revenueGrowthPotential: number;
  bookingPattern: string;
  preferences: string[];
  priceSensitivity: "Low" | "Medium" | "High";
  bestOffers: string;
  upsellStrategy: string;
  marketingSuggestion: string;
  expectedRevenueUplift: number;
  conversionImprovement: number;
  guestCount: number;
  rank: number;
};

const segmentSeedData: SegmentPlaybook[] = [
  {
    name: "Luxury",
    avgSpend: 380,
    totalRevenueContribution: 79800,
    revenueGrowthPotential: 18,
    bookingPattern: "Weekend-heavy, short notice, high attachment to premium experiences.",
    preferences: ["Spa", "Private dining", "Concierge", "Ocean-view upgrades"],
    priceSensitivity: "Low",
    bestOffers: "Premium spa + private dining package",
    upsellStrategy: "Promote suite upgrades, late checkout, and exclusive transport.",
    marketingSuggestion: "Use VIP email journeys and concierge-triggered offers.",
    expectedRevenueUplift: 8500,
    conversionImprovement: 11,
    guestCount: 42,
    rank: 1,
  },
  {
    name: "Business",
    avgSpend: 295,
    totalRevenueContribution: 59200,
    revenueGrowthPotential: 14,
    bookingPattern: "Midweek, last-minute, convenience-first with fast checkout needs.",
    preferences: ["Express laundry", "Airport transfer", "Meeting space", "Breakfast"] ,
    priceSensitivity: "Medium",
    bestOffers: "Business bundle with transport + breakfast",
    upsellStrategy: "Offer fast check-in, meeting room credits, and early breakfast add-ons.",
    marketingSuggestion: "Target corporate account lists and LinkedIn retargeting.",
    expectedRevenueUplift: 6400,
    conversionImprovement: 9,
    guestCount: 31,
    rank: 2,
  },
  {
    name: "Family",
    avgSpend: 255,
    totalRevenueContribution: 71400,
    revenueGrowthPotential: 16,
    bookingPattern: "School-holiday and weekend bookings with longer stays.",
    preferences: ["Kids club", "Pool activities", "Meal plans", "Bundle pricing"],
    priceSensitivity: "Medium",
    bestOffers: "Family package with meals + activities",
    upsellStrategy: "Bundle dining, kids experiences, and multi-night stay incentives.",
    marketingSuggestion: "Run family-focused social ads and package landing pages.",
    expectedRevenueUplift: 7200,
    conversionImprovement: 12,
    guestCount: 58,
    rank: 3,
  },
  {
    name: "Budget",
    avgSpend: 140,
    totalRevenueContribution: 36800,
    revenueGrowthPotential: 9,
    bookingPattern: "Early-booking and promo-driven with strong price comparison behavior.",
    preferences: ["Breakfast bundle", "Discounts", "Tours", "Flexible cancellation"],
    priceSensitivity: "High",
    bestOffers: "Value bundle with early booking discount",
    upsellStrategy: "Protect occupancy with bundled savings and limited-time add-ons.",
    marketingSuggestion: "Use retargeting, promo codes, and mobile-first offers.",
    expectedRevenueUplift: 4200,
    conversionImprovement: 7,
    guestCount: 76,
    rank: 4,
  },
];

type CampaignResult = {
  campaign: string;
  expectedGain: number;
  channel: string;
};

export default function Segments() {
  const [selectedSegmentName, setSelectedSegmentName] = useState<SegmentPlaybook["name"]>("Luxury");

  const segmentData = useMemo(() => {
    const guestCountBySegment = guests.reduce<Record<string, number>>((acc, guest) => {
      const key = guest.segment || "Budget";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return segmentSeedData.map((segment) => ({
      ...segment,
      guestCount: guestCountBySegment[segment.name] ?? segment.guestCount,
    }));
  }, []);

  const ranking = useMemo(
    () => segmentData.slice().sort((left, right) => right.totalRevenueContribution - left.totalRevenueContribution),
    [segmentData],
  );

  const mostValuable = ranking[0] ?? segmentData[0];
  const underperforming = segmentData.reduce((worst, current) =>
    current.revenueGrowthPotential < worst.revenueGrowthPotential ? current : worst,
  segmentData[0]);

  const selectedSegment =
    segmentData.find((segment) => segment.name === selectedSegmentName) ?? segmentData[0];

  const avgSpend =
    segmentData.length > 0
      ? segmentData.reduce((sum, segment) => sum + segment.avgSpend, 0) / segmentData.length
      : 0;

  const totalMonthlyUplift = segmentData.reduce(
    (sum, segment) => sum + segment.expectedRevenueUplift,
    0,
  );

  const campaignForSelected: CampaignResult = {
    campaign:
      selectedSegment.name === "Luxury"
        ? "Launch VIP spa + private dining bundle"
        : selectedSegment.name === "Budget"
          ? "Publish limited-time value bundle with early booking incentive"
          : selectedSegment.name === "Family"
            ? "Promote family package with meals and kids club access"
            : "Send convenience bundle with transfer + breakfast add-on",
    expectedGain: selectedSegment.expectedRevenueUplift,
    channel:
      selectedSegment.name === "Business"
        ? "Corporate email + LinkedIn retargeting"
        : selectedSegment.name === "Family"
          ? "Social ads + booking engine banner"
          : "Email + website personalization",
  };

  const segmentDecisionCards: DecisionInsight[] = segmentData.map((segment) => {
    const topPackage = getPackagesForSegment(segment.name)[0];
    const packageBoost = topPackage
      ? estimatePackageRevenueBoost(topPackage)
      : { boostValue: 0, boostPercent: 0, expectedUpsellRevenue: 0 };

    return {
      id: segment.name,
      title: `${segment.name} segment strategy`,
      prediction: `Avg spend ${formatCurrency(segment.avgSpend)} with ${formatCurrency(segment.totalRevenueContribution)} contribution.`,
      insight: `${segment.bookingPattern} Pricing sensitivity is ${segment.priceSensitivity.toLowerCase()}.`,
      recommendedAction: topPackage
        ? `Prioritize ${topPackage.packageName}. ${segment.upsellStrategy}`
        : `${segment.bestOffers}. ${segment.upsellStrategy}`,
      expectedImpact: topPackage
        ? `+${formatCurrency(packageBoost.boostValue)} per booking (${packageBoost.boostPercent.toFixed(0)}%) and +${formatCurrency(segment.expectedRevenueUplift)}/month`
        : `+${formatCurrency(segment.expectedRevenueUplift)}/month and +${segment.conversionImprovement}% conversion`,
      confidence: 72 + Math.min(20, segment.revenueGrowthPotential),
      reason: segment.marketingSuggestion,
      tone:
        segment.name === mostValuable?.name
          ? "success"
          : segment.name === underperforming?.name
            ? "warning"
            : "info",
    };
  });

  const segmentPackages = useMemo(
    () =>
      segmentData.map((segment) => ({
        segment: segment.name,
        packages: getPackagesForSegment(segment.name),
      })),
    [segmentData],
  );

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-slate-950 px-6 py-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_28%)]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-200/90">
              Segment Intelligence
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Segment Intelligence & Revenue Strategy
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Turn segment behavior into revenue actions with AI-simulated offers, upsell plays, and campaign targeting.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[520px] xl:grid-cols-4">
            <div className="min-w-0 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="break-words text-[11px] font-semibold uppercase leading-4 tracking-[0.16em] text-violet-100">
                Most valuable
              </p>
              <p className="mt-2 break-words text-sm font-semibold leading-5 text-white">
                {mostValuable?.name}
              </p>
            </div>
            <div className="min-w-0 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="break-words text-[11px] font-semibold uppercase leading-4 tracking-[0.16em] text-emerald-100">
                Underperforming
              </p>
              <p className="mt-2 break-words text-sm font-semibold leading-5 text-white">
                {underperforming?.name}
              </p>
            </div>
            <div className="min-w-0 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="break-words text-[11px] font-semibold uppercase leading-4 tracking-[0.16em] text-amber-100">
                Avg. spend
              </p>
              <p className="mt-2 break-words text-sm font-semibold leading-5 text-white">
                {formatCurrency(avgSpend)}
              </p>
            </div>
            <div className="min-w-0 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="break-words text-[11px] font-semibold uppercase leading-4 tracking-[0.16em] text-cyan-100">
                Monthly uplift
              </p>
              <p className="mt-2 break-words text-sm font-semibold leading-5 text-white">
                {formatCurrency(totalMonthlyUplift)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,0.9fr)]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {segmentData.map((segment) => {
              const isSelected = selectedSegmentName === segment.name;
              const isTop = mostValuable?.name === segment.name;
              const isUnder = underperforming?.name === segment.name;
              const rankTone =
                segment.name === "Luxury"
                  ? "from-cyan-500 to-blue-600"
                  : segment.name === "Budget"
                    ? "from-rose-500 to-orange-500"
                    : segment.name === "Family"
                      ? "from-emerald-500 to-teal-500"
                      : "from-violet-500 to-fuchsia-500";

              return (
                <article
                  key={segment.name}
                  className={`relative min-w-0 overflow-hidden rounded-[30px] border p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 ${isSelected ? "border-slate-900 bg-slate-950 text-white" : "border-slate-200/80 bg-white/90 text-slate-900"}`}
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${rankTone}`} />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                        Segment
                      </p>
                      <h2 className={`mt-2 break-words text-2xl font-semibold leading-tight ${isSelected ? "text-white" : "text-slate-950"}`}>
                        {segment.name}
                      </h2>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {isTop ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                          Most valuable
                        </span>
                      ) : null}
                      {isUnder ? (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
                          Underperforming
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className={`min-w-0 rounded-2xl border px-4 py-3 ${isSelected ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                      <p className={`break-words text-[10px] font-semibold uppercase leading-4 tracking-[0.14em] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        Avg spend
                      </p>
                      <p className={`mt-2 break-words text-base font-semibold leading-5 sm:text-lg ${isSelected ? "text-white" : "text-slate-950"}`}>
                        {formatCurrency(segment.avgSpend)}
                      </p>
                    </div>
                    <div className={`min-w-0 rounded-2xl border px-4 py-3 ${isSelected ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                      <p className={`break-words text-[10px] font-semibold uppercase leading-4 tracking-[0.14em] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        Revenue contribution
                      </p>
                      <p className={`mt-2 break-words text-base font-semibold leading-5 sm:text-lg ${isSelected ? "text-white" : "text-slate-950"}`}>
                        {formatCurrency(segment.totalRevenueContribution)}
                      </p>
                    </div>
                    <div className={`min-w-0 rounded-2xl border px-4 py-3 ${isSelected ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                      <p className={`break-words text-[10px] font-semibold uppercase leading-4 tracking-[0.14em] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        Growth potential
                      </p>
                      <p className={`mt-2 break-words text-base font-semibold leading-5 sm:text-lg ${isSelected ? "text-white" : "text-slate-950"}`}>
                        +{segment.revenueGrowthPotential}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div>
                      <p className={`break-words text-xs font-semibold uppercase tracking-[0.16em] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        Behavior insights
                      </p>
                      <p className={`mt-2 break-words text-sm leading-6 ${isSelected ? "text-slate-200" : "text-slate-600"}`}>
                        {segment.bookingPattern}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {segment.preferences.map((preference) => (
                        <span
                          key={preference}
                          className={`max-w-full break-words rounded-full border px-3 py-1 text-[11px] font-semibold leading-4 ${isSelected ? "border-white/10 bg-white/10 text-slate-100" : "border-slate-200 bg-slate-50 text-slate-700"}`}
                        >
                          {preference}
                        </span>
                      ))}
                    </div>
                    <div className={`rounded-2xl border px-4 py-3 ${isSelected ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        AI recommendation
                      </p>
                      <p className={`mt-2 text-sm leading-6 ${isSelected ? "text-white" : "text-slate-700"}`}>
                        {segment.bestOffers} · {segment.upsellStrategy}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className={`min-w-0 rounded-2xl border px-4 py-3 ${isSelected ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                      <p className={`break-words text-[10px] font-semibold uppercase leading-4 tracking-[0.14em] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        Expected uplift
                      </p>
                      <p className={`mt-2 break-words text-base font-semibold leading-5 sm:text-lg ${isSelected ? "text-white" : "text-slate-950"}`}>
                        +{formatCurrency(segment.expectedRevenueUplift)}/month
                      </p>
                    </div>
                    <div className={`min-w-0 rounded-2xl border px-4 py-3 ${isSelected ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                      <p className={`break-words text-[10px] font-semibold uppercase leading-4 tracking-[0.14em] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        Conversion improvement
                      </p>
                      <p className={`mt-2 break-words text-base font-semibold leading-5 sm:text-lg ${isSelected ? "text-white" : "text-slate-950"}`}>
                        +{segment.conversionImprovement}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className={`max-w-full break-words rounded-full px-3 py-1 text-[11px] font-semibold leading-4 ${isSelected ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700"}`}>
                      Pricing sensitivity: {segment.priceSensitivity}
                    </span>
                    <span className={`max-w-full break-words rounded-full px-3 py-1 text-[11px] font-semibold leading-4 ${isSelected ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700"}`}>
                      Guest count: {segment.guestCount}
                    </span>
                    <span className={`max-w-full break-words rounded-full px-3 py-1 text-[11px] font-semibold leading-4 ${isSelected ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700"}`}>
                      Rank #{segment.rank}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedSegmentName(segment.name)}
                    className={`mt-5 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${isSelected ? "bg-white text-slate-950 hover:bg-slate-100" : "bg-slate-950 text-white hover:bg-slate-800"}`}
                  >
                    Target this segment
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[30px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              Selected segment action plan
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {selectedSegment.name}
            </h2>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Suggested campaign
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {campaignForSelected.campaign}
              </p>
              <p className="mt-2 text-sm font-semibold text-emerald-700">
                Expected revenue gain: {formatCurrency(campaignForSelected.expectedGain)}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Best channel: {campaignForSelected.channel}
              </p>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Why AI selected this segment
                </p>
                <p className="mt-2 leading-6">
                  {selectedSegment.bookingPattern} This creates a strong opportunity to convert interest into higher-margin revenue.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Revenue playbook
                </p>
                <ul className="mt-2 space-y-2 leading-6 text-slate-600">
                  <li>• Best offer: {selectedSegment.bestOffers}</li>
                  <li>• Upsell strategy: {selectedSegment.upsellStrategy}</li>
                  <li>• Marketing: {selectedSegment.marketingSuggestion}</li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedSegmentName(selectedSegment.name)}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Launch target campaign
            </button>
          </section>

          <section className="rounded-[30px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              Segment ranking
            </p>
            <div className="mt-4 space-y-3">
              {ranking.map((segment, index) => (
                <div
                  key={segment.name}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold leading-5 text-slate-950">
                      #{index + 1} {segment.name}
                    </p>
                    <p className="break-words text-xs leading-5 text-slate-500">
                      Revenue contribution: {formatCurrency(segment.totalRevenueContribution)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[11px] font-semibold leading-4 text-slate-700 ring-1 ring-slate-200">
                    +{segment.revenueGrowthPotential}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section className="rounded-[30px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl">
        <div className="border-b border-slate-200/80 pb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
            Smart Package Recommendation System
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Segment-targeted bundles with projected uplift
          </h2>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {segmentPackages.map((row) => {
            const primaryPackage = row.packages[0];
            if (!primaryPackage) return null;

            const impact = estimatePackageRevenueBoost(primaryPackage);

            return (
              <article
                key={`${row.segment}-${primaryPackage.id}`}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {row.segment} segment
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-slate-950">
                      {primaryPackage.packageName}
                    </h3>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                    +{formatCurrency(impact.boostValue)}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-600">
                  <span className="font-semibold text-slate-900">Services:</span>{" "}
                  {primaryPackage.includedServices.join(" · ")}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  <span className="font-semibold text-slate-900">AI insight:</span>{" "}
                  {primaryPackage.aiInsight}
                </p>
                <p className="mt-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">
                  Revenue boost: +{formatCurrency(impact.boostValue)} ({impact.boostPercent.toFixed(0)}%) vs base booking
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  Conversion likelihood: {(primaryPackage.conversionLikelihood * 100).toFixed(0)}% · Trigger: {primaryPackage.recommendedWhen}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-[30px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl">
        <div className="border-b border-slate-200/80 pb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
            Segment Decision Feed
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Segment behavior to campaign outcomes
          </h2>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {segmentDecisionCards.map((item) => (
            <DecisionInsightCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </section>
  );
}
