import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  CheckCircle2, Clock, MapPin, PackageCheck, 
  ArrowRight, ShieldCheck, Zap, Bike, MessageCircle, Share2 
} from 'lucide-react';

export const OrderSuccessView = () => {
  const { activeTrackingOrder, setActiveView, openWhatsAppForOrder } = useStore();

  if (!activeTrackingOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-slate-800">No active order</h2>
        <button
          onClick={() => setActiveView('home')}
          className="mt-4 px-6 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Confirmation Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-lg text-center space-y-5">
        
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 bg-fresh-100 text-fresh-600 rounded-full mx-auto flex items-center justify-center shadow-inner animate-bounce duration-1000">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-fresh-600 bg-fresh-50 px-3 py-1 rounded-full border border-fresh-200">
            Order Confirmed & Sent to Store
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Woohoo! Your essentials are on their way!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Order ID: <span className="font-mono font-bold text-slate-800">{activeTrackingOrder.id}</span>
          </p>
        </div>

        {/* WhatsApp Receipt Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-emerald-950">WhatsApp Order Integration</div>
              <div className="text-[11px] text-emerald-700">Send pre-formatted receipt or updates to your store partner directly</div>
            </div>
          </div>

          <button
            onClick={() => openWhatsAppForOrder(activeTrackingOrder)}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Open on WhatsApp</span>
          </button>
        </div>

        {/* Delivery OTP Card */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 text-white p-5 rounded-2xl max-w-md mx-auto shadow-md flex items-center justify-between">
          <div className="text-left">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Delivery Share OTP</div>
            <div className="text-xs text-slate-300">Share with partner at doorstep</div>
          </div>
          <div className="font-mono font-black text-2xl tracking-widest text-amber-300 bg-white/10 px-4 py-1.5 rounded-xl border border-white/20">
            {activeTrackingOrder.deliveryOtp || '4829'}
          </div>
        </div>

        {/* Delivery ETA info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-medium">Estimated Arrival</div>
            <div className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
              <Zap className="w-3.5 h-3.5 text-fresh-600" />
              <span>12 Mins (Express)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-medium">Payment Mode</div>
            <div className="font-bold text-slate-900 mt-0.5">
              {activeTrackingOrder.paymentMethod} (₹{activeTrackingOrder.total})
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setActiveView('order-tracking')}
            className="w-full sm:w-auto px-8 py-3.5 bg-fresh-600 hover:bg-fresh-700 text-white text-xs font-black rounded-2xl shadow-lg shadow-fresh-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Bike className="w-4 h-4" />
            <span>Track Order Live</span>
          </button>

          <button
            onClick={() => setActiveView('home')}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl transition-all"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};
