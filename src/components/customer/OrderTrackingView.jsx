import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ArrowLeft, CheckCircle2, Clock, Bike, PackageCheck, 
  MapPin, Phone, MessageSquare, ShieldCheck, Zap, MessageCircle 
} from 'lucide-react';

export const OrderTrackingView = () => {
  const { activeTrackingOrder, orders, updateOrderStatus, openWhatsAppForOrder, setActiveView } = useStore();

  const currentOrder = orders.find(o => o.id === activeTrackingOrder?.id) || activeTrackingOrder || orders[0];

  const stages = [
    { key: "Pending", label: "Order Placed", time: "2 mins ago", sub: "Received by hub partner" },
    { key: "Confirmed", label: "Packing Items", time: "1 min ago", sub: "Quality checked & packed in cold bag" },
    { key: "Out for Delivery", label: "Out for Delivery", time: "Just now", sub: "Delivery partner on electric scooter" },
    { key: "Delivered", label: "Delivered", time: "Expected in 10 mins", sub: "Handed over at doorstep" }
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case "Pending": return 0;
      case "Confirmed": return 1;
      case "Out for Delivery": return 2;
      case "Delivered": return 3;
      case "Cancelled": return -1;
      default: return 1;
    }
  };

  const currentIndex = getStageIndex(currentOrder?.status);

  const handleNextStep = () => {
    if (!currentOrder) return;
    const nextStatusMap = {
      "Pending": "Confirmed",
      "Confirmed": "Out for Delivery",
      "Out for Delivery": "Delivered"
    };
    const next = nextStatusMap[currentOrder.status];
    if (next) {
      updateOrderStatus(currentOrder.id, next);
    }
  };

  if (!currentOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-3">
        <h2 className="text-lg font-bold text-slate-800">No order to track</h2>
        <button
          onClick={() => setActiveView('home')}
          className="px-6 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold"
        >
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('orders')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>My Orders</span>
        </button>

        <div className="flex items-center gap-2">
          {/* WhatsApp Share Receipt */}
          <button
            onClick={() => openWhatsAppForOrder(currentOrder)}
            className="text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Receipt</span>
          </button>

          {/* Demo Simulation Step Button */}
          {currentOrder.status !== 'Delivered' && (
            <button
              onClick={handleNextStep}
              className="text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
              title="Advance the delivery status to preview live transition"
            >
              <span>⏩ Next Stage</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tracking Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Header summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-fresh-50 text-fresh-700 px-2.5 py-0.5 rounded-md border border-fresh-200">
                {currentOrder.status}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-mono font-bold">
                Order ID: {currentOrder.id}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              {currentOrder.status === 'Delivered' ? 'Delivered Successfully! 🎉' : 'Arriving in 10-12 Mins ⚡'}
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs text-slate-400 font-medium">OTP for Delivery</div>
            <div className="text-2xl font-mono font-black text-brand-600">
              {currentOrder.deliveryOtp || '4829'}
            </div>
          </div>
        </div>

        {/* Visual Animated Timeline */}
        <div className="relative py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {stages.map((stage, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isFuture = idx > currentIndex;

              return (
                <div key={stage.key} className="relative flex md:flex-col items-start gap-4 md:gap-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs z-10 transition-all ${
                    isPast || isCurrent
                      ? 'bg-fresh-500 text-white shadow-md shadow-fresh-500/30'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  } ${isCurrent ? 'ring-4 ring-fresh-100 scale-110' : ''}`}>
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{stage.label}</span>
                      {isCurrent && (
                        <span className="inline-block w-2 h-2 rounded-full bg-fresh-500 animate-ping" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{stage.sub}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-1">{stage.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Partner Details Card with WhatsApp action */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-brand-500/20">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Ramesh Kumar</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                  4.9 ★ (1,450 deliveries)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Electric Scooter • Thermal Bag Sealed</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a 
              href="tel:9876543210" 
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-600" />
              <span>Call Partner</span>
            </a>
            <button 
              onClick={() => openWhatsAppForOrder(currentOrder)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Order Details Accordion / Summary */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Order Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="space-y-1">
              <span className="font-bold text-slate-800 block">Delivery Address:</span>
              <p className="font-medium text-slate-900">{currentOrder.customer.name}</p>
              <p>{currentOrder.customer.address}, {currentOrder.customer.city} - {currentOrder.customer.pincode}</p>
              <p className="text-slate-500 font-medium">Contact: {currentOrder.customer.phone}</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-800 block">Items in this Delivery ({currentOrder.items?.length || 0}):</span>
              <ul className="space-y-1 max-h-32 overflow-y-auto no-scrollbar">
                {currentOrder.items?.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-slate-700">
                    <span className="truncate pr-2">{item.name} × {item.quantity}</span>
                    <span className="font-semibold text-slate-900 shrink-0">₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-black text-slate-900 text-sm">
                <span>Total Amount Paid</span>
                <span>₹{currentOrder.total}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
