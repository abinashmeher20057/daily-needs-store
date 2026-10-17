import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Package, Clock, ArrowRight, CheckCircle2, RotateCw, Bike, Award, Eye, Zap, ShieldCheck } from 'lucide-react';

export const OrdersHistoryView = () => {
  const { 
    orders, 
    setActiveTrackingOrder, 
    setActiveView, 
    addToCart, 
    products, 
    showToast,
    user,
    visitCount,
    loginCount,
    lastVisitTime,
    loyaltyTier,
    formatTimeAgo
  } = useStore();

  const handleTrackOrder = (order) => {
    setActiveTrackingOrder(order);
    setActiveView('order-tracking');
  };

  const handleReorder = (order) => {
    order.items.forEach(item => {
      const fullProduct = products.find(p => p.id === item.id) || {
        id: item.id,
        name: item.name,
        price: item.price,
        mrp: item.price + 20,
        unit: item.unit || "1 pc",
        image: item.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80"
      };
      addToCart(fullProduct, item.quantity);
    });
    showToast(`Items from ${order.id} re-added to basket!`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* 🌟 CUSTOMER PROFILE & WEBSITE ACTIVITY STATS */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${loyaltyTier.badgeBg} flex items-center justify-center text-white text-xl font-black shadow-lg shadow-brand-500/20`}>
              {user?.name?.charAt(0) || '👤'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{user?.name || 'Customer Shopper'}</h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {loyaltyTier.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {user?.email || 'Logged in shopper'} • {loyaltyTier.perk}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Site Opens</div>
              <div className="text-base font-extrabold text-white font-mono">{visitCount} <span className="text-[10px] text-brand-300 font-normal">times</span></div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Logins</div>
              <div className="text-base font-extrabold text-emerald-400 font-mono">{loginCount} <span className="text-[10px] text-emerald-300 font-normal">times</span></div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-center hidden sm:block">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Orders</div>
              <div className="text-base font-extrabold text-amber-300 font-mono">{orders.length}</div>
            </div>
          </div>
        </div>

        {lastVisitTime && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Previous Store Session: <strong className="text-slate-200">{formatTimeAgo(lastVisitTime)}</strong>
            </span>
            <span className="flex items-center gap-1 text-fresh-400 font-semibold">
              <Zap className="w-3.5 h-3.5 text-fresh-400" /> 12-Min Priority Dispatch Active
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Orders & Receipts</h1>
          <p className="text-xs text-slate-500 font-medium">Review current deliveries and past purchases</p>
        </div>
        <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
          {orders.length} Orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-3xl">
            📦
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No orders placed yet</h3>
            <p className="text-xs text-slate-500 mt-1">Start shopping from our fresh 15-category catalog!</p>
          </div>
          <button
            onClick={() => setActiveView('home')}
            className="px-6 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isOngoing = order.status !== 'Delivered' && order.status !== 'Cancelled';
            return (
              <div 
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 text-sm">{order.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      order.status === 'Delivered' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : order.status === 'Cancelled'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="text-slate-400 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {/* Items breakdown */}
                <div className="divide-y divide-slate-100 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="text-slate-400">({item.unit || '1 pc'})</span>
                        <span className="text-slate-500 font-bold">× {item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Footer details & Action */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Paid via </span>
                    <span className="font-bold text-slate-700">{order.paymentMethod}</span>
                    <span className="text-slate-400"> • Total: </span>
                    <span className="font-black text-slate-950 text-sm">₹{order.total}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isOngoing && (
                      <button
                        onClick={() => handleTrackOrder(order)}
                        className="px-4 py-2 bg-fresh-600 hover:bg-fresh-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all text-xs"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Track Live Status</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center gap-1.5 transition-colors text-xs"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Reorder Items</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
