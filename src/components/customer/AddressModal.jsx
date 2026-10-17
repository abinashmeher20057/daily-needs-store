import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, MapPin, Home, Building2, Navigation, Check } from 'lucide-react';

export const AddressModal = ({ isOpen, onClose, initialData = null }) => {
  const { addAddress, updateAddress, deliveryLocation } = useStore();

  const [formData, setFormData] = useState(() => {
    if (initialData) return initialData;
    return {
      type: 'Home',
      name: 'Meher Abinash',
      phone: '+91 98765 43210',
      house: '',
      street: '',
      landmark: '',
      city: deliveryLocation.city || 'Bhubaneswar',
      pincode: deliveryLocation.pincode || '751024',
      isDefault: true
    };
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialData && initialData.id) {
      updateAddress(initialData.id, formData);
    } else {
      addAddress(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {initialData ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h2>
              <p className="text-xs text-slate-500">Fast 12-minute delivery to your doorstep</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Address Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          
          {/* Address Tag Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Address Type / Label</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Home', icon: Home, label: 'Home' },
                { id: 'Work', icon: Building2, label: 'Work / Office' },
                { id: 'Other', icon: Navigation, label: 'Other' },
              ].map(item => {
                const Icon = item.icon;
                const isSelected = formData.type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: item.id })}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Receiver Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Meher Abinash"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number (for Delivery OTP)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              />
            </div>
          </div>

          {/* House / Flat details */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Flat / House No. / Building / Society</label>
            <input
              type="text"
              value={formData.house}
              onChange={(e) => setFormData({ ...formData, house: e.target.value })}
              placeholder="e.g. Flat 402, Block B, Royal Palms Residency"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
            />
          </div>

          {/* Street & Area */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Street / Area / Colony</label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              placeholder="e.g. Infocity Road, Patia"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
            />
          </div>

          {/* Landmark */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nearby Landmark (Optional)</label>
            <input
              type="text"
              value={formData.landmark}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              placeholder="e.g. Near KIIT Square, Behind Big Bazaar"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
            />
          </div>

          {/* City & Pincode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              />
            </div>
          </div>

          {/* Set as default toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              <span>Set as default delivery address</span>
            </label>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-fresh-600 hover:bg-fresh-700 text-white font-bold rounded-xl shadow-md shadow-fresh-600/20 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save & Use Address</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
