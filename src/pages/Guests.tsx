import DecisionInsightCard from "../components/common/DecisionInsightCard";
import { guests } from "../data/guests";
import { predictGuestValue } from "../services/predictionService.ts";
import {
  generatePersonalizedMessage,
  getPurchaseLikelihood,
  getRecommendations,
} from "../services/recommendationService.ts";
import { formatCurrency } from "../utils/formatCurrency";
import type { DecisionInsight } from "../types/decisionInsight";

export default function Guests() {
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

  const decisionCards: DecisionInsight[] = guestInsights.map((guest) => {
    const topOffer = guest.recommendations[0] || "Personalized concierge package";
    const confidence = Math.round((guest.purchaseLikelihood || 0) * 100);
    const expectedGain = Math.round((guest.predictedSpend || 0) * ((guest.purchaseLikelihood || 0) * 0.18));

    return {
      id: `${guest.name}-${guest.segment}`,
      title: `${guest.name} (${guest.segment})`,
      prediction: `Predicted spend ${formatCurrency(guest.predictedSpend)} with ${confidence}% purchase likelihood.`,
      insight: guest.personalizedMessage,
      recommendedAction: `Promote ${topOffer} during check-in and follow up with in-stay push messaging.`,
      expectedImpact: `+${formatCurrency(expectedGain)} expected incremental spend`,
      confidence,
      reason: `Preference signals: ${(guest.preferences || []).join(", ") || "Behavioral profile"}.`,
      tone: confidence >= 75 ? "success" : confidence >= 50 ? "info" : "warning",
    };
  });

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
            Predicted spend to upsell action
          </h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {decisionCards.map((item) => (
            <DecisionInsightCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </section>
  );
}
