import { useMemo, useState } from "react";
import { guests } from "../data/guests";
import { predictGuestValue } from "../services/predictionService.ts";
import {
  generatePersonalizedMessage,
  getPurchaseLikelihood,
  getRecommendations,
} from "../services/recommendationService.ts";
import { formatCurrency } from "../utils/formatCurrency";

type GuestActionView = {
  name: string;
  segment: string;
  predictedSpend: number;
  insight: string;
  recommendation: string;
  whyRecommendation: string;
  revenueImpact: number;
  purchaseLikelihood: number;
  confidence: number;
  preferences: string[];
};

export default function Guests() {
  const [searchQuery, setSearchQuery] = useState("");

  const guestInsights = guests.map((guest) => ({
    ...guest,
    predictedSpend: predictGuestValue(guest),
    purchaseLikelihood: getPurchaseLikelihood(guest),
    recommendations: getRecommendations(guest),
    personalizedMessage: generatePersonalizedMessage(guest),
  }));

  const avgMatch =
    guestInsights.length > 0
      ? guestInsights.reduce(
          (sum, guest) => sum + guest.purchaseLikelihood * 100,
          0,
        ) / guestInsights.length
      : 0;

  const guestActionCards: GuestActionView[] = guestInsights.map((guest) => {
    const topOffer = guest.recommendations[0] || "Personalized concierge package";
    const purchaseLikelihood = Math.round((guest.purchaseLikelihood || 0) * 100);
    const confidence = Math.min(
      95,
      Math.max(68, purchaseLikelihood + (guest.preferences?.length || 0) * 2),
    );
    const expectedGain = Math.round(
      (guest.predictedSpend || 0) * ((guest.purchaseLikelihood || 0) * 0.22),
    );
    const primaryPreference = guest.preferences?.[0] || "resort experiences";

    return {
      name: guest.name || "Guest",
      segment: guest.segment || "General",
      predictedSpend: guest.predictedSpend || 0,
      insight: guest.personalizedMessage,
      recommendation: topOffer,
      whyRecommendation: `Top preference is ${primaryPreference} and behavioral profile indicates strong affinity for ${guest.segment?.toLowerCase() || "personalized"} offers.`,
      revenueImpact: expectedGain,
      purchaseLikelihood,
      confidence,
      preferences: guest.preferences || [],
    };
  });

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredGuestCards = useMemo(() => {
    if (!normalizedQuery) return guestActionCards;

    return guestActionCards.filter((guest) =>
      guest.name.toLowerCase().includes(normalizedQuery),
    );
  }, [guestActionCards, normalizedQuery]);

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-slate-950 px-6 py-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_28%)]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200/90">
              Guest Intelligence
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Guest Personalization
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Personalized recommendations and spend predictions by guest.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
                Guests
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {guestInsights.length}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Avg. fit
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {avgMatch.toFixed(0)}%
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-100">
                Offers
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                3 curated actions
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-[30px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl">
        <div className="border-b border-slate-200/80 pb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
            Guest Decision Feed
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Personalized offers with revenue outcomes
          </h2>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Showing {filteredGuestCards.length} of {guestActionCards.length} guests
          </p>
          <label className="w-full sm:max-w-sm">
            <span className="sr-only">Search guest by name</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search guests by name"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
          </label>
        </div>

        {filteredGuestCards.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            No guests found for "{searchQuery}". Try a different name.
          </div>
        ) : null}

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredGuestCards.map((item) => (
            <article
              key={`${item.name}-${item.segment}`}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-950">{item.name}</h3>
                  <p className="text-xs text-slate-500">Segment: {item.segment}</p>
                </div>
                <span className="rounded-full border border-white bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                  {item.confidence}% confidence
                </span>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Predicted Spend
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatCurrency(item.predictedSpend)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Purchase Likelihood
                  </p>
                  <p className="mt-1 text-sm font-semibold text-cyan-700">
                    {item.purchaseLikelihood}%
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">Insight:</span>{" "}
                  {item.insight}
                </p>
                <p className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 font-semibold text-cyan-800">
                  Recommendation: {item.recommendation}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Why this recommendation:</span>{" "}
                  {item.whyRecommendation}
                </p>
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 font-semibold text-emerald-700">
                  Revenue Impact: +{formatCurrency(item.revenueImpact)} expected upsell
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {item.preferences.map((preference) => (
                  <span
                    key={`${item.name}-${preference}`}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700"
                  >
                    {preference}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
