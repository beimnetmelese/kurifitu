import { SectionCard, SoftBadge } from "../components/ui";
import type {
  MaintenanceRoom,
  StaffMember,
  TwinZone,
} from "../lib/opsMindData";

export type TwinPageProps = {
  scenario: string;
  zones: TwinZone[];
  staff: StaffMember[];
  rooms: MaintenanceRoom[];
  story: string[];
};

type CommercialSignal = {
  zone: string;
  item: string;
  units: number;
  conversion: number;
  revenue: number;
  heatIndex: number;
};

type ZoneLayout = {
  left: string;
  top: string;
  accent: string;
};

function getZoneLayout(zoneName: string): ZoneLayout {
  if (zoneName === "Pool") {
    return { left: "14%", top: "12%", accent: "from-cyan-400 to-sky-500" };
  }
  if (zoneName === "Rooms") {
    return {
      left: "70%",
      top: "16%",
      accent: "from-violet-400 to-fuchsia-500",
    };
  }
  if (zoneName === "Restaurant") {
    return {
      left: "44%",
      top: "42%",
      accent: "from-amber-400 to-orange-500",
    };
  }
  if (zoneName === "Spa") {
    return {
      left: "24%",
      top: "70%",
      accent: "from-emerald-400 to-teal-500",
    };
  }
  return { left: "74%", top: "64%", accent: "from-sky-400 to-indigo-500" };
}

function ParticleField({
  density,
  tone,
}: {
  density: number;
  tone: "cyan" | "violet" | "emerald" | "amber";
}) {
  return (
    <>
      {Array.from({ length: density }).map((_, index) => (
        <span
          key={index}
          className={`absolute h-2.5 w-2.5 rounded-full ${tone === "cyan" ? "bg-cyan-400" : tone === "violet" ? "bg-violet-400" : tone === "emerald" ? "bg-emerald-400" : "bg-amber-400"} shadow-[0_0_18px_rgba(255,255,255,0.5)]`}
          style={{
            left: `${((index * 19 + density * 7) % 88) + 4}%`,
            top: `${((index * 17 + density * 11) % 78) + 8}%`,
            animationDelay: `${index * 110}ms`,
            animationDuration: `${2.2 + (index % 4) * 0.4}s`,
          }}
        />
      ))}
    </>
  );
}

