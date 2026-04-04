import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
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
    priceRange: { min: 0, max: 100 },
    serviceType: "all",
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [activeDish, setActiveDish] = useState<Recommendation | null>(null);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [reservationDetails, setReservationDetails] = useState({
    date: "",
    time: "",
    guests: 2,
    notes: "",
  });

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

  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  const getPriceIcon = (price: number) => {
    if (price <= 20) return <FiDollarSign className="text-green-600" />;
    if (price <= 40) return <FiTrendingUp className="text-amber-600" />;
    return <FiAward className="text-purple-600" />;
  };

  const dishImages: Record<string, string> = {
    dish_1:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80",
    dish_2:
      "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1200&q=80",
    dish_3:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    dish_4:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    dish_5:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
    dish_6:
      "https://images.unsplash.com/photo-1529692236671-f1f1f6d1af6b?auto=format&fit=crop&w=1200&q=80",
    spa_1:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    spa_2:
      "https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?auto=format&fit=crop&w=1200&q=80",
  };

  const openReservation = (dish: Recommendation) => {
    setActiveDish(dish);
    setReservationOpen(true);
    setReservationSuccess(null);
  };

  const closeReservation = () => {
    setReservationOpen(false);
    setActiveDish(null);
    setReservationDetails({ date: "", time: "", guests: 2, notes: "" });
    setReservationSuccess(null);
  };

  const handleReservationChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setReservationDetails((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  const handleReservationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeDish) return;

    setReservationOpen(false);
    setReservationSuccess(
      `Your reservation for ${activeDish.name} is confirmed for ${reservationDetails.date} at ${reservationDetails.time}. Our concierge will reach out shortly to finalize your request.`,
    );
    setShowSuccessPopup(true);
    setActiveDish(null);
    setReservationDetails({ date: "", time: "", guests: 2, notes: "" });
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
                Experiences
              </span>
            </h1>
            <p className="text-stone-500 text-lg font-light max-w-2xl">
              Personalized selections crafted to your palate preferences and
              wellness needs
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Dietary Preferences */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">
                  Dietary Preferences
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      updatePreferences({ spicy: !preferences.spicy })
                    }
                    className={`px-4 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 ${
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
                    className={`px-4 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 ${
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
                    className={`px-4 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 ${
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
                    className={`px-4 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 ${
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

              {/* Price Range */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">
                  Price Range
                </label>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-stone-400 mb-1">Min Price</label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={preferences.priceRange.min}
                        onChange={(e) =>
                          updatePreferences({
                            priceRange: {
                              ...preferences.priceRange,
                              min: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3 py-2 bg-stone-100 text-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-stone-400 mb-1">Max Price</label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={preferences.priceRange.max}
                        onChange={(e) =>
                          updatePreferences({
                            priceRange: {
                              ...preferences.priceRange,
                              max: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3 py-2 bg-stone-100 text-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                        placeholder="200"
                      />
                    </div>
                  </div>
                  <div className="text-xs text-stone-500">
                    Current range: ${preferences.priceRange.min} - ${preferences.priceRange.max}
                  </div>
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">
                  Service Type
                </label>
                <select
                  value={preferences.serviceType}
                  onChange={(e) =>
                    updatePreferences({
                      serviceType: e.target.value as RecommendationPreferences["serviceType"],
                    })
                  }
                  className="w-full px-4 py-3 bg-stone-100 text-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="all">All Services</option>
                  <option value="food">🍽️ Dining</option>
                  <option value="spa">🧖 Spa & Wellness</option>
                  <option value="wellness">🌿 Wellness</option>
                </select>
                <div className="mt-3 text-xs text-stone-500">
                  Filter by service category
                </div>
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
                    <div
                        className="relative h-56 overflow-hidden bg-stone-100"
                        style={{
                          backgroundImage: dishImages[dish.id]
                            ? `url(${dishImages[dish.id]})`
                            : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
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
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                            {dish.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              dish.serviceType === 'food' ? 'bg-blue-100 text-blue-700' :
                              dish.serviceType === 'spa' ? 'bg-purple-100 text-purple-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {dish.serviceType === 'food' ? '🍽️ Dining' :
                               dish.serviceType === 'spa' ? '🧖 Spa' : '🌿 Wellness'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getPriceIcon(dish.price)}
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
                        <button
                          onClick={() => openReservation(dish)}
                          className="group/btn relative px-6 py-2.5 bg-stone-800 text-white rounded-full hover:bg-amber-700 transition-all duration-300 overflow-hidden"
                        >
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

        {showSuccessPopup && reservationSuccess && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] max-w-sm">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 shadow-lg animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-800">Reservation Confirmed</p>
                  <p className="text-sm text-green-700 mt-1">{reservationSuccess}</p>
                </div>
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
                >
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {reservationOpen && activeDish && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 px-4 py-8">
            <div className="w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
                    Reservation request
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                    Reserve {activeDish.name}
                  </h2>
                  <p className="mt-2 text-sm text-stone-500 max-w-2xl">
                    Choose your preferred date and time for this service. Our guest services team will confirm your reservation and prepare the dish with professional care.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeReservation}
                  className="rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-sm text-stone-700 hover:bg-stone-200 transition"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleReservationSubmit} className="mt-8 grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Date
                  </span>
                  <input
                    type="date"
                    name="date"
                    value={reservationDetails.date}
                    onChange={handleReservationChange}
                    className="mt-2 w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-700 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Time
                  </span>
                  <input
                    type="time"
                    name="time"
                    value={reservationDetails.time}
                    onChange={handleReservationChange}
                    className="mt-2 w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-700 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    required
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Guests
                  </span>
                  <input
                    type="number"
                    min={1}
                    name="guests"
                    value={reservationDetails.guests}
                    onChange={handleReservationChange}
                    className="mt-2 w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-700 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Special requests
                  </span>
                  <textarea
                    name="notes"
                    value={reservationDetails.notes}
                    onChange={handleReservationChange}
                    className="mt-2 w-full min-h-[120px] rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-700 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    placeholder="Please let us know any dietary preferences or timing notes"
                  />
                </label>

                <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeReservation}
                    className="rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-amber-800 transition"
                  >
                    Confirm Reservation
                  </button>
                </div>
              </form>
            </div>
          </div>
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
