import {
  FiMessageSquare,
  FiBookOpen,
  FiSliders,
  FiStar,
  FiChevronRight,
  FiAward,
  FiUsers,
  FiCoffee,
  FiMapPin,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";
import { MdOutlineRestaurantMenu, MdEmojiFoodBeverage } from "react-icons/md";

type HomeProps = {
  onNavigate?: (
    page: "assistant" | "menuSuggestions" | "roomControls" | "feedback",
  ) => void;
};

const Home = ({ onNavigate }: HomeProps = {}) => {
  const features = [
    {
      key: "assistant" as const,
      icon: <FiMessageSquare className="w-7 h-7" />,
      title: "AI Assistant",
      description:
        "Get personalized help and instant answers to your questions",
      accent: "from-amber-500 to-amber-600",
      gradient: "from-amber-50 to-amber-100",
    },
    {
      key: "menuSuggestions" as const,
      icon: <MdOutlineRestaurantMenu className="w-7 h-7" />,
      title: "Menu Guide",
      description: "Discover dishes perfectly matched to your taste",
      accent: "from-emerald-500 to-emerald-600",
      gradient: "from-emerald-50 to-emerald-100",
    },
    {
      key: "roomControls" as const,
      icon: <FiSliders className="w-7 h-7" />,
      title: "Room Settings",
      description: "Adjust lighting, music, and atmosphere for your comfort",
      accent: "from-purple-500 to-purple-600",
      gradient: "from-purple-50 to-purple-100",
    },
    {
      key: "feedback" as const,
      icon: <FiStar className="w-7 h-7" />,
      title: "Your Feedback",
      description: "Share your thoughts to help us serve you better",
      accent: "from-rose-500 to-rose-600",
      gradient: "from-rose-50 to-rose-100",
    },
  ];

  const stats = [
    {
      value: "4.9",
      label: "Guest Rating",
      icon: <FiStar className="w-4 h-4" />,
    },
    {
      value: "150+",
      label: "Daily Visitors",
      icon: <FiUsers className="w-4 h-4" />,
    },
    {
      value: "25+",
      label: "Signature Dishes",
      icon: <MdEmojiFoodBeverage className="w-4 h-4" />,
    },
    {
      value: "24/7",
      label: "Support Available",
      icon: <FiClock className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900">
          {/* Decorative Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-8 border border-white/20">
              <FiAward className="w-4 h-4 text-amber-400" />
              <span className="text-white/90 tracking-wide">WELCOME TO</span>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-white mb-6 tracking-tight">
              Kuriftu
              <span className="block font-semibold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                African Village
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 mb-8 font-light max-w-2xl leading-relaxed">
              Experience authentic African cuisine in a modern, welcoming
              setting
            </p>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-0.5 bg-amber-500"></div>
              <div className="flex items-center gap-2 text-amber-400 text-sm tracking-wide">
                <FiMapPin className="w-4 h-4" />
                <span>PREMIUM DINING EXPERIENCE</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate?.("assistant")}
                className="group inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="font-medium tracking-wide">GET STARTED</span>
                <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate?.("menuSuggestions")}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-full hover:bg-white/20 transition-all duration-300"
              >
                <FiBookOpen className="w-4 h-4" />
                <span className="font-medium tracking-wide">VIEW MENU</span>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#FAF7F2"
            />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-4">
            <FiTrendingUp className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Digital Tools
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-stone-800 mb-4">
            Everything{" "}
            <span className="font-semibold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              You Need
            </span>
          </h2>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto font-light">
            Smart tools designed to make your dining experience better
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-amber-500 to-amber-700 mx-auto mt-6"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onNavigate?.(feature.key)}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-stone-100 overflow-hidden text-left"
            >
              {/* Gradient Hover Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>

              {/* Icon Container */}
              <div
                className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}
              >
                <div className="text-white">{feature.icon}</div>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-xl font-semibold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-stone-500 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>

              {/* Arrow Indicator */}
              <div className="relative mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FiChevronRight className="w-5 h-5 text-amber-600" />
              </div>
            </button>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-100 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="text-amber-600 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-stone-800">
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm text-stone-500 font-medium tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="border-t border-stone-200 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-stone-400 text-sm">
              <FiCoffee className="w-4 h-4" />
              <span>
                Kuriftu African Village — Authentic flavors, warm hospitality
              </span>
            </div>
            <div className="flex items-center gap-4 text-stone-400 text-xs">
              <span>© 2024 Kuriftu</span>
              <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
              <span>Smart Dining Experience</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
