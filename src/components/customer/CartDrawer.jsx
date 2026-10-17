import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, 
  ShieldCheck, Zap, Tag, CheckCircle2, AlertCircle 
} from 'lucide-react';

export const CartDrawer = () => {
  const { 
    cart, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    cartSubtotal, 
    cartMrpTotal, 
    cartSavings, 
    deliveryFee, 
    cartTotal,
    cartItemsCount,
    setActiveView,
    showToast
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode === 'DAILY50' || cleanCode === 'FIRST50') {
      if (cartSubtotal >= 300) {
        setAppliedDiscount(50);
        setCouponMessage({ type: 'success', text: 'Coupon applied! ₹50 extra discount added.' });
        showToast('Coupon DAILY50 applied! ₹50 OFF', 'success');
      } else {
        setCouponMessage({ type: 'error', text: 'Minimum order of ₹300 required for this coupon.' });
      }
    } else if (cleanCode === 'SUPER100') {
      if (cartSubtotal >= 800) {
        setAppliedDiscount(100);
        setCouponMessage({ type: 'success', text: 'Coupon applied! ₹100 extra discount added.' });
        showToast('Coupon SUPER100 applied! ₹100 OFF', 'success');
      } else {
        setCouponMessage({ type: 'error', text: 'Minimum order of ₹800 required for this coupon.' });
      }
    } else {
      setCouponMessage({ type: 'error', text: 'Invalid coupon code. Try DAILY50' });
    }
  };

  const finalOrderTotal = Math.max(0, cartTotal - appliedDiscount);
  const freeDeliveryThreshold = 499;
  const amountNeededForFreeDelivery = freeDeliveryThreshold - cartSubtotal;

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setActiveView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 border-l border-slate-200">
          
          {/* Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-fresh-100 flex items-center justify-center text-fresh-600">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">My Basket</h2>
                <p className="text-xs text-slate-500 font-medium">
                  {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-500 hover:text-rose-700 font-semibold px-2 py-1"
                >
                  Clear All
                </button>
              )}
              <button 
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Delivery threshold bar */}
          {cart.length > 0 && (
            <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 text-xs">
              {amountNeededForFreeDelivery > 0 ? (
                <div className="flex items-center justify-between text-emerald-800 font-medium">
                  <span>Add <strong>₹{amountNeededForFreeDelivery}</strong> more for <strong>FREE Delivery</strong></span>
                  <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded-full font-bold">Standard ₹25</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Yay! You've unlocked FREE Instant Delivery</span>
                </div>
              )}
            </div>
          )}

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-3xl">
                  🛒
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Your basket is empty</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                    Explore daily essentials, fresh fruits, vegetables, spices & snacks at lightning speed!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setActiveView('products');
                  }}
                  className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl shadow-md transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="bg-white rounded-2xl border border-slate-200 p-3 divide-y divide-slate-100">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-14 h-14 object-cover rounded-xl border border-slate-100 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                          {product.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {product.unit}
                        </div>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            ₹{product.price * quantity}
                          </span>
                          {product.mrp > product.price && (
                            <span className="text-[11px] text-slate-400 line-through">
                              ₹{product.mrp * quantity}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs shrink-0">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 hover:bg-white rounded text-slate-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 font-bold text-slate-900 min-w-[20px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 hover:bg-white rounded text-slate-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Box */}
                <div className="bg-white rounded-2xl border border-slate-200 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                    <Tag className="w-3.5 h-3.5 text-brand-600" />
                    <span>Apply Coupon / Voucher</span>
                  </div>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try DAILY50 or SUPER100"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      Apply
                    </button>
                  </form>
                  {couponMessage && (
                    <p className={`text-[11px] mt-1.5 font-medium ${
                      couponMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {couponMessage.text}
                    </p>
                  )}
                </div>

                {/* Bill Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 text-xs text-slate-600">
                  <div className="font-bold text-slate-900 text-sm pb-1 border-b border-slate-100 flex items-center justify-between">
                    <span>Bill Details</span>
                    <span className="text-[11px] text-fresh-600 font-bold bg-fresh-50 px-2 py-0.5 rounded-full">
                      ⚡ 12-Min Delivery
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Items Total (MRP)</span>
                    <span className="text-slate-800">₹{cartMrpTotal}</span>
                  </div>

                  {cartSavings > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Product Discount</span>
                      <span>-₹{cartSavings}</span>
                    </div>
                  )}

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-brand-600 font-semibold">
                      <span>Coupon Discount</span>
                      <span>-₹{appliedDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Delivery Partner Fee</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-600 font-bold uppercase">FREE</span>
                      ) : (
                        <span>₹{deliveryFee}</span>
                      )}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline text-sm font-extrabold text-slate-900">
                    <span>To Pay</span>
                    <span className="text-base text-slate-950 font-black">₹{finalOrderTotal}</span>
                  </div>

                  {cartSavings + appliedDiscount > 0 && (
                    <div className="p-2 bg-emerald-50 rounded-xl text-center text-[11px] font-bold text-emerald-700">
                      🎉 Congratulations! You are saving ₹{cartSavings + appliedDiscount} on this order!
                    </div>
                  )}
                </div>

                {/* Safety & Cancellation Note */}
                <div className="text-[11px] text-slate-600 flex items-center gap-2 p-2 bg-slate-100/70 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Genuine Products • Contactless 12-Minute Delivery</span>
                </div>
              </>
            )}
          </div>

          {/* Sticky Bottom Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-4 bg-white border-t border-slate-200 shadow-lg space-y-2">
              <button
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-between bg-gradient-to-r from-fresh-600 to-fresh-500 hover:from-fresh-700 hover:to-fresh-600 text-white p-3.5 rounded-2xl font-bold shadow-lg shadow-fresh-500/25 transition-all transform active:scale-98"
              >
                <div className="text-left">
                  <div className="text-xs font-semibold text-fresh-100">Total to Pay</div>
                  <div className="text-base font-black">₹{finalOrderTotal}</div>
                </div>

                <div className="flex items-center gap-1.5 text-sm font-bold bg-white/20 px-3 py-1.5 rounded-xl">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
