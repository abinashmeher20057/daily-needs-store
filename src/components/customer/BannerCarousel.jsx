import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronLeft, ChevronRight, Zap, ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';

export const BannerCarousel = () => {
  const { setSelectedCategory, setActiveView } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      badge: "⚡ 12-MINUTE SUPERFAST DELIVERY",
      title: "Fresh Morning Staples & Dairy Essentials",
      subtitle: "Up to 30% OFF on Farm Fresh Milk, Atta, Ghee & Pulses",
      code: "Use code DAILY30 for Extra ₹50 OFF",
      category: "Dairy & Refrigerated",
      buttonText: "Shop Daily Staples",
      bgGradient: "from-blue-900 via-brand-900 to-indigo-950",
      accentColor: "text-amber-400",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      badge: "🍎 HANDPICKED MORNING HARVEST",
      title: "100% Crisp Fresh Fruits & Vegetables",
      subtitle: "Farm to Kitchen within 12 Hours • Direct from Certified Growers",
      code: "Freshness Guaranteed or 100% Instant Refund",
      category: "Fruits & Vegetables",
      buttonText: "Explore Fresh Harvest",
      bgGradient: "from-emerald-950 via-teal-900 to-slate-900",
      accentColor: "text-emerald-400",
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      badge: "✨ FESTIVE & POOJA ESSENTIALS",
      title: "Pure Camphor, Incense & Sacred Offerings",
      subtitle: "Cycle Agarbatti, Bhimseni Kapur, Ghee Battis & Pure Gangajal",
      code: "Flat 25% OFF on Complete Pooja Combos",
      category: "Pooja / Religious Essentials",
      buttonText: "Browse Pooja Store",
      bgGradient: "from-amber-950 via-orange-950 to-slate-900",
      accentColor: "text-amber-300",
      image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const activeBanner = banners[currentSlide];

  const handleBannerClick = (category) => {
    setSelectedCategory(category);
    setActiveView('products');
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Banner Slide */}
      <div className={`relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r ${activeBanner.bgGradient} text-white transition-all duration-700 min-h-[260px] sm:min-h-[300px] flex items-center`}>
        {/* Background artwork */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-25 sm:opacity-40 mix-blend-luminosity overflow-hidden">
          <img 
            src={activeBanner.image} 
            alt="Promotion" 
            className="w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-1000"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent"></div>

        {/* Banner Content */}
        <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-3 sm:space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase bg-white/10 backdrop-blur-md text-amber-300 border border-white/15">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            {activeBanner.badge}
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
            {activeBanner.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-medium line-clamp-2">
            {activeBanner.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleBannerClick(activeBanner.category)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fresh-500 hover:bg-fresh-600 text-slate-950 font-bold text-sm shadow-lg shadow-fresh-500/25 transition-all transform active:scale-95"
            >
              <span>{activeBanner.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm text-slate-200 border border-white/10">
              {activeBanner.code}
            </span>
          </div>
        </div>

        {/* Carousel controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-6 bg-brand-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trust micro badges bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3">
        <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">12 Mins Delivery</div>
            <div className="text-[11px] text-slate-600">From our nearest hub</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Best Price & Offers</div>
            <div className="text-[11px] text-slate-600">Direct distributor rates</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">100% Genuine Items</div>
            <div className="text-[11px] text-slate-600">Strict quality assurance</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">No Minimum Order</div>
            <div className="text-[11px] text-slate-600">Free delivery on ₹499+</div>
          </div>
        </div>
      </div>
    </div>
  );
};
