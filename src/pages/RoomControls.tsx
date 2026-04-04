import { useEffect, useState } from "react";
import {
  fetchRoomRecommendations,
  fetchRoomState,
  updateRoomState,
  type RoomRecommendation,
  type RoomState,
} from "../services/mockApi";
import {
  FiArrowLeft,
  FiSun,
  FiThermometer,
  FiVolumeX,
  FiSliders,
  FiCpu,
  FiZap,
  FiMusic,
  FiWind,
  FiCheckCircle,
  FiTrendingUp,
  FiHome,
  FiMoon,
  FiSunrise,
  FiHeart,
  FiDroplet,
} from "react-icons/fi";
import { MdSpa } from "react-icons/md";

type RoomControlsProps = {
  onNavigate?: (page: "home") => void;
};

const RoomControls = ({ onNavigate }: RoomControlsProps = {}) => {
  const goHome = () => {
    if (onNavigate) {
      onNavigate("home");
      return;
    }
    window.location.replace("/guest");
  };

  const [controls, setControls] = useState<RoomState | null>(null);
  const [recommendations, setRecommendations] = useState<RoomRecommendation[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([fetchRoomState(), fetchRoomRecommendations()])
      .then(([state, recs]) => {
        if (!active) return;
        setControls(state);
        setRecommendations(recs);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const applyUpdate = async (partial: Partial<RoomState>) => {
    if (!controls) return;
    const nextState: RoomState = {
      ...controls,
      ...partial,
      automation: partial.automation ?? controls.automation,
    };
    setControls(nextState);
    setApplying(true);
    try {
      const updated = await updateRoomState({
        ...partial,
        automation: partial.automation ?? controls.automation,
      });
      setControls(updated);
      setTimeout(() => setApplying(false), 1000);
    } finally {
      setTimeout(() => setApplying(false), 1000);
    }
  };

  if (loading || !controls) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <button
              type="button"
              onClick={goHome}
              className="inline-flex items-center text-stone-600 hover:text-amber-700 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium tracking-wide">
                RETURN TO SUITE
              </span>
            </button>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-16 text-center border border-stone-100">
            <div className="inline-flex p-4 bg-stone-100 rounded-full mb-4">
              <FiSliders className="w-8 h-8 text-stone-400 animate-pulse" />
            </div>
            <p className="text-stone-500 font-light">
              Initializing ambient controls...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goHome}
              className="group inline-flex items-center text-stone-600 hover:text-amber-700 transition-all duration-300"
            >
              <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium tracking-wide">
                RETURN TO SUITE
              </span>
            </button>

            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${applying ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}
              ></div>
              <span className="text-xs text-stone-400 tracking-wide">
                {applying ? "APPLYING SETTINGS..." : "SYSTEM ACTIVE"}
              </span>
            </div>
          </div>

          <div className="mt-8 relative">
            <div className="absolute left-0 top-0 w-20 h-0.5 bg-gradient-to-r from-amber-500 to-amber-700"></div>
            <h1 className="text-4xl font-light text-stone-900 mt-4 mb-2 tracking-tight">
              Ambient{" "}
              <span className="font-semibold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                Intelligence
              </span>
            </h1>
            <p className="text-stone-500 text-base font-light">
              Curate your perfect dining atmosphere with precision controls
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel - Main */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-100 p-8 space-y-8">
              {/* Lighting Control */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <FiSun className="w-4 h-4 text-amber-600" />
                    </div>
                    <label className="text-sm font-medium text-stone-700 tracking-wide">
                      ILLUMINATION
                    </label>
                  </div>
                  <span className="text-lg font-semibold text-amber-700">
                    {controls.lighting}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={controls.lighting}
                  onChange={(e) =>
                    applyUpdate({ lighting: Number(e.target.value) })
                  }
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  style={{
                    background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${controls.lighting}%, #e5e7eb ${controls.lighting}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-stone-400 mt-2">
                  <span>Ambient</span>
                  <span>Moderate</span>
                  <span>Radiant</span>
                </div>
              </div>

              {/* Music Control */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <FiMusic className="w-4 h-4 text-amber-600" />
                    </div>
                    <label className="text-sm font-medium text-stone-700 tracking-wide">
                      AUDIO AMBIENCE
                    </label>
                  </div>
                  <span className="text-lg font-semibold text-amber-700">
                    {controls.music}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={controls.music}
                  onChange={(e) =>
                    applyUpdate({ music: Number(e.target.value) })
                  }
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-xs text-stone-400 mt-2">
                  <span>Silent</span>
                  <span>Background</span>
                  <span>Immersive</span>
                </div>
              </div>

              {/* Temperature Control */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <FiThermometer className="w-4 h-4 text-amber-600" />
                    </div>
                    <label className="text-sm font-medium text-stone-700 tracking-wide">
                      THERMAL COMFORT
                    </label>
                  </div>
                  <span className="text-lg font-semibold text-amber-700">
                    {controls.temperature}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="28"
                  step="0.5"
                  value={controls.temperature}
                  onChange={(e) =>
                    applyUpdate({ temperature: Number(e.target.value) })
                  }
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-xs text-stone-400 mt-2">
                  <span>Cool</span>
                  <span>Optimal</span>
                  <span>Warm</span>
                </div>
              </div>

              {/* Noise Reduction */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <FiVolumeX className="w-4 h-4 text-amber-600" />
                    </div>
                    <label className="text-sm font-medium text-stone-700 tracking-wide">
                      ACOUSTIC PRIVACY
                    </label>
                  </div>
                  <span className="text-lg font-semibold text-amber-700">
                    {controls.noiseReduction}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={controls.noiseReduction}
                  onChange={(e) =>
                    applyUpdate({ noiseReduction: Number(e.target.value) })
                  }
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-xs text-stone-400 mt-2">
                  <span>Natural</span>
                  <span>Balanced</span>
                  <span>Private</span>
                </div>
              </div>

              {/* Ambiance Selection */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <FiTrendingUp className="w-4 h-4 text-amber-600" />
                  </div>
                  <label className="text-sm font-medium text-stone-700 tracking-wide">
                    ATMOSPHERIC THEME
                  </label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(["cozy", "energetic", "romantic", "quiet"] as const).map(
                    (ambiance) => (
                      <button
                        key={ambiance}
                        onClick={() => applyUpdate({ ambiance })}
                        className={`px-4 py-3 rounded-xl capitalize transition-all duration-300 flex items-center justify-center gap-2 ${
                          controls.ambiance === ambiance
                            ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg transform scale-105"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        {ambiance === "cozy" && <FiHome className="w-4 h-4" />}
                        {ambiance === "energetic" && (
                          <FiZap className="w-4 h-4" />
                        )}
                        {ambiance === "romantic" && (
                          <FiHeart className="w-4 h-4" />
                        )}
                        {ambiance === "quiet" && <FiMoon className="w-4 h-4" />}
                        {ambiance}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Scent Profile */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <FiDroplet className="w-4 h-4 text-amber-600" />
                  </div>
                  <label className="text-sm font-medium text-stone-700 tracking-wide">
                    AROMATIC PROFILE
                  </label>
                </div>
                <select
                  value={controls.scent}
                  onChange={(e) =>
                    applyUpdate({ scent: e.target.value as RoomState["scent"] })
                  }
                  className="w-full px-5 py-3 bg-stone-100 text-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all cursor-pointer border border-stone-200"
                >
                  <option value="vanilla">
                    Vanilla Orchid - Warm & Comforting
                  </option>
                  <option value="citrus">
                    Citrus Zest - Fresh & Invigorating
                  </option>
                  <option value="lavender">
                    Lavender Fields - Calming & Serene
                  </option>
                  <option value="none">Neutral - No Fragrance</option>
                </select>
              </div>

              {/* Automation Settings */}
              <div className="pt-6 border-t border-stone-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <FiCpu className="w-4 h-4 text-amber-600" />
                  </div>
                  <label className="text-sm font-medium text-stone-700 tracking-wide">
                    INTELLIGENT AUTOMATION
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      key: "autoLighting",
                      label: "Adaptive Illumination",
                      icon: <FiSunrise className="w-4 h-4" />,
                      desc: "Adjusts to natural light cycles",
                    },
                    {
                      key: "autoClimate",
                      label: "Smart Thermal Control",
                      icon: <FiThermometer className="w-4 h-4" />,
                      desc: "Optimizes for guest comfort",
                    },
                    {
                      key: "autoMusic",
                      label: "Dynamic Audio Mix",
                      icon: <FiMusic className="w-4 h-4" />,
                      desc: "Matches music to ambiance",
                    },
                    {
                      key: "occupancyAware",
                      label: "Occupancy Intelligence",
                      icon: <FiWind className="w-4 h-4" />,
                      desc: "Energy-efficient presence detection",
                    },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition-colors border border-stone-100"
                    >
                      <input
                        type="checkbox"
                        checked={
                          controls.automation[
                            item.key as keyof typeof controls.automation
                          ]
                        }
                        onChange={(e) =>
                          applyUpdate({
                            automation: {
                              ...controls.automation,
                              [item.key]: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 mt-0.5 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-stone-500">{item.icon}</span>
                          <span className="text-sm font-medium text-stone-700">
                            {item.label}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggestions Sidebar */}
          <div>
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-100 p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                  <FiTrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-stone-800 tracking-wide">
                  AI CURATED PRESETS
                </h3>
              </div>
              <div className="space-y-4">
                {recommendations.map((item) => (
                  <div
                    key={item.id}
                    className="group border border-stone-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:border-amber-200"
                  >
                    <h4 className="font-semibold text-stone-800 mb-1 flex items-center gap-2">
                      <MdSpa className="w-4 h-4 text-amber-600" />
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed mb-4">
                      {item.detail}
                    </p>
                    <button
                      onClick={() => applyUpdate(item.action)}
                      className="w-full px-4 py-2.5 text-sm bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <FiCheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Apply Preset
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Success Toast Notification */}
        {applying && (
          <div className="fixed bottom-8 right-8 bg-gradient-to-r from-stone-800 to-stone-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeInUp">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <FiCheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium tracking-wide">
              AMBINACE UPDATED
            </span>
          </div>
        )}
      </div>

      {/* Add custom CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RoomControls;
