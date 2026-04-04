import {
  DonutGauge,
  MiniBarChart,
  MiniLineChart,
  ProgressBar,
  SectionCard,
  SoftBadge,
} from "../components/ui";
import type { MaintenanceRoom, StaffMember } from "../lib/opsMindData";
import { useMemo } from "react";

export type MaintenancePageProps = {
  rooms: MaintenanceRoom[];
  maintenanceTrend: number[];
  priorities: { room: string; value: number; note: string }[];
  staff: StaffMember[];
};

export function MaintenancePage({
  rooms,
  maintenanceTrend,
  priorities,
  staff,
}: MaintenancePageProps) {
  const criticalRooms = rooms.filter((room) => room.health < 65);
  const averageHealth = Math.round(
    rooms.reduce((sum, room) => sum + room.health, 0) /
      Math.max(rooms.length, 1),
  );
  const nextFix = priorities[0];

  const dispatchBoard = useMemo(() => {
    const sortedStaff = staff.slice().sort((left, right) => {
      const leftScore =
        left.skill * 0.45 + left.energy * 0.35 + left.guestScore * 0.2;
      const rightScore =
        right.skill * 0.45 + right.energy * 0.35 + right.guestScore * 0.2;
      return rightScore - leftScore;
    });

    return criticalRooms.map((room, index) => {
      const lead = sortedStaff[index % sortedStaff.length];
      const backup = sortedStaff[(index + 2) % sortedStaff.length];
      const urgency =
        room.health < 50
          ? "Emergency"
          : room.health < 60
            ? "Urgent"
            : "Routine";

      return {
        room,
        urgency,
        team: [lead, backup],
      };
    });
  }, [criticalRooms, staff]);

  const repairedCoverage = Math.round(
    ((rooms.length - criticalRooms.length) / Math.max(rooms.length, 1)) * 100,
  );

  const technicianReadiness = dispatchBoard.length
    ? Math.round(
        dispatchBoard
          .flatMap((dispatch) => dispatch.team)
          .reduce((sum, member) => sum + member.energy + member.skill, 0) /
          (dispatchBoard.length * 2 * 2),
      )
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Coverage
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {repairedCoverage}%
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Rooms already stable or above the intervention threshold.
          </p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Crew readiness
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {technicianReadiness}%
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Auto-assigned staff are sorted by skill, energy, and guest impact.
          </p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Auto dispatch
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {dispatchBoard.length}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Critical rooms have an assigned response team already queued.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Predictive Maintenance Radar"
          eyebrow="Failure before it happens"
        >
          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Average health
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {averageHealth}%
              </p>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Active alerts
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {criticalRooms.length}
              </p>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Autopilot
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">On</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {rooms.map((room) => (
              <div
                key={room.room}
                className="rounded-[26px] border border-slate-200 bg-slate-50 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">
                      Room {room.room}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{room.note}</p>
                  </div>
                  <SoftBadge
                    tone={
                      room.health < 65
                        ? "rose"
                        : room.health < 82
                          ? "amber"
                          : "emerald"
                    }
                  >
                    {room.health}%
                  </SoftBadge>
                </div>
                <div className="mt-4 grid gap-2 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>AC</span>
                    <span className="font-semibold text-slate-900">
                      {room.ac}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Water</span>
                    <span className="font-semibold text-slate-900">
                      {room.water}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Power</span>
                    <span className="font-semibold text-slate-900">
                      {room.power}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Priority</span>
                    <span className="font-semibold text-slate-900">
                      {room.priority}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <DonutGauge value={room.health} label="Health score" />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="Maintenance Momentum"
            eyebrow="System health curve"
          >
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <MiniLineChart
                data={maintenanceTrend}
                tone="emerald"
                height={210}
              />
            </div>
          </SectionCard>
          <SectionCard title="Critical Queue" eyebrow="Auto-ticket ranking">
            <div className="space-y-3">
              {priorities.map((priority) => (
                <div
                  key={priority.room}
                  className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">
                        Room {priority.room}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {priority.note}
                      </p>
                    </div>
                    <SoftBadge
                      tone={
                        priority.value > 80
                          ? "rose"
                          : priority.value > 60
                            ? "amber"
                            : "emerald"
                      }
                    >
                      {priority.value}
                    </SoftBadge>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <SectionCard
        title="Auto-Assigned Repair Crew"
        eyebrow="Live staff dispatch"
      >
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <div className="space-y-3">
            {dispatchBoard.length ? (
              dispatchBoard.map((dispatch) => (
                <div
                  key={dispatch.room.room}
                  className="rounded-[26px] border border-slate-200 bg-slate-50 p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">
                        Room {dispatch.room.room}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {dispatch.room.impact}
                      </p>
                    </div>
                    <SoftBadge
                      tone={
                        dispatch.urgency === "Emergency"
                          ? "rose"
                          : dispatch.urgency === "Urgent"
                            ? "amber"
                            : "emerald"
                      }
                    >
                      {dispatch.urgency}
                    </SoftBadge>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {dispatch.team.map((member) => (
                      <div
                        key={member.id}
                        className="rounded-[22px] border border-white bg-white p-3 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-slate-950">
                            {member.name}
                          </p>
                          <SoftBadge
                            tone={
                              member.energy > 80
                                ? "emerald"
                                : member.energy > 65
                                  ? "amber"
                                  : "rose"
                            }
                          >
                            {member.energy}% energy
                          </SoftBadge>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          {member.role}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                          Auto-assigned
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                No rooms need direct dispatch right now.
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Dispatch logic
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                Best-fit staff are ranked by skill, energy, and guest
                sensitivity.
              </p>
              <p className="mt-2 text-sm text-slate-600">
                The engine avoids manual allocation so maintenance can be
                resolved as a system response instead of a desk task.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Crew strength
              </p>
              <div className="mt-3 space-y-3">
                {staff
                  .slice()
                  .sort(
                    (left, right) =>
                      right.skill + right.energy - (left.skill + left.energy),
                  )
                  .slice(0, 5)
                  .map((member) => (
                    <div
                      key={member.id}
                      className="rounded-[22px] border border-slate-200 bg-white p-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950">
                            {member.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {member.role}
                          </p>
                        </div>
                        <SoftBadge
                          tone={
                            member.skill > 90
                              ? "emerald"
                              : member.skill > 80
                                ? "amber"
                                : "rose"
                          }
                        >
                          {member.skill} skill
                        </SoftBadge>
                      </div>
                      <div className="mt-3">
                        <ProgressBar
                          value={member.energy}
                          tone={
                            member.energy > 80
                              ? "emerald"
                              : member.energy > 65
                                ? "amber"
                                : "rose"
                          }
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Maintenance Priority AI"
        eyebrow="Guest impact weighted"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <MiniBarChart
              data={priorities.map((priority) => priority.value)}
              tone="amber"
              height={170}
            />
            {nextFix ? (
              <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
                  Next fix
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  Room {nextFix.room}
                </p>
                <p className="mt-1 text-sm text-slate-600">{nextFix.note}</p>
              </div>
            ) : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Auto-ticket status</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                Assigned technician and maintenance window created
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Guest impact</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                Priority scoring includes visibility and room turnover risk
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 md:col-span-2">
              <p className="text-sm text-slate-500">Engine note</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                Instead of fixing problems after complaints, Kurifitu Go
                prevents them before guests notice.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      {criticalRooms.length ? (
        <SectionCard
          title="Escalation Snapshot"
          eyebrow="Immediate attention required"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {criticalRooms.map((room) => (
              <div
                key={room.room}
                className="rounded-3xl border border-rose-200 bg-rose-50 p-4"
              >
                <p className="text-lg font-semibold text-rose-900">
                  Room {room.room}
                </p>
                <p className="mt-2 text-sm leading-6 text-rose-700">
                  {room.impact}
                </p>
                <p className="mt-3 text-sm font-semibold text-rose-900">
                  {room.note}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