export function TwinPage({
  scenario,
  zones,
  staff,
  rooms,
  story,
}: TwinPageProps) {
  const poolLoad = zones.find((zone) => zone.name === "Pool")?.activity ?? 0;
  const restaurantLoad =
    zones.find((zone) => zone.name === "Restaurant")?.activity ?? 0;
  const activeZones = zones.filter((zone) => zone.activity > 55).length;

  const salesCatalog: Record<string, { item: string; unitPrice: number }> = {
    Pool: { item: "Pool Bar Signature Set", unitPrice: 22 },
    Rooms: { item: "In-Room Comfort Bundle", unitPrice: 34 },
    Restaurant: { item: "Chef Tasting Menu", unitPrice: 46 },
    Spa: { item: "Recovery Ritual Session", unitPrice: 58 },
    Lobby: { item: "Lobby Lounge Fast Pass", unitPrice: 19 },
  };

  const zoneCommercialSignals = zones
    .map((zone) => {
      const catalog = salesCatalog[zone.name] ?? {
        item: `${zone.name} Premium Service`,
        unitPrice: 25,
      };
      const heatIndex = Math.round(zone.activity * 0.62 + zone.flow * 0.38);
      const units = Math.max(
        10,
        Math.round(zone.activity * 1.4 + zone.flow * 0.8),
      );
      const conversion = Math.min(
        94,
        Math.max(18, Math.round(zone.flow * 0.72)),
      );
      const revenue = units * catalog.unitPrice;
      return {
        zone: zone.name,
        item: catalog.item,
        units,
        conversion,
        revenue,
        heatIndex,
      };
    })
    .sort((left, right) => right.revenue - left.revenue) as CommercialSignal[];

  const projectedSales = zoneCommercialSignals.reduce(
    (total, signal) => total + signal.revenue,
    0,
  );
  const demandIndex = Math.round(
    zones.reduce((total, zone) => total + zone.activity, 0) /
      Math.max(1, zones.length),
  );
  const topSeller = zoneCommercialSignals[0];
  const signalByZone: Record<string, CommercialSignal> = Object.fromEntries(
    zoneCommercialSignals.map((signal) => [signal.zone, signal]),
  );
  const totalActivity = zones.reduce((total, zone) => total + zone.activity, 0);
  const zonePeopleSignals: Record<
    string,
    { staffCount: number; guestCount: number }
  > = Object.fromEntries(
    zones.map((zone) => {
      const share = zone.activity / Math.max(1, totalActivity);
      const staffCount = Math.max(1, Math.round(share * staff.length));
      const guestCount = Math.max(
        8,
        Math.round(zone.activity * 2.2 + zone.flow * 1.35),
      );
      return [zone.name, { staffCount, guestCount }];
    }),
  );

  return (
    <div className="space-y-6">
      <SectionCard title="Resort Digital Twin" eyebrow="A living simulation">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-gradient-to-br from-[#030712] via-[#0b1324] to-[#111827] p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.38)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.2),transparent_24%),radial-gradient(circle_at_84%_84%,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_72%_18%,rgba(167,139,250,0.14),transparent_24%)]" />

            <div className="relative z-10 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/90">
                  Live floor map
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Real-time operational twin with zone telemetry
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                Live sync
              </div>
            </div>

            <div className="relative z-10 mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(140deg,rgba(15,23,42,0.8)_0%,rgba(30,41,59,0.72)_100%)] p-4 lg:h-[520px] lg:overflow-visible">
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(148,163,184,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:28px_28px]" />
              <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(59,130,246,0.08)_50%,transparent_50%)] [background-size:100%_8px]" />

              <div className="relative z-10 space-y-3 lg:hidden">
                <div className="grid gap-2 sm:grid-cols-2">
                  {zones.map((zone) => {
                    const zoneSignal = signalByZone[zone.name];
                    const peopleSignal = zonePeopleSignals[zone.name];
                    const layout = getZoneLayout(zone.name);
                    return (
                      <article
                        key={`${zone.name}-mobile`}
                        className="relative overflow-hidden rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md"
                      >
                        <p className="text-sm font-semibold text-white">
                          {zone.name}
                        </p>
                        <p className="text-xs text-slate-200">
                          Flow {zone.flow}% | Activity {zone.activity}%
                        </p>
                        <p className="mt-1 text-[11px] text-slate-300">
                          Rev/hr ${zoneSignal?.revenue.toLocaleString() ?? "-"}{" "}
                          | {zoneSignal?.units ?? "-"} orders
                        </p>
                        <p className="mt-1 text-[11px] text-slate-300">
                          Staff {peopleSignal?.staffCount ?? 0} | Guests{" "}
                          {peopleSignal?.guestCount ?? 0}
                        </p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${layout.accent}`}
                            style={{
                              width: `${Math.min(100, zone.activity)}%`,
                            }}
                          />
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/15 bg-slate-900/55 px-3 py-2 backdrop-blur">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200">
                      Active zones
                    </p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      {activeZones}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/15 bg-slate-900/55 px-3 py-2 backdrop-blur">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200">
                      Staff on floor
                    </p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      {staff.length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/15 bg-slate-900/55 px-3 py-2 backdrop-blur">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200">
                      Digital sync
                    </p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      99.3%
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                {zones.map((zone) => {
                  const layout = getZoneLayout(zone.name);
                  const heatAlpha = Math.max(
                    0.2,
                    Math.min(0.82, zone.activity / 100),
                  );
                  const heatSize = 120 + Math.round(zone.flow * 1.2);
                  return (
                    <div
                      key={`${zone.name}-heat`}
                      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                      style={{
                        left: layout.left,
                        top: layout.top,
                        width: `${heatSize}px`,
                        height: `${heatSize}px`,
                        opacity: heatAlpha,
                        background:
                          zone.activity > 70
                            ? "radial-gradient(circle, rgba(248,113,113,0.85) 0%, rgba(251,146,60,0.48) 50%, rgba(248,113,113,0) 78%)"
                            : zone.activity > 52
                              ? "radial-gradient(circle, rgba(250,204,21,0.78) 0%, rgba(253,186,116,0.45) 50%, rgba(250,204,21,0) 76%)"
                              : "radial-gradient(circle, rgba(52,211,153,0.75) 0%, rgba(45,212,191,0.4) 50%, rgba(52,211,153,0) 76%)",
                      }}
                    />
                  );
                })}

                {zones.map((zone) => {
                  const layout = getZoneLayout(zone.name);
                  return (
                    <div
                      key={`${zone.name}-ring`}
                      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30"
                      style={{
                        left: layout.left,
                        top: layout.top,
                        width: `${88 + Math.round(zone.flow * 0.6)}px`,
                        height: `${88 + Math.round(zone.flow * 0.6)}px`,
                        opacity: 0.45,
                      }}
                    />
                  );
                })}

                <div className="absolute left-[20%] top-[24%] h-px w-[30%] rotate-[18deg] bg-gradient-to-r from-cyan-300/0 via-cyan-300/70 to-cyan-300/0" />
                <div className="absolute left-[49%] top-[34%] h-px w-[23%] -rotate-[30deg] bg-gradient-to-r from-violet-300/0 via-violet-300/70 to-violet-300/0" />
                <div className="absolute left-[34%] top-[56%] h-px w-[20%] rotate-[36deg] bg-gradient-to-r from-emerald-300/0 via-emerald-300/70 to-emerald-300/0" />
                <div className="absolute left-[52%] top-[58%] h-px w-[24%] -rotate-[8deg] bg-gradient-to-r from-amber-300/0 via-amber-300/70 to-amber-300/0" />

                <div className="pointer-events-none absolute inset-0 opacity-30">
                  <ParticleField density={12} tone="cyan" />
                </div>

                {zones.map((zone) => {
                  const layout = getZoneLayout(zone.name);
                  const zoneSignal = signalByZone[zone.name];
                  const peopleSignal = zonePeopleSignals[zone.name];
                  const hotspotTone =
                    zone.activity > 66
                      ? "bg-rose-400"
                      : zone.activity > 50
                        ? "bg-amber-300"
                        : "bg-emerald-400";
                  const labelPosition =
                    zone.name === "Pool"
                      ? {
                          left: `calc(${layout.left} + 22px)`,
                          top: `calc(${layout.top} + 24px)`,
                          alignClass: "translate-x-0",
                        }
                      : zone.name === "Rooms"
                        ? {
                            left: `calc(${layout.left} - 120px)`,
                            top: `calc(${layout.top} - 40px)`,
                            alignClass: "translate-x-0",
                          }
                        : zone.name === "Restaurant"
                          ? {
                              left: layout.left,
                              top: `calc(${layout.top} + 24px)`,
                              alignClass: "-translate-x-1/2",
                            }
                          : zone.name === "Spa"
                            ? {
                                left: `calc(${layout.left} + 18px)`,
                                top: `calc(${layout.top} - 36px)`,
                                alignClass: "translate-x-0",
                              }
                            : {
                                left: `calc(${layout.left} - 126px)`,
                                top: `calc(${layout.top} + 18px)`,
                                alignClass: "translate-x-0",
                              };

                  return (
                    <div key={zone.name}>
                      <div
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: layout.left, top: layout.top }}
                      >
                        <span
                          className={`absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full ${hotspotTone} opacity-35 blur-sm animate-pulse`}
                        />
                        <span
                          className={`absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full ${hotspotTone} opacity-30 animate-ping`}
                        />
                        <span
                          className={`relative block h-4 w-4 rounded-full border-2 border-white/90 ${hotspotTone} shadow-[0_0_24px_rgba(255,255,255,0.45)]`}
                        />
                      </div>

                      <div
                        className={`absolute min-w-[118px] max-w-[132px] rounded-lg border border-white/20 bg-slate-900/90 px-2 py-1 text-center backdrop-blur ${labelPosition.alignClass}`}
                        style={{
                          left: labelPosition.left,
                          top: labelPosition.top,
                        }}
                      >
                        <p className="text-[10px] font-semibold leading-4 text-white">
                          {zone.name}
                        </p>
                        <p className="text-[9px] leading-4 text-slate-300">
                          {zone.activity}% act | {zone.flow}% flow | $
                          {zoneSignal?.revenue.toLocaleString() ?? "-"}
                        </p>
                        <p className="text-[9px] leading-4 text-slate-300">
                          Staff {peopleSignal?.staffCount ?? 0} | Guests{" "}
                          {peopleSignal?.guestCount ?? 0}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div className="absolute bottom-4 left-4 right-4 grid gap-2 xl:grid-cols-3">
                  <div className="rounded-xl border border-white/15 bg-slate-900/55 px-3 py-2 backdrop-blur">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200">
                      Active zones
                    </p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      {activeZones}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/15 bg-slate-900/55 px-3 py-2 backdrop-blur">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200">
                      Staff on floor
                    </p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      {staff.length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/15 bg-slate-900/55 px-3 py-2 backdrop-blur">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200">
                      Digital sync
                    </p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      99.3%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Scenario</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {scenario}
              </p>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">AI interpretation</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                The resort has become a living system with moving staff,
                changing zones, and reactive guest flow.
              </p>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Commercial pulse</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    Demand index
                  </p>
                  <p className="mt-1 text-xl font-semibold text-slate-950">
                    {demandIndex}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    Projected sales
                  </p>
                  <p className="mt-1 text-xl font-semibold text-slate-950">
                    ${projectedSales.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    Top seller
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-950">
                    {topSeller ? topSeller.item : "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">What sells most now</p>
              <div className="mt-3 space-y-2">
                {zoneCommercialSignals.slice(0, 5).map((signal, index) => (
                  <div
                    key={signal.zone}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        #{index + 1} {signal.item}
                      </p>
                      <SoftBadge
                        tone={
                          signal.heatIndex > 70
                            ? "rose"
                            : signal.heatIndex > 52
                              ? "amber"
                              : "emerald"
                        }
                      >
                        {signal.heatIndex}
                      </SoftBadge>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500"
                        style={{
                          width: `${Math.min(100, Math.round((signal.revenue / Math.max(1, topSeller?.revenue ?? signal.revenue)) * 100))}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      {signal.zone} | {signal.units} orders |{" "}
                      {signal.conversion}% conversion | $
                      {signal.revenue.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">
                Revenue lanes (last 60 min)
              </p>
              <div className="mt-3 space-y-2">
                {zoneCommercialSignals.slice(0, 4).map((signal) => (
                  <div
                    key={`${signal.zone}-lane`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-2"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>{signal.zone}</span>
                      <span>
                        ${Math.round(signal.revenue / 6).toLocaleString()} / 10m
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500"
                        style={{
                          width: `${Math.min(100, signal.conversion)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Story mode</p>
              <div className="mt-3 space-y-3">
                {story.map((line) => (
                  <div
                    key={line}
                    className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Live Movement" eyebrow="Staff and guest flow">
          <div className="grid gap-3 md:grid-cols-2">
            {staff.map((person) => (
              <div
                key={person.id}
                className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-950">{person.name}</p>
                  <SoftBadge
                    tone={
                      person.status === "Idle"
                        ? "amber"
                        : person.status === "Assigned"
                          ? "violet"
                          : "emerald"
                    }
                  >
                    {person.area}
                  </SoftBadge>
                </div>
                <p className="mt-1 text-sm text-slate-500">{person.role}</p>
                <p className="mt-2 text-sm text-slate-600">
                  Energy {person.energy}% | Skill {person.skill}%
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="System Health"
          eyebrow="Real-time digital twin signals"
        >
          <div className="grid gap-3">
            {rooms.slice(0, 4).map((room) => (
              <div
                key={room.room}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-950">
                    Room {room.room}
                  </p>
                  <SoftBadge
                    tone={
                      room.health > 80
                        ? "emerald"
                        : room.health > 60
                          ? "amber"
                          : "rose"
                    }
                  >
                    {room.health}%
                  </SoftBadge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{room.note}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Guest Flow Intelligence"
        eyebrow="Digital twin insights"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Most active zone</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              Pool and restaurant flow are the dominant movement paths.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Sales hotspot</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {topSeller
                ? `${topSeller.zone} currently drives ${topSeller.units} orders and $${topSeller.revenue.toLocaleString()} projected revenue.`
                : "The twin shows where pressure built up first."}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Pressure watch</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              Pool load is {poolLoad}% and restaurant load is {restaurantLoad}%.
              Heat map intensity follows guest movement and demand spikes.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
