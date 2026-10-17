import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { AddressModal } from '../customer/AddressModal';
import { CustomerAuthModal } from '../auth/CustomerAuthModal';
import { 
  Search, ShoppingCart, Heart, User, MapPin, ChevronDown, 
  Sparkles, Zap, Package, ShieldCheck, X, ArrowRight, Menu, Plus, Home, LogOut,
  Award, Clock, Eye, Activity
} from 'lucide-react';

export const Header = () => {
  const { 
    cartItemsCount, 
    cartTotal, 
    wishlist, 
    activeView, 
    setActiveView, 
    setIsCartDrawerOpen, 
    searchQuery, 
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    deliveryLocation,
    setDeliveryLocation,
    savedAddresses,
    selectedAddress,
    setSelectedAddressId,
    products,
    user,
    setUser,
    showToast,
    viewProductDetails,
    visitCount,
    loginCount,
    lastVisitTime,
    loyaltyTier,
    formatTimeAgo
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef(null);

  // Autocomplete search suggestions
  const searchSuggestions = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const locations = [
    { city: "Bhubaneswar", pincode: "751024", area: "Patia / Infocity", eta: "12 mins" },
    { city: "Bhubaneswar", pincode: "751013", area: "Jayadev Vihar / Nayapalli", eta: "15 mins" },
    { city: "Bhubaneswar", pincode: "751001", area: "Saheed Nagar / Master Canteen", eta: "14 mins" },
    { city: "Cuttack", pincode: "753001", area: "Badambadi / CDA", eta: "20 mins" },
    { city: "Bengaluru", pincode: "560103", area: "Bellandur / Outer Ring Rd", eta: "10 mins" },
    { city: "Mumbai", pincode: "400050", area: "Bandra West / Linking Rd", eta: "12 mins" },
    { city: "New Delhi", pincode: "110001", area: "Connaught Place", eta: "15 mins" },
  ];

  const handleSignOutCustomer = () => {
    localStorage.removeItem('dns_user');
    localStorage.removeItem('dns_token');
    setUser(null);
    setIsUserMenuOpen(false);
    showToast("Signed out of customer account", "info");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-fresh-500/20 text-fresh-400 px-2 py-0.5 rounded-full text-[11px] font-medium border border-fresh-500/30">
              <Zap className="w-3 h-3 text-fresh-400 animate-pulse" /> Instant 12-Min Delivery
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">WhatsApp Orders & Customer / Admin Portals Active</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {/* Top Admin Button */}
            <button 
              onClick={() => setActiveView('admin')} 
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all font-bold ${
                activeView === 'admin' 
                  ? 'bg-amber-400 text-slate-950 shadow-sm' 
                  : 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Portal ⚙️</span>
            </button>
            <span className="hidden sm:inline text-slate-400">24x7 Care: 1800-202-0099</span>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Logo & Location block */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={() => {
                setActiveView('home');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <span className="text-xl">🛒</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                    Daily<span className="text-brand-500">Needs</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600 px-1.5 py-0.5 rounded border border-brand-200">
                    Store
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium tracking-tight">Flipkart Speed • 100% Fresh</p>
              </div>
            </button>

            {/* Location & Customer Address Dropdown */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all text-left"
              >
                <div className="w-7 h-7 rounded-full bg-fresh-100 flex items-center justify-center text-fresh-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-900">
                    <span>Deliver to {selectedAddress ? selectedAddress.type : 'Home'} ({deliveryLocation.eta})</span>
                    <ChevronDown className="w-3 h-3 text-slate-600" />
                  </div>
                  <div className="text-[11px] text-slate-600 truncate max-w-[140px]">
                    {selectedAddress ? `${selectedAddress.house}, ${selectedAddress.street}` : `${deliveryLocation.area}, ${deliveryLocation.pincode}`}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <div className={`relative flex items-center w-full rounded-xl transition-all duration-200 ${
              isSearchFocused 
                ? 'bg-white ring-2 ring-brand-500 shadow-lg shadow-brand-500/10 border-transparent' 
                : 'bg-slate-100 hover:bg-slate-50 border border-slate-200'
            }`}>
              <Search className="w-5 h-5 text-slate-600 ml-3.5 shrink-0" />
              <input
                type="text"
                placeholder="Search 15 categories (e.g. Basmati Rice, Tata Salt, Desi Ghee, Maggi)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeView !== 'products' && activeView !== 'home') {
                    setActiveView('products');
                  }
                }}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full py-2.5 pl-3 pr-9 bg-transparent text-sm text-slate-800 placeholder-slate-600 focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-1 mr-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-600 flex justify-between">
                  <span>Search Suggestions</span>
                  <span className="text-brand-600 font-medium">Found {searchSuggestions.length} products</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {searchSuggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        viewProductDetails(item);
                        setIsSearchFocused(false);
                      }}
                      className="w-full flex items-center justify-between p-3 hover:bg-brand-50/60 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-10 h-10 object-cover rounded-lg border border-slate-100" 
                        />
                        <div>
                          <div className="text-sm font-medium text-slate-900 group-hover:text-brand-600 line-clamp-1">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-600 flex items-center gap-2">
                            <span>{item.category}</span>
                            <span>•</span>
                            <span>{item.unit}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-slate-900">₹{item.price}</div>
                        <div className="text-[11px] text-slate-600 line-through">₹{item.mrp}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setActiveView('products');
                      setIsSearchFocused(false);
                    }}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center justify-center gap-1 mx-auto"
                  >
                    View all matching results <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Admin Portal Header Button */}
            <button
              onClick={() => setActiveView('admin')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                activeView === 'admin'
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Admin Portal</span>
            </button>

            {/* Customer Login / User Profile Dropdown */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all shadow-xs"
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${loyaltyTier.badgeBg} text-white flex items-center justify-center font-extrabold text-xs shadow-xs`}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="leading-tight font-bold text-slate-900 max-w-[85px] truncate">
                      {user.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-brand-600 font-semibold flex items-center gap-0.5">
                      <span>Visit #{visitCount}</span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsCustomerAuthModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-brand-200 bg-brand-50 hover:bg-brand-100 text-xs font-bold text-brand-700 transition-all"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  {/* Visitor Badge for Guest / New visitor */}
                  <span 
                    title={`You have opened this website ${visitCount} time${visitCount > 1 ? 's' : ''}`}
                    className="hidden xl:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold"
                  >
                    <Eye className="w-3 h-3 text-slate-500" />
                    <span>Visit #{visitCount}</span>
                  </span>
                </div>
              )}

              {/* User Menu Dropdown */}
              {isUserMenuOpen && user && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in duration-150">
                  
                  {/* User Profile Header */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-extrabold text-slate-900 truncate text-sm">{user.name}</div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${loyaltyTier.color} border`}>
                        {loyaltyTier.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                  </div>

                  {/* 📊 WEBSITE ACTIVITY & VISIT COUNTER WIDGET */}
                  <div className="p-2.5 mb-2 rounded-xl bg-gradient-to-br from-brand-50/60 to-fresh-50/60 border border-brand-100/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span className="flex items-center gap-1 text-brand-700">
                        <Activity className="w-3.5 h-3.5 text-brand-600" /> Store Activity Stats
                      </span>
                      <span className="text-fresh-700 font-extrabold text-[10px] uppercase bg-fresh-100 px-1.5 py-0.5 rounded">
                        Active Shopper
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-xs">
                        <div className="text-[10px] text-slate-500 font-semibold">Website Opens</div>
                        <div className="text-base font-extrabold text-brand-700 font-mono">
                          {visitCount} <span className="text-[10px] font-normal text-slate-500">times</span>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-xs">
                        <div className="text-[10px] text-slate-500 font-semibold">User Logins</div>
                        <div className="text-base font-extrabold text-fresh-700 font-mono">
                          {loginCount} <span className="text-[10px] font-normal text-slate-500">times</span>
                        </div>
                      </div>
                    </div>

                    {lastVisitTime && (
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 px-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> Last opened:
                        </span>
                        <span className="font-semibold text-slate-700">{formatTimeAgo(lastVisitTime)}</span>
                      </div>
                    )}
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setActiveView('orders');
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Package className="w-4 h-4 text-slate-500" />
                        <span>My Orders</span>
                      </div>
                      <span className="text-[10px] text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-full">
                        Live Tracking
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsAddressModalOpen(true);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span>Delivery Addresses</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {savedAddresses.length} saved
                      </span>
                    </button>
                  </div>

                  {/* Sign Out */}
                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <button
                      onClick={handleSignOutCustomer}
                      className="w-full text-left p-2 rounded-xl hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* Address management button */}
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all"
              title="Add / Edit Delivery Address"
            >
              <MapPin className="w-3.5 h-3.5 text-fresh-600" />
              <span>Address</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setActiveView('wishlist')}
              className={`relative p-2.5 rounded-xl border transition-all ${
                activeView === 'wishlist' 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Saved Items"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Orders link */}
            <button
              onClick={() => setActiveView('orders')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                activeView === 'orders'
                  ? 'bg-brand-50 border-brand-200 text-brand-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Package className="w-4 h-4 text-slate-600" />
              <span>Orders</span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2.5 bg-gradient-to-r from-fresh-600 to-fresh-500 hover:from-fresh-700 hover:to-fresh-600 text-white px-3.5 sm:px-4 py-2 rounded-xl shadow-md shadow-fresh-500/20 font-semibold text-sm transition-all transform active:scale-95"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-fresh-700 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[11px] font-medium text-fresh-100">
                  {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'}
                </span>
                <span className="font-bold text-sm">₹{cartTotal}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Location Selector Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-fresh-100 flex items-center justify-center text-fresh-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Select Delivery Location</h3>
                  <p className="text-xs text-slate-600">Get live delivery times & store stock</p>
                </div>
              </div>
              <button 
                onClick={() => setIsLocationModalOpen(false)}
                className="p-1 rounded-full text-slate-600 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Saved Addresses quick switch */}
            {savedAddresses.length > 0 && (
              <div className="py-3 border-b border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">My Saved Addresses</span>
                  <button
                    onClick={() => {
                      setIsLocationModalOpen(false);
                      setIsAddressModalOpen(true);
                    }}
                    className="text-xs text-brand-600 font-bold hover:underline"
                  >
                    + Add New
                  </button>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddressId(addr.id);
                        setIsLocationModalOpen(false);
                      }}
                      className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                        selectedAddress?.id === addr.id
                          ? 'border-brand-500 bg-brand-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-bold text-slate-900">{addr.type}: </span>
                        <span className="text-slate-600">{addr.house}, {addr.street}</span>
                      </div>
                      {selectedAddress?.id === addr.id && (
                        <span className="text-[10px] bg-brand-600 text-white font-bold px-1.5 py-0.2 rounded">
                          ACTIVE
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="py-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 px-1">Popular Delivery Hubs</p>
              {locations.map((loc, idx) => {
                const isSelected = deliveryLocation.pincode === loc.pincode && deliveryLocation.area === loc.area;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setDeliveryLocation(loc);
                      setIsLocationModalOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-500' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{loc.area}</span>
                        {isSelected && <span className="text-[10px] bg-brand-600 text-white px-1.5 py-0.2 rounded font-bold">CURRENT</span>}
                      </div>
                      <div className="text-xs text-slate-600">{loc.city} - {loc.pincode}</div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-fresh-600 bg-fresh-50 px-2 py-0.5 rounded-full border border-fresh-200">
                        ⚡ {loc.eta}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Management Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />

      {/* Customer Auth Modal (Login / Register) */}
      <CustomerAuthModal
        isOpen={isCustomerAuthModalOpen}
        onClose={() => setIsCustomerAuthModalOpen(false)}
      />
    </header>
  );
};
