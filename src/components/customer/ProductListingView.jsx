import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { 
  Filter, X, SlidersHorizontal, ArrowUpDown, 
  Star, Check, Sparkles, AlertCircle 
} from 'lucide-react';

export const ProductListingView = () => {
  const { 
    filteredProducts, 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    priceRange, 
    setPriceRange,
    minRating, 
    setMinRating,
    sortBy, 
    setSortBy,
    inStockOnly, 
    setInStockOnly 
  } = useStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSortBy('popularity');
    setInStockOnly(false);
  };

  const hasActiveFilters = 
    selectedCategory !== 'All' || 
    searchQuery.trim() !== '' || 
    minRating > 0 || 
    inStockOnly || 
    priceRange[1] < 1000 || 
    priceRange[0] > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">
              {selectedCategory === 'All' ? 'All Everyday Essentials' : selectedCategory}
            </h1>
            <span className="text-xs font-bold bg-brand-50 text-brand-600 px-2.5 py-1 rounded-full border border-brand-200">
              {filteredProducts.length} items
            </span>
          </div>
          {searchQuery && (
            <p className="text-xs text-slate-500 mt-1">
              Showing matching results for "<span className="font-semibold text-slate-800">{searchQuery}</span>"
            </p>
          )}
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 shadow-xs"
          >
            <Filter className="w-4 h-4 text-brand-600" />
            <span>Filters {hasActiveFilters && '•'}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="popularity">Popularity / Bestsellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Filter + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar Filter (Desktop) */}
        <aside className="hidden md:block bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-xs sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-brand-600" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-brand-600 hover:text-brand-700 font-bold"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories (15)</h3>
            <div className="max-h-56 overflow-y-auto space-y-1 pr-1 text-xs no-scrollbar">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-brand-50 text-brand-600 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat.name
                      ? 'bg-brand-50 text-brand-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {selectedCategory === cat.name && <Check className="w-3.5 h-3.5 text-brand-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400">Max Price</span>
              <span className="font-bold text-slate-900">₹{priceRange[1]}</span>
            </div>
            <input
              type="range"
              min="30"
              max="1000"
              step="20"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>₹30</span>
              <span>₹500</span>
              <span>₹1000</span>
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Minimum Rating</h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[4.8, 4.5, 4.0, 0].map((ratingVal) => (
                <button
                  key={ratingVal}
                  onClick={() => setMinRating(ratingVal)}
                  className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-all ${
                    minRating === ratingVal
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {ratingVal === 0 ? 'All Ratings' : `${ratingVal}★ & up`}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              <span>In-Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="md:col-span-3 space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 mx-auto flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No items match your criteria</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try clearing the search query or loosening the price and category filters.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-5 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">Filter Products</h2>
                <button 
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category Select */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-slate-400">Category</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="All">All 15 Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Price Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Max Price</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="1000"
                  step="20"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-brand-500"
                />
              </div>

              {/* Mobile Rating */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-slate-400">Rating</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[4.8, 4.5, 4.0, 0].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`py-2 rounded-xl border text-center font-semibold ${
                        minRating === r ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-slate-200'
                      }`}
                    >
                      {r === 0 ? 'All' : `${r}★ & above`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
