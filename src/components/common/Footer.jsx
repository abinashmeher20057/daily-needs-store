import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShieldCheck, Clock, RefreshCw, CreditCard, 
  Phone, Mail, MapPin, Zap, ArrowRight, Heart 
} from 'lucide-react';

export const Footer = () => {
  const { categories, setSelectedCategory, setActiveView } = useStore();

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setActiveView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Top 4 Value Propositions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">12-Minute Instant Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Order packed and dispatched from your nearest micro-hub within 3 mins.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Quality & Freshness</h4>
              <p className="text-xs text-slate-400 mt-0.5">Farm-fresh produce and direct authorized distributor staple goods.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Safe & Contactless Payment</h4>
              <p className="text-xs text-slate-400 mt-0.5">UPI, Cards, Netbanking & Cash/QR on Delivery supported seamlessly.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Instant Doorstep Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">Not happy with quality? Instant replacement or refund with zero questions.</p>
            </div>
          </div>
        </div>

        {/* 15 Categories Links Directory */}
        <div className="space-y-4">
          <h3 className="font-black text-white text-sm uppercase tracking-wider text-slate-200">
            Browse All 15 Daily Essentials Categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="text-left text-slate-400 hover:text-white transition-colors py-1 flex items-center gap-1 group"
              >
                <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-brand-400 transition-colors" />
                <span className="truncate">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Brand & Support Bottom Line */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              <span className="font-black text-white text-sm tracking-tight">Daily Needs Store</span>
            </div>
            <span>•</span>
            <span>Inspired by Flipkart & elevated with Apple & Blinkit minimalism.</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setActiveView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold"
            >
              Admin Portal
            </button>
            <span>•</span>
            <span>Customer Care: 1800-202-0099</span>
            <span>•</span>
            <span>Hub: Patia, Bhubaneswar</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
