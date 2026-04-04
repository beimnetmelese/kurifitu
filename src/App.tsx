import { useEffect, useState } from "react";
import RevenueOverviewPage from "./pages/RevenueOverview";
import GuestsPage from "./pages/Guests";
import PricingPage from "./pages/Pricing";
import SegmentsPage from "./pages/Segments";
import { OverviewPage } from "./pages/OverviewPage";
import { WorkforcePage } from "./pages/WorkforcePage";
import { MaintenancePage } from "./pages/MaintenancePage";
import { InventoryPage } from "./pages/InventoryPage";
import { TwinPage } from "./pages/TwinPage";
import { StrategyPage } from "./pages/StrategyPage";
import {
  getUserProfileFromStorage,
  fetchUserProfile,
} from "./services/userService";
import {
  initialDecisions,
  initialHighlights,
  initialInventory,
  initialRooms,
  initialStaff,
  initialZones,
  scenarioPresets,
  scenarioStory,
  scenarios,
  type ScenarioKey,
} from "./lib/opsMindData";
import Dashboard from "./components/dashboard.tsx";
import FeedbackList from "./components/feedback.tsx";
import AnalyticsDashboard from "./components/analytic.tsx";
import FAQTrainer from "./components/faq.tsx";
import HomePage from "./pages/Home";
import AssistantPage from "./pages/Assistant";
import GuestFeedbackPage from "./pages/Feedback";
import RoomControlsPage from "./pages/RoomControls";
import MenuSuggestionsPage from "./pages/MenuSuggestions";
import kuriftuLogo from "./assets/kuriftu.png";

type AppMode = "admin" | "guest";

type AdminPageKey =
  | "overview"
  | "Staff Scheduling"
  | "maintenance"
  | "inventory"
  | "twin"
  | "strategy"
  | "revenueOverview"
  | "guests"
  | "segments"
  | "pricing"
  | "feedbackDashboard"
  | "feedbackStream"
  | "analyticsLab"
  | "faqTrainer";

type GuestPageKey =
  | "home"
  | "assistant"
  | "menuSuggestions"
  | "roomControls"
  | "feedback";

type AdminNavItem = { key: AdminPageKey; label: string; detail: string };

type AdminSection = {
  title: string;
  description: string;
  items: AdminNavItem[];
};

const adminSections: AdminSection[] = [
  {
    title: "Feedback Analysis",
    description: "Sentiment, streams, and answer training",
    items: [
      {
        key: "feedbackDashboard",
        label: "Feedback Dashboard",
        detail: "Executive sentiment summary",
      },
      {
        key: "feedbackStream",
        label: "Feedback Stream",
        detail: "Live customer feedback feed",
      },
      {
        key: "analyticsLab",
        label: "Analytics Lab",
        detail: "Cross-sector sentiment analytics",
      },
      {
        key: "faqTrainer",
        label: "FAQ Trainer",
        detail: "Train answer suggestions",
      },
    ],
  },
  {
    title: "Resort Operations",
    description: "Live command, labor, assets, and scenarios",
    items: [
      {
        key: "overview",
        label: "Overview",
        detail: "Real-time command center",
      },
      {
        key: "Staff Scheduling",
        label: "Staff Scheduling",
        detail: "Team load and scheduling",
      },
      {
        key: "maintenance",
        label: "Maintenance",
        detail: "Preventive maintenance insights",
      },
      {
        key: "inventory",
        label: "Inventory",
        detail: "Stock, demand, and risk",
      },
      { key: "twin", label: "Twin", detail: "Operational digital twin" },
      {
        key: "strategy",
        label: "Strategy",
        detail: "Scenario planning and what-if",
      },
    ],
  },
  {
    title: "Revenue Generation",
    description: "Monetization, guest value, and pricing",
    items: [
      {
        key: "revenueOverview",
        label: "Revenue Overview",
        detail: "AI revenue command center",
      },
      {
        key: "guests",
        label: "Guests",
        detail: "Personalization and spend insights",
      },
      {
        key: "segments",
        label: "Segments",
        detail: "Audience strategy and value",
      },
      {
        key: "pricing",
        label: "Pricing",
        detail: "Dynamic price recommendations",
      },
    ],
  },
];

const adminTabs = adminSections.flatMap((section) => section.items);

