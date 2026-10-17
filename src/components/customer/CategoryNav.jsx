import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Wheat, Layers, CircleDot, Flame, Sparkles, Coffee, 
  Cookie, Utensils, Milk, HeartPulse, Sparkle, 
  PackageCheck, Smile, Apple, SunMedium, LayoutGrid
} from 'lucide-react';

const iconMap = {
  Wheat, Layers, CircleDot, Flame, Sparkles, Coffee,
  Cookie, Utensils, Milk, HeartPulse, Sparkle,
  PackageCheck, Smile, Apple, SunMedium
};

export const CategoryNav = () => {
  const { categories, selectedCategory, setSelectedCategory, setActiveView } = useStore();

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setActiveView('products');
  };

  return (
    <div className="bg-white border-b border-slate-200/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {/* 'All Categories' Button */}
          <button
            onClick={() => handleCategoryClick('All')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All 15 Categories</span>
          </button>

          {/* 15 Categories Buttons */}
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || LayoutGrid;
            const isSelected = selectedCategory === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-brand-500 text-white font-semibold shadow-sm shadow-brand-500/20'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <span className={`p-1 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'text-slate-600 group-hover:text-brand-600'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
