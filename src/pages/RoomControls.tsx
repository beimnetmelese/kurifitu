import { useEffect, useState } from "react";
import {
  fetchRoomRecommendations,
  fetchRoomState,
  updateRoomState,
  type RoomRecommendation,
  type RoomState,
} from "../services/mockApi";

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
    } finally {
      setApplying(false);
    }
  };

  if (loading || !controls) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <button
              type="button"
              onClick={goHome}
              className="inline-flex items-center text-[#8B2C2D]"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </button>
          </div>
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="animate-pulse">Loading room controls...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={goHome}
            className="inline-flex items-center text-[#8B2C2D] hover:text-[#6B2021] transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Room Controls
          </h1>
          <p className="text-gray-600">Customize your dining ambiance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
              {/* Lighting */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Lighting
                  </label>
                  <span className="text-sm text-[#8B2C2D] font-medium">
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8B2C2D]"
                />
              </div>

              {/* Music */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Music Volume
                  </label>
                  <span className="text-sm text-[#8B2C2D] font-medium">
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8B2C2D]"
                />
              </div>

              {/* Temperature */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Temperature
                  </label>
                  <span className="text-sm text-[#8B2C2D] font-medium">
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8B2C2D]"
                />
              </div>

              {/* Noise Reduction */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Noise Reduction
                  </label>
                  <span className="text-sm text-[#8B2C2D] font-medium">
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8B2C2D]"
                />
              </div>

              {/* Ambiance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ambiance
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["cozy", "energetic", "romantic", "quiet"] as const).map(
                    (ambiance) => (
                      <button
                        key={ambiance}
                        onClick={() => applyUpdate({ ambiance })}
                        className={`px-4 py-2 rounded-lg capitalize transition-all ${
                          controls.ambiance === ambiance
                            ? "bg-[#8B2C2D] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {ambiance}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Scent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scent Profile
                </label>
                <select
                  value={controls.scent}
                  onChange={(e) =>
                    applyUpdate({ scent: e.target.value as RoomState["scent"] })
                  }
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
                >
                  <option value="vanilla">Vanilla</option>
                  <option value="citrus">Citrus</option>
                  <option value="none">None</option>
                </select>
              </div>

              {/* Automation */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Automation
                </label>
                <div className="space-y-2">
                  {[
                    { key: "autoLighting", label: "Adaptive Lighting" },
                    { key: "autoClimate", label: "Smart Climate" },
                    { key: "autoMusic", label: "Music Auto Mix" },
                    { key: "occupancyAware", label: "Occupancy Aware" },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center gap-3 cursor-pointer"
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
                        className="w-4 h-4 text-[#8B2C2D] rounded focus:ring-[#D4A373]"
                      />
                      <span className="text-sm text-gray-700">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Smart Suggestions
              </h3>
              <div className="space-y-4">
                {recommendations.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-gray-100 pb-4 last:border-0"
                  >
                    <h4 className="font-medium text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">{item.detail}</p>
                    <button
                      onClick={() => applyUpdate(item.action)}
                      className="w-full px-4 py-2 text-sm bg-[#8B2C2D] text-white rounded-lg hover:bg-[#6B2021] transition-colors"
                    >
                      Apply Preset
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {applying && (
          <div className="fixed bottom-8 right-8 bg-[#8B2C2D] text-white px-6 py-3 rounded-lg shadow-lg">
            Applying settings...
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomControls;
