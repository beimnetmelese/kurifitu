import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiFilter,
  FiDollarSign,
  FiStar,
  FiCoffee,
  FiTrendingUp,
  FiAward,
  FiChevronRight,
  FiHeart,
  FiShare2,
  FiBookmark,
  FiCompass,
} from "react-icons/fi";
import {
  MdRestaurantMenu,
  MdEmojiFoodBeverage,
  MdLocalFireDepartment,
  MdGrass,
  MdNoFood,
} from "react-icons/md";
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
  const [showFilters, setShowFilters] = useState(true);

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

  const getPriceIcon = (range: string) => {
    switch (range) {
      case "value":
        return <FiDollarSign className="text-green-600" />;
      case "premium":
        return <FiAward className="text-amber-600" />;
      default:
        return <FiTrendingUp className="text-stone-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Luxury Accent */}
        <div className="mb-12">
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

          <div className="mt-8 relative">
            <div className="absolute left-0 top-0 w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
            <h1 className="text-5xl font-light text-stone-900 mt-4 mb-3 tracking-tight">
              Curated{" "}
              <span className="font-semibold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                Gastronomy
              </span>
            </h1>
            <p className="text-stone-500 text-lg font-light max-w-2xl">
              Personalized selections crafted to your palate preferences and
              dietary requirements
            </p>
          </div>
        </div>

        {/* Filter Toggle & Controls */}
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-200 rounded-full hover:border-amber-300 hover:shadow-md transition-all duration-300"
          >
            <FiFilter
              className={`w-4 h-4 ${showFilters ? "text-amber-600" : "text-stone-400"}`}
            />
            <span className="text-sm font-medium text-stone-700">
              Refine Selection
            </span>
            <FiChevronRight
              className={`w-4 h-4 transition-transform ${showFilters ? "rotate-90" : ""}`}
            />
          </button>

          <div className="text-sm text-stone-500">
            <span className="font-semibold text-stone-700">
              {recommendations.length}
            </span>{" "}
            exceptional recommendations
          </div>
        </div>

        {/* Filters Panel - Luxury Design */}
        {showFilters && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-100 p-8 mb-10">
            <div className="flex flex-wrap gap-6 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                  Culinary Preferences
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      updatePreferences({ spicy: !preferences.spicy })
                    }
                    className={`px-5 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 ${
                      preferences.spicy
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    <MdLocalFireDepartment className="w-4 h-4" />
                    <span className="text-sm font-medium">Spicy</span>
                  </button>
                  <button
                    onClick={() =>
                      updatePreferences({ vegetarian: !preferences.vegetarian })
                    }
                    className={`px-5 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 ${
                      preferences.vegetarian
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    <MdGrass className="w-4 h-4" />
                    <span className="text-sm font-medium">Vegetarian</span>
                  </button>
                  <button
                    onClick={() =>
                      updatePreferences({ glutenFree: !preferences.glutenFree })
                    }
                    className={`px-5 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 ${
                      preferences.glutenFree
                        ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    <MdNoFood className="w-4 h-4" />
                    <span className="text-sm font-medium">Gluten-Free</span>
                  </button>
                  <button
                    onClick={() =>
                      updatePreferences({
                        adventurous: !preferences.adventurous,
                      })
                    }
                    className={`px-5 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 ${
                      preferences.adventurous
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    <FiCompass className="w-4 h-4" />
                    <span className="text-sm font-medium">Adventurous</span>
                  </button>
                </div>
              </div>

              <div className="w-64">
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                  Price Experience
                </label>
                <select
                  value={preferences.priceRange}
                  onChange={(e) =>
                    updatePreferences({
                      priceRange: e.target
                        .value as RecommendationPreferences["priceRange"],
                    })
                  }
                  className="w-full px-5 py-2.5 bg-stone-100 text-stone-700 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="any">All Price Points</option>
                  <option value="value">Classic Selection ($)</option>
                  <option value="premium">Prestige Collection ($$$)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton - Luxury Style */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse"
              >
                <div className="h-48 bg-gradient-to-br from-stone-100 to-stone-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-stone-200 rounded w-3/4"></div>
                  <div className="h-4 bg-stone-100 rounded w-full"></div>
                  <div className="h-4 bg-stone-100 rounded w-2/3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-stone-100 rounded w-16"></div>
                    <div className="h-6 bg-stone-100 rounded w-16"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-8 bg-stone-200 rounded w-20"></div>
                    <div className="h-10 bg-stone-200 rounded w-28"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {recommendations.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-100 p-16 text-center">
                <div className="inline-flex p-4 bg-stone-100 rounded-full mb-6">
                  <MdRestaurantMenu className="w-12 h-12 text-stone-400" />
                </div>
                <p className="text-stone-600 text-xl font-light mb-3">
                  No dishes match your current preferences
                </p>
                <p className="text-stone-400 text-sm">
                  Refine your selection to discover exceptional culinary
                  experiences
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.map((dish) => (
                  <div
                    key={dish.id}
                    className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Card Image Placeholder - Luxury Gradient */}
                    <div className="relative h-56 bg-gradient-to-br from-amber-100 via-amber-50 to-stone-100 overflow-hidden">
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="p-2 bg-white rounded-full shadow-md hover:bg-amber-50 transition-colors">
                          <FiHeart className="w-4 h-4 text-stone-600" />
                        </button>
                        <button className="p-2 bg-white rounded-full shadow-md hover:bg-amber-50 transition-colors">
                          <FiBookmark className="w-4 h-4 text-stone-600" />
                        </button>
                        <button className="p-2 bg-white rounded-full shadow-md hover:bg-amber-50 transition-colors">
                          <FiShare2 className="w-4 h-4 text-stone-600" />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <FiStar className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-semibold text-stone-700">
                            {dish.matchScore}% Match
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                          {dish.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          {getPriceIcon(preferences.priceRange)}
                        </div>
                      </div>

                      <p className="text-stone-500 text-sm leading-relaxed mb-4 line-clamp-2">
                        {dish.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-5">
                        {dish.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-stone-50 text-stone-500 text-xs rounded-full border border-stone-100"
                          >
                            {tag}
                          </span>
                        ))}
                        {dish.tags.length > 3 && (
                          <span className="px-3 py-1 text-stone-400 text-xs">
                            +{dish.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-5 border-t border-stone-100">
                        <div>
                          <span className="text-xs text-stone-400 uppercase tracking-wider">
                            Starting at
                          </span>
                          <div className="text-3xl font-bold text-stone-800">
                            ${dish.price}
                          </div>
                        </div>
                        <button className="group/btn relative px-6 py-2.5 bg-stone-800 text-white rounded-full hover:bg-amber-700 transition-all duration-300 overflow-hidden">
                          <span className="relative z-10 text-sm font-medium tracking-wide">
                            Reserve
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Footer Note */}
        <div className="mt-16 pt-8 border-t border-stone-200 text-center">
          <p className="text-stone-400 text-sm flex items-center justify-center gap-2">
            <MdEmojiFoodBeverage className="w-4 h-4" />
            Curated by our Executive Chef team
            <FiCoffee className="w-4 h-4 ml-2" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuSuggestions;
