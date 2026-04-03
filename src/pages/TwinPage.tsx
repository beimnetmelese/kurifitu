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

  return (
    <div className="space-y-6">
      <SectionCard title="Resort Digital Twin" eyebrow="A living simulation">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.18),transparent_30%)]" />
            <div className="relative z-10 grid gap-4 md:grid-cols-2">
              {zones.map((zone) => (
                <div
                  key={zone.name}
                  className="relative min-h-[170px] overflow-hidden rounded-[24px] border border-white/10 bg-white/6 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold">{zone.name}</p>
                    <SoftBadge
                      tone={
                        zone.activity > 66
                          ? "rose"
                          : zone.activity > 50
                            ? "amber"
                            : "emerald"
                      }
                    >
                      {zone.activity}%
                    </SoftBadge>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">
                    Flow {zone.flow}%
                  </p>
                  <div className="absolute inset-0 overflow-hidden">
                    <ParticleField
                      density={Math.max(4, Math.round(zone.flow / 11))}
                      tone={
                        zone.name === "Pool"
                          ? "cyan"
                          : zone.name === "Rooms"
                            ? "violet"
                            : zone.name === "Spa"
                              ? "emerald"
                              : "amber"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="relative z-10 mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.26em] text-cyan-200">
                  Active zones
                </p>
                <p className="mt-2 text-2xl font-semibold">{activeZones}</p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.26em] text-cyan-200">
                  Staff on floor
                </p>
                <p className="mt-2 text-2xl font-semibold">{staff.length}</p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.26em] text-cyan-200">
                  Sync mode
                </p>
                <p className="mt-2 text-2xl font-semibold">Live</p>
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
              <p className="text-sm text-slate-500">Critical pressure zones</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Pool load</span>
                  <SoftBadge tone={poolLoad > 65 ? "rose" : "amber"}>
                    {poolLoad}
                  </SoftBadge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Restaurant load</span>
                  <SoftBadge tone={restaurantLoad > 65 ? "rose" : "amber"}>
                    {restaurantLoad}
                  </SoftBadge>
                </div>
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
            <p className="text-sm text-slate-500">AI replay</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              The twin shows where pressure built up first.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Hackathon line</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              We don't just show resort data. We simulate the resort.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
