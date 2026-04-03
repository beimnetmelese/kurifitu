type HomeProps = {
  onNavigate?: (
    page: "assistant" | "menuSuggestions" | "roomControls" | "feedback",
  ) => void;
};

const Home = ({ onNavigate }: HomeProps = {}) => {
  const features = [
    {
      key: "assistant" as const,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      title: "AI Assistant",
      description: "Personalized dining recommendations and instant assistance",
    },
    {
      key: "menuSuggestions" as const,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 15v6"
          />
        </svg>
      ),
      title: "Menu Suggestions",
      description: "Curated dishes based on your preferences",
    },
    {
      key: "roomControls" as const,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
      title: "Room Controls",
      description: "Set the perfect ambiance for your dining experience",
    },
    {
      key: "feedback" as const,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      title: "Guest Feedback",
      description: "Share your experience to help us improve",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <div className="relative bg-[#8B2C2D] text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1 bg-white/10 rounded-full text-sm mb-6">
              Welcome to
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Kuriftu African Village
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              Experience Authentic African Cuisine in a Modern Setting
            </p>
            <div className="w-20 h-1 bg-[#D4A373] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Your Digital Concierge
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need for a memorable dining experience, right at your
            fingertips
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onNavigate?.(feature.key)}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="w-14 h-14 rounded-xl bg-[#8B2C2D]/10 text-[#8B2C2D] flex items-center justify-center mb-5 group-hover:bg-[#8B2C2D] group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