const guestTabs: { key: GuestPageKey; label: string; detail: string }[] = [
  { key: "home", label: "Home", detail: "Kurifitu Go guest hub" },
  { key: "assistant", label: "AI Assistant", detail: "Personalized support" },
  {
    key: "menuSuggestions",
    label: "Menu Suggestions",
    detail: "Curated dining picks",
  },
  {
    key: "roomControls",
    label: "Room Controls",
    detail: "Ambiance and comfort",
  },
  { key: "feedback", label: "Guest Feedback", detail: "Share and learn" },
];

function App({ mode = "admin" }: { mode?: AppMode }) {
  const isGuestMode = mode === "guest";
  const [adminPage, setAdminPage] = useState<AdminPageKey>("feedbackDashboard");
  const [guestPage, setGuestPage] = useState<GuestPageKey>("home");
  const [adminScenario, setAdminScenario] =
    useState<ScenarioKey>("Calm Morning");
  const adminPreset = scenarioPresets[adminScenario];

  useEffect(() => {
    const loadUserProfile = async () => {
      let profile = getUserProfileFromStorage();
      if (!profile) {
        profile = await fetchUserProfile();
      }
    };
    loadUserProfile();
  }, []);

  const adminOccupancyTrend = [68, 70, 71, 75, 78, 81].map(
    (value, index) => value + adminPreset.activityBias + (index === 5 ? 1 : 0),
  );
  const adminRevenueTrend = [12400, 12900, 13400, 14100, 14850, 15500].map(
    (value, index) =>
      value +
      adminPreset.inventoryBias * 140 +
      adminPreset.activityBias * 30 * index,
  );
  const adminFlowTrend = [42, 50, 56, 61, 67, 72].map(
    (value) => value + adminPreset.activityBias,
  );

  const adminKpis = [
    {
      label: "Active Guests",
      value: 240 + adminPreset.activityBias * 8,
      tone: "cyan" as const,
    },
    {
      label: "Staff On Duty",
      value:
        initialStaff.filter((member) => member.status !== "Idle").length +
        adminPreset.staffingBias,
      tone: "violet" as const,
    },
    {
      label: "Occupancy Rate",
      value: 72 + adminPreset.activityBias,
      suffix: "%",
      tone: "emerald" as const,
    },
    {
      label: "Revenue Today",
      value: 14800 + adminPreset.inventoryBias * 280,
      tone: "amber" as const,
    },
    {
      label: "System Health",
      value: Math.max(70, 96 - adminPreset.maintenanceBias * 3),
      suffix: "%",
      tone: "rose" as const,
    },
  ];

  const adminAreaLoads = [
    {
      area: "Pool" as const,
      load: Math.min(98, initialZones[0].activity + adminPreset.activityBias),
      target: 60,
    },
    {
      area: "Restaurant" as const,
      load: Math.min(98, initialZones[2].activity + adminPreset.activityBias),
      target: 68,
    },
    {
      area: "Lobby" as const,
      load: Math.min(98, initialZones[4].flow + adminPreset.activityBias),
      target: 45,
    },
    {
      area: "Spa" as const,
      load: Math.min(98, initialZones[3].activity + adminPreset.activityBias),
      target: 52,
    },
    {
      area: "Bar" as const,
      load: Math.min(98, 44 + adminPreset.activityBias),
      target: 58,
    },
  ];

  const adminEnergyCurve = initialStaff
    .map((member) => member.energy)
    .slice(0, 6);
  const adminMaintenanceTrend = initialRooms.map((room) => room.health);
  const adminPriorities = initialRooms
    .slice()
    .sort((left, right) => right.priority - left.priority)
    .slice(0, 4)
    .map((room) => ({
      room: room.room,
      value: room.priority,
      note: room.note,
    }));
  const adminDemandCurve = initialInventory.map((item) => item.demand);
  const adminStockCurve = initialInventory.map((item) => item.stock);
  const adminScenarioMatrix = [
    {
      label: "Guest demand",
      values: [58, 61, 65, 69, 74, 80].map(
        (value) => value + adminPreset.activityBias,
      ),
    },
    {
      label: "Staff load",
      values: [28, 31, 36, 40, 44, 48].map(
        (value) => value + adminPreset.staffingBias,
      ),
    },
    {
      label: "Inventory pressure",
      values: [35, 41, 44, 49, 57, 64].map(
        (value) => value + adminPreset.inventoryBias,
      ),
    },
  ];
  const adminRecommendation =
    adminScenario === "Weekend Rush"
      ? "Pool demand is rising in 20 minutes. Reallocate two staff from lobby to pool and restaurant now."
      : adminScenario === "Rain Alert"
        ? "Shift energy into indoor services, reserve spa coverage, and reduce pool staffing by one."
        : adminScenario === "VIP Arrival"
          ? "Reserve your highest-rated concierge and spa staff for the arrival corridor."
          : adminScenario === "Event Night"
            ? "Front-load bar and kitchen coverage, then add inventory safety stock before the surge."
            : "Maintain balanced coverage, preserve staff energy, and keep automatic maintenance watch active.";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("user_profile");
    window.location.replace("/");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [adminPage, guestPage, isGuestMode]);

  if (isGuestMode) {
    const currentGuestTab =
      guestTabs.find((tab) => tab.key === guestPage) ?? guestTabs[0];

    const guestPageContent = (() => {
      switch (guestPage) {
        case "home":
          return <HomePage onNavigate={(nextPage) => setGuestPage(nextPage)} />;
        case "assistant":
          return <AssistantPage onNavigate={() => setGuestPage("home")} />;
        case "menuSuggestions":
          return (
            <MenuSuggestionsPage onNavigate={() => setGuestPage("home")} />
          );
        case "roomControls":
          return <RoomControlsPage onNavigate={() => setGuestPage("home")} />;
        case "feedback":
          return <GuestFeedbackPage onNavigate={() => setGuestPage("home")} />;
        default:
          return null;
      }
    })();

    return (
      <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_24%)]" />
        <div className="relative mx-auto max-w-[1600px] px-4 py-5 lg:px-6 lg:py-6">
          <header className="sticky top-4 z-30 mb-6 rounded-[28px] border border-white/80 bg-white/92 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={kuriftuLogo}
                  alt="Kuriftu logo"
                  className="h-11 w-11 rounded-2xl object-cover ring-1 ring-white/70 shadow-[0_12px_28px_rgba(34,197,94,0.18)]"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    Kurifitu Go Guest
                  </p>
                  <p className="text-xs text-slate-500">
                    Kurifitu Go personalized dining and room interactions
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800 ring-1 ring-cyan-200">
                  Current page: {currentGuestTab.label}
                </span>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white ring-1 ring-slate-900">
                  Mode: Guest
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="rounded-[30px] border border-slate-200/80 bg-white/92 p-4 shadow-[0_18px_48px_rgba(15,23,42,0.07)] backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                Guest Pages
              </p>
              <div className="mt-3 space-y-1.5">
                {guestTabs.map((tab) => {
                  const isActive = guestPage === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setGuestPage(tab.key)}
                      className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${isActive ? "bg-slate-950 text-white shadow-[0_10px_22px_rgba(15,23,42,0.2)]" : "bg-slate-50 text-slate-700 hover:bg-white hover:text-slate-950 hover:shadow-sm"}`}
                    >
                      <p className="font-semibold">{tab.label}</p>
                      <p
                        className={`text-xs ${isActive ? "text-slate-300" : "text-slate-500"}`}
                      >
                        {tab.detail}
                      </p>
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="space-y-6">
              <section className="rounded-[32px] border border-slate-200/80 bg-white/90 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl lg:px-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                      {currentGuestTab.label}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {currentGuestTab.detail}
                    </p>
                  </div>
                  <p className="max-w-2xl text-sm text-slate-600">
                    Explore Kurifitu Go guest tools designed for a polished,
                    personalized dining experience.
                  </p>
                </div>
              </section>

              <section className="rounded-[36px] border border-slate-200/80 bg-white/70 p-4 shadow-[0_22px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:p-6">
                <div className="space-y-6">{guestPageContent}</div>
              </section>
            </section>
          </main>
        </div>
      </div>
    );
  }

  const currentAdminTab =
    adminTabs.find((tab) => tab.key === adminPage) ?? adminTabs[0];

  const adminPageContent = (() => {
    switch (adminPage) {
      case "overview":
        return (
          <OverviewPage
            scenario={adminScenario}
            weather={adminPreset.weather}
            summary={adminPreset.summary}
            kpis={adminKpis}
            highlights={initialHighlights}
            decisions={initialDecisions}
            occupancyTrend={adminOccupancyTrend}
            revenueTrend={adminRevenueTrend}
            flowTrend={adminFlowTrend}
            story={scenarioStory[adminScenario]}
          />
        );
      case "Staff Scheduling":
        return (
          <WorkforcePage
            scenario={adminScenario}
            staff={initialStaff}
            recommendation={adminRecommendation}
            areaLoads={adminAreaLoads}
            energyCurve={adminEnergyCurve}
          />
        );
      case "maintenance":
        return (
          <MaintenancePage
            rooms={initialRooms}
            maintenanceTrend={adminMaintenanceTrend}
            priorities={adminPriorities}
            staff={initialStaff}
          />
        );
      case "inventory":
        return (
          <InventoryPage
            items={initialInventory}
            demandCurve={adminDemandCurve}
            stockCurve={adminStockCurve}
          />
        );
      case "twin":
        return (
          <TwinPage
            scenario={adminScenario}
            zones={initialZones}
            staff={initialStaff}
            rooms={initialRooms}
            story={scenarioStory[adminScenario]}
          />
        );
      case "strategy":
        return (
          <StrategyPage
            currentScenario={adminScenario}
            scenarios={scenarios}
            scenarioSummary={adminPreset.summary}
            scenarioStory={scenarioStory[adminScenario]}
            scenarioMatrix={adminScenarioMatrix}
            onScenarioChange={setAdminScenario}
          />
        );
      case "revenueOverview":
        return <RevenueOverviewPage />;
      case "guests":
        return <GuestsPage />;
      case "segments":
        return <SegmentsPage />;
      case "pricing":
        return <PricingPage />;
      case "feedbackDashboard":
        return <Dashboard />;
      case "feedbackStream":
        return <FeedbackList />;
      case "analyticsLab":
        return <AnalyticsDashboard />;
      case "faqTrainer":
        return <FAQTrainer />;
      default:
        return null;
    }
  })();

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(132,204,22,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.05),transparent_24%)]" />
      <div className="relative mx-auto max-w-[1600px] px-4 py-5 lg:px-6 lg:py-6">
        <header className="sticky top-4 z-30 mb-6 rounded-[28px] border border-white/80 bg-white/92 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <img
                src={kuriftuLogo}
                alt="Kuriftu logo"
                className="h-11 w-11 rounded-2xl object-cover ring-1 ring-white/70 shadow-[0_12px_28px_rgba(132,204,22,0.22)]"
              />
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Kurifitu Go Admin
                </p>
                <p className="text-xs text-slate-500">
                  Kurifitu Go admin tools plus dashboard, analytics, guests,
                  segments, and pricing
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                Current page: {currentAdminTab.label}
              </span>
              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white ring-1 ring-slate-900">
                Mode: Admin
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-[30px] border border-slate-200/80 bg-white/92 p-4 shadow-[0_18px_48px_rgba(15,23,42,0.07)] backdrop-blur-xl">
            <div className="space-y-5">
              {adminSections.map((section, sectionIndex) => {
                const titleStyles = [
                  "from-cyan-600 to-blue-600",
                  "from-emerald-600 to-teal-600",
                  "from-amber-600 to-orange-600",
                ];
                const accent = titleStyles[sectionIndex % titleStyles.length];

                return (
                  <div key={section.title} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-8 w-1.5 rounded-full bg-gradient-to-b ${accent}`}
                      />
                      <div>
                        <div
                          className={`inline-flex rounded-full bg-gradient-to-r ${accent} px-3 py-1 text-xs font-black uppercase tracking-[0.3em] text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)]`}
                        >
                          {section.title}
                        </div>
                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {section.items.map((tab) => {
                        const isActive = adminPage === tab.key;
                        return (
                          <button
                            key={tab.key}
                            onClick={() => setAdminPage(tab.key)}
                            className={`w-full rounded-xl px-3 py-2 text-left text-[15px] transition ${isActive ? "bg-slate-950 text-white shadow-[0_10px_22px_rgba(15,23,42,0.2)]" : "bg-slate-50 text-slate-700 hover:bg-white hover:text-slate-950 hover:shadow-sm"}`}
                          >
                            <p className="font-semibold">{tab.label}</p>
                            <p
                              className={`text-[13px] ${isActive ? "text-slate-300" : "text-slate-500"}`}
                            >
                              {tab.detail}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          <section className="space-y-6">
            <section className="rounded-[32px] border border-slate-200/80 bg-white/90 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl lg:px-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                    {currentAdminTab.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {currentAdminTab.detail}
                  </p>
                </div>
                <p className="max-w-2xl text-sm text-slate-600">
                  Executive tools for revenue, audience, and pricing decisions.
                </p>
              </div>
            </section>

            <section className="rounded-[36px] border border-slate-200/80 bg-white/70 p-4 shadow-[0_22px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:p-6">
              <div className="space-y-6">{adminPageContent}</div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
