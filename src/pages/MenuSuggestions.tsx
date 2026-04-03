import { useEffect, useState } from "react";
import {
  fetchRecommendations,
  type Recommendation,
  type RecommendationPreferences,
} from "../services/mockApi";

type MenuSuggestionsProps = {
  onNavigate?: (page: "home") => void;
};

const MenuSuggestions = ({ onNavigate }: MenuSuggestionsProps = {}) => {
  const goHome = () => {
    if (onNavigate) {
      onNavigate("home");
      return;
    }
    window.location.replace("/guest");
  };

  const [preferences, setPreferences] = useState<RecommendationPreferences>({
    spicy: false,
    vegetarian: false,
    glutenFree: false,
    adventurous: true,
    priceRange: "any",
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const updatePreferences = (partial: Partial<RecommendationPreferences>) => {
    setLoading(true);
    setPreferences((prev) => ({ ...prev, ...partial }));
  };

  useEffect(() => {
    let active = true;
    fetchRecommendations(preferences)
      .then((data) => {
        if (active) setRecommendations(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [preferences]);

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
            Menu Suggestions
          </h1>
          <p className="text-gray-600">
            Discover dishes tailored to your taste preferences
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Filter by</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => updatePreferences({ spicy: !preferences.spicy })}
              className={`px-4 py-2 rounded-lg transition-all ${
                preferences.spicy
                  ? "bg-[#8B2C2D] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🌶️ Spicy
            </button>
            <button
              onClick={() =>
                updatePreferences({ vegetarian: !preferences.vegetarian })
              }
              className={`px-4 py-2 rounded-lg transition-all ${
                preferences.vegetarian
                  ? "bg-[#8B2C2D] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🥬 Vegetarian
            </button>
            <button
              onClick={() =>
                updatePreferences({ glutenFree: !preferences.glutenFree })
              }
              className={`px-4 py-2 rounded-lg transition-all ${
                preferences.glutenFree
                  ? "bg-[#8B2C2D] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🚫 Gluten-Free
            </button>
            <button
              onClick={() =>
                updatePreferences({ adventurous: !preferences.adventurous })
              }
              className={`px-4 py-2 rounded-lg transition-all ${
                preferences.adventurous
                  ? "bg-[#8B2C2D] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🧭 Adventurous
            </button>
            <select
              value={preferences.priceRange}
              onChange={(e) =>
                updatePreferences({
                  priceRange: e.target
                    .value as RecommendationPreferences["priceRange"],
                })
              }
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
            >
              <option value="any">💰 Any Price</option>
              <option value="value">💵 Value ($)</option>
              <option value="premium">💎 Premium ($$$)</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-100 rounded w-16"></div>
                  <div className="h-6 bg-gray-100 rounded w-16"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {recommendations.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="text-6xl mb-4">🍽️</div>
                <p className="text-gray-500 text-lg">
                  No dishes match your current filters.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your preferences
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((dish) => (
                  <div
                    key={dish.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {dish.name}
                        </h3>
                        <span className="text-sm font-medium text-[#D4A373]">
                          {dish.matchScore}% match
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mb-4">
                        {dish.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {dish.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-2xl font-bold text-[#8B2C2D]">
                          ${dish.price}
                        </span>
                        <button className="px-6 py-2 bg-[#8B2C2D] text-white rounded-lg hover:bg-[#6B2021] transition-colors">
                          Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MenuSuggestions;
