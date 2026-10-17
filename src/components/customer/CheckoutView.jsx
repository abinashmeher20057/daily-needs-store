import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AddressModal } from './AddressModal';
import { 
  ArrowLeft, MapPin, Clock, CreditCard, ShieldCheck, 
  CheckCircle2, Zap, Smartphone, Banknote, Plus, 
  Edit2, Trash2, Home, Building2, Navigation, MessageCircle 
} from 'lucide-react';

export const CheckoutView = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartMrpTotal, 
    cartSavings, 
    deliveryFee, 
    cartTotal,
    savedAddresses,
    selectedAddressId,
    setSelectedAddressId,
    selectedAddress,
    deleteAddress,
    createOrder,
    openWhatsAppForOrder,
    setActiveView 
  } = useStore();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressData, setEditingAddressData] = useState(null);

  const [deliverySlot, setDeliverySlot] = useState("Express (12-15 Mins)");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("meher@okhdfcbank");
  const [sendViaWhatsApp, setSendViaWhatsApp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-3xl">
          🛒
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your basket is empty</h2>
        <p className="text-xs text-slate-500">Add products before proceeding to checkout.</p>
        <button
          onClick={() => setActiveView('home')}
          className="px-6 py-2.5 bg-brand-500 text-white text-xs font-bold rounded-xl"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  const handleOpenAddAddress = () => {
    setEditingAddressData(null);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr, e) => {
    e.stopPropagation();
    setEditingAddressData(addr);
    setIsAddressModalOpen(true);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      alert("Please add or select a delivery address!");
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customer: {
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        email: "customer@example.com",
        address: `${selectedAddress.house}, ${selectedAddress.street}${selectedAddress.landmark ? ` (${selectedAddress.landmark})` : ''}`,
        city: selectedAddress.city,
        pincode: selectedAddress.pincode,
        addressType: selectedAddress.type
      },
      items: cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        unit: item.product.unit,
        image: item.product.image
      })),
      subtotal: cartSubtotal,
      deliveryFee: deliveryFee,
      discount: cartSavings,
      total: cartTotal,
      paymentMethod: paymentMethod,
      deliverySlot: deliverySlot,
    };

    setTimeout(() => {
      createOrder(orderPayload, sendViaWhatsApp);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shopping</span>
        </button>

        {/* WhatsApp Notice Pill */}
        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Instant WhatsApp order receipt enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Columns: Multi-step checkout details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Delivery Address Management */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-base">Select Delivery Address</h2>
                  <p className="text-xs text-slate-500">Pick where your groceries should be delivered</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenAddAddress}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl border border-brand-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add New Address</span>
              </button>
            </div>

            {/* Saved Addresses List */}
            {savedAddresses.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-semibold text-slate-700">No delivery address saved yet</div>
                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Add Your Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  const TypeIcon = addr.type === 'Work' ? Building2 : addr.type === 'Other' ? Navigation : Home;

                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`relative p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            <TypeIcon className="w-3 h-3 text-slate-600" />
                            <span>{addr.type}</span>
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => handleOpenEditAddress(addr, e)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"
                              title="Edit Address"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {savedAddresses.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteAddress(addr.id);
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
                                title="Delete Address"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="font-bold text-slate-900 text-xs">{addr.name}</div>
                        <p className="text-slate-600 text-xs leading-snug line-clamp-2">
                          {addr.house}, {addr.street}
                          {addr.landmark && `, near ${addr.landmark}`}
                        </p>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {addr.city} - {addr.pincode} • Phone: {addr.phone}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-3 pt-2 border-t border-brand-200/60 flex items-center gap-1 text-[11px] font-bold text-brand-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                          <span>Selected for this delivery</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2: Delivery Slot */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-fresh-50 text-fresh-600 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-base">Select Delivery Slot</h2>
                <p className="text-xs text-slate-500">Pick lightning speed or scheduled convenience</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "Express (12-15 Mins)", title: "⚡ Express 12-15 Mins", badge: "Fastest", sub: "Dispatched from nearby hub instantly" },
                { id: "Morning (7:00 AM - 9:00 AM)", title: "🌅 Tomorrow Morning", badge: "Scheduled", sub: "Fresh 7:00 AM - 9:00 AM slot" },
                { id: "Evening (6:00 PM - 8:00 PM)", title: "🌆 Tomorrow Evening", badge: "Convenient", sub: "After work 6:00 PM - 8:00 PM slot" }
              ].map(slot => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setDeliverySlot(slot.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    deliverySlot === slot.id 
                      ? 'border-fresh-500 bg-fresh-50/60 ring-2 ring-fresh-500 shadow-xs' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{slot.title}</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {slot.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{slot.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Payment Options & WhatsApp Notification */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-base">Payment Method & WhatsApp Sync</h2>
                <p className="text-xs text-slate-500">100% Encrypted & Safe Payments</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* UPI Option */}
              <div 
                onClick={() => setPaymentMethod("UPI")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "UPI" ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-500' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">UPI / QR Code</div>
                      <div className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === "UPI"}
                    onChange={() => setPaymentMethod("UPI")}
                    className="accent-brand-600"
                  />
                </div>
                {paymentMethod === "UPI" && (
                  <div className="mt-3 pt-3 border-t border-brand-100 flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter UPI ID (e.g. mobile@upi)"
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                    />
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center px-2">
                      Verified ✓
                    </span>
                  </div>
                )}
              </div>

              {/* Credit/Debit Card */}
              <div 
                onClick={() => setPaymentMethod("Credit Card")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "Credit Card" ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-500' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-brand-700 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Credit / Debit Card</div>
                      <div className="text-[11px] text-slate-500">Visa, MasterCard, RuPay, Maestro</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === "Credit Card"}
                    onChange={() => setPaymentMethod("Credit Card")}
                    className="accent-brand-600"
                  />
                </div>
              </div>

              {/* Cash on Delivery */}
              <div 
                onClick={() => setPaymentMethod("Cash on Delivery")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "Cash on Delivery" ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-500' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Cash on Delivery / UPI at Doorstep</div>
                      <div className="text-[11px] text-slate-500">Pay cash or scan QR when delivery partner arrives</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={() => setPaymentMethod("Cash on Delivery")}
                    className="accent-brand-600"
                  />
                </div>
              </div>

              {/* WhatsApp Order Integration Checkbox */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <input
                  type="checkbox"
                  id="whatsappToggle"
                  checked={sendViaWhatsApp}
                  onChange={(e) => setSendViaWhatsApp(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <label htmlFor="whatsappToggle" className="cursor-pointer text-xs">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Send Order Details & Live Tracking to WhatsApp</span>
                  </span>
                  <p className="text-emerald-700 mt-0.5 leading-relaxed text-[11px]">
                    Automatically opens WhatsApp with your pre-formatted order invoice, delivery address, items breakdown, and delivery OTP for direct order dispatch.
                  </p>
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Order Summary & Place Order Button */}
        <div className="space-y-4 lg:sticky lg:top-28">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-semibold text-slate-500">{cart.length} items</span>
            </h3>

            {/* Delivering to preview */}
            {selectedAddress && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-fresh-600" />
                  <span>Delivering to {selectedAddress.type}:</span>
                </div>
                <div className="text-slate-600 truncate mt-0.5 font-medium">
                  {selectedAddress.house}, {selectedAddress.street}
                </div>
              </div>
            )}

            {/* Micro items list */}
            <div className="max-h-44 overflow-y-auto space-y-2 pr-1 no-scrollbar text-xs">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between gap-2">
                  <div className="truncate flex-1">
                    <span className="font-semibold text-slate-800">{product.name}</span>
                    <span className="text-slate-400 text-[11px] block">{product.unit} × {quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">₹{product.price * quantity}</span>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>MRP Total</span>
                <span>₹{cartMrpTotal}</span>
              </div>
              {cartSavings > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Product Savings</span>
                  <span>-₹{cartSavings}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline text-sm font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-lg text-slate-950 font-black">₹{cartTotal}</span>
              </div>
            </div>

            {/* Guarantee Note */}
            <div className="p-3 bg-fresh-50 rounded-2xl text-[11px] text-fresh-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-fresh-600 shrink-0" />
              <span>Contactless delivery • 100% Quality Assurance</span>
            </div>

            {/* Big Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting || !selectedAddress}
              className={`w-full py-4 px-6 text-white rounded-2xl font-black text-sm shadow-xl transition-all transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 ${
                sendViaWhatsApp
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-fresh-600 to-fresh-500 hover:from-fresh-700 hover:to-fresh-600 shadow-fresh-500/25'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : sendViaWhatsApp ? (
                <>
                  <MessageCircle className="w-5 h-5" />
                  <span>Order & Send on WhatsApp • ₹{cartTotal}</span>
                </>
              ) : (
                <>
                  <span>Place Order • ₹{cartTotal}</span>
                  <Zap className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        initialData={editingAddressData}
      />
    </div>
  );
};
