import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { BannerCarousel } from './BannerCarousel';
import { CategoryNav } from './CategoryNav';
import { ProductCard } from './ProductCard';
import { 
  Zap, Flame, ArrowRight, Sparkles, TrendingUp, 
  ShoppingBag, Award, Heart, ShieldCheck 
} from 'lucide-react';

export const HomePage = () => {
  const { products, categories, setSelectedCategory, setActiveView } = useStore();

  // Simulated flash deal countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExploreCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setActiveView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Curated category item slices
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 8);
  const dailyStaples = products.filter(p => p.category === 'Rice & Grains' || p.category === 'Atta & Flour' || p.category === 'Dal & Pulses').slice(0, 4);
  const dairyItems = products.filter(p => p.category === 'Dairy & Refrigerated').slice(0, 4);
  const snacksItems = products.filter(p => p.category === 'Biscuits & Snacks' || p.category === 'Breakfast & Ready Food').slice(0, 4);
  const householdItems = products.filter(p => p.category === 'Household Cleaning' || p.category === 'Kitchen & Household Items').slice(0, 4);
  const fruitsVeggies = products.filter(p => p.category === 'Fruits & Vegetables').slice(0, 4);
  const poojaEssentials = products.filter(p => p.category === 'Pooja / Religious Essentials').slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* 15 Categories Strip */}
      <CategoryNav />

      {/* Hero Promotional Banner */}
      <BannerCarousel />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">

        {/* Flash Deals / Super Saver Ticker */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-3 sm:p-4 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-xl">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight uppercase">
                  Lightning Flash Deals
                </span>
                <span className="text-[10px] bg-white text-orange-600 font-black px-2 py-0.5 rounded-full uppercase">
                  Ends In
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium">Extra discounts on morning essentials & dairy</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 font-mono font-black text-sm sm:text-base">
              <span className="bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>

            <button
              onClick={() => handleExploreCategory('All')}
              className="ml-2 px-3.5 py-1.5 bg-white text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
            >
              Grab Deals
            </button>
          </div>
        </div>

        {/* Section: Best Sellers in Your Area */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Best Sellers in Bhubaneswar
                </h2>
                <p className="text-xs text-slate-500 font-medium">Most ordered items by 10,000+ local families this week</p>
              </div>
            </div>

            <button
              onClick={() => handleExploreCategory('All')}
              className="group flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Section: Daily Essentials (Rice, Atta, Dal) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-brand-700 flex items-center justify-center font-bold">
                🌾
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Daily Staples: Rice, Atta & Dal
                </h2>
                <p className="text-xs text-slate-500 font-medium">100% unpolished pulses, aged basmati & sharbati wheat</p>
              </div>
            </div>

            <button
              onClick={() => handleExploreCategory('Rice & Grains')}
              className="group flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>Explore Staples</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {dailyStaples.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Section: Dairy, Milk & Butter */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-fresh-100 text-fresh-700 flex items-center justify-center font-bold">
                🥛
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Farm Fresh Dairy & Paneer
                </h2>
                <p className="text-xs text-slate-500 font-medium">Morning batches of Amul milk, malai paneer, dahi & cheese</p>
              </div>
            </div>

            <button
              onClick={() => handleExploreCategory('Dairy & Refrigerated')}
              className="group flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>View Dairy</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {dairyItems.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Section: Fruits & Farm Harvest */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                🍅
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Farm Fresh Fruits & Vegetables
                </h2>
                <p className="text-xs text-slate-500 font-medium">Naturally ripe tomatoes, onions, crisp potatoes & Shimla apples</p>
              </div>
            </div>

            <button
              onClick={() => handleExploreCategory('Fruits & Vegetables')}
              className="group flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>Shop Veggies</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {fruitsVeggies.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Section: Biscuits, Snacks & Instant Breakfast */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                🍪
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Tea Time Munchies & Instant Snacks
                </h2>
                <p className="text-xs text-slate-500 font-medium">Parle-G, Maggi, Aloo Bhujia, Silk chocolate & Badam</p>
              </div>
            </div>

            <button
              onClick={() => handleExploreCategory('Biscuits & Snacks')}
              className="group flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>See Snacks</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {snacksItems.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Section: Cleaning & Kitchen Utility */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                ✨
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Household Cleaning & Essentials
                </h2>
                <p className="text-xs text-slate-500 font-medium">Surf Excel Matic, Vim Gel, Harpic, Freshwrapp Foil & Bags</p>
              </div>
            </div>

            <button
              onClick={() => handleExploreCategory('Household Cleaning')}
              className="group flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>View Cleaners</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {householdItems.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Section: Pooja Essentials */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                🪔
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Pooja & Religious Essentials
                </h2>
                <p className="text-xs text-slate-500 font-medium">Cycle pure agarbatti, Bhimseni camphor, cotton batti & Gangajal</p>
              </div>
            </div>

            <button
              onClick={() => handleExploreCategory('Pooja / Religious Essentials')}
              className="group flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>Browse Pooja Items</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {poojaEssentials.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
