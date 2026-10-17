import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { 
  ArrowLeft, Star, Heart, Plus, Minus, ShoppingCart, 
  Zap, ShieldCheck, RefreshCw, Truck, CheckCircle2, Share2 
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { 
    selectedProduct, 
    setActiveView, 
    addToCart, 
    updateQuantity, 
    getItemQuantityInCart, 
    toggleWishlist, 
    isInWishlist, 
    products, 
    deliveryLocation,
    setIsCartDrawerOpen,
    showToast
  } = useStore();

  const [packQuantity, setPackQuantity] = useState(1);

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">No product selected</h2>
        <button
          onClick={() => setActiveView('home')}
          className="mt-4 px-6 py-2 bg-brand-500 text-white rounded-xl font-bold text-sm"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const quantityInCart = getItemQuantityInCart(selectedProduct.id);
  const isWishlisted = isInWishlist(selectedProduct.id);
  const discountPercent = Math.round(((selectedProduct.mrp - selectedProduct.price) / selectedProduct.mrp) * 100);

  // Frequently bought together / related items from same category
  const relatedProducts = products
    .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    .slice(0, 4);

  const handleBuyNow = () => {
    if (quantityInCart === 0) {
      addToCart(selectedProduct, packQuantity);
    }
    setActiveView('checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedProduct.name,
        text: `Check out ${selectedProduct.name} on Daily Needs Store!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!", "info");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('home')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Main PDP Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
          
          {/* Left: Product Image & Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                  {discountPercent}% OFF
                </div>
              )}

              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isWishlisted 
                    ? 'bg-rose-50 text-rose-500 shadow-sm' 
                    : 'bg-white/80 hover:bg-white text-slate-400 hover:text-slate-600 shadow-xs'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Quick feature icons under image */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-600 pt-2">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <Truck className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                <span className="font-semibold text-slate-800">12 Mins</span>
                <p className="text-[10px] text-slate-600">Express Delivery</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="font-semibold text-slate-800">100% Genuine</span>
                <p className="text-[10px] text-slate-600">Brand Certified</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <RefreshCw className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="font-semibold text-slate-800">Easy Return</span>
                <p className="text-[10px] text-slate-600">At Doorstep</p>
              </div>
            </div>
          </div>

          {/* Right: Product Meta & Purchase */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Stock Pill */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-lg uppercase tracking-wide">
                  {selectedProduct.category}
                </span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                  {selectedProduct.unit}
                </span>
                {selectedProduct.stock > 0 ? (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({selectedProduct.stock} units)
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-rose-600">Out of Stock</span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {selectedProduct.name}
              </h1>

              {/* Rating & Review */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-xs font-black shadow-xs">
                  <span>{selectedProduct.rating}</span>
                  <Star className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className="text-xs text-slate-600 font-semibold">
                  {selectedProduct.reviewsCount.toLocaleString()} Verified Customer Ratings & 320+ Reviews
                </span>
              </div>

              {/* Price Details */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900">
                    ₹{selectedProduct.price}
                  </span>
                  {selectedProduct.mrp > selectedProduct.price && (
                    <span className="text-base text-slate-600 line-through">
                      MRP ₹{selectedProduct.mrp}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Save ₹{selectedProduct.mrp - selectedProduct.price} ({discountPercent}% OFF)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600">Inclusive of all applicable taxes</p>
              </div>

              {/* Delivery ETA Alert */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-fresh-50 border border-fresh-200/80 text-fresh-900 text-xs">
                <div className="w-8 h-8 rounded-full bg-fresh-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    Express 12-Minute Delivery to {deliveryLocation.area}
                  </div>
                  <div className="text-slate-600">
                    Order right now and get it delivered at your doorstep swiftly.
                  </div>
                </div>
              </div>

              {/* Product Key Features / Highlights */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Key Highlights</h3>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {selectedProduct.features?.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                    <span>Hygienically sorted, sealed & stored in temperature-controlled chambers</span>
                  </li>
                </ul>
              </div>

              {/* Description */}
              <div className="space-y-1 pt-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Product Description</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                {quantityInCart === 0 ? (
                  <button
                    onClick={() => addToCart(selectedProduct, packQuantity)}
                    className="flex-1 flex items-center justify-center gap-2 bg-fresh-600 hover:bg-fresh-700 text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-fresh-600/25 transition-all transform active:scale-98"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Basket</span>
                  </button>
                ) : (
                  <div className="flex-1 flex items-center justify-between bg-fresh-50 border border-fresh-200 rounded-2xl p-2 px-4">
                    <span className="text-xs font-bold text-fresh-900">
                      In Basket: {quantityInCart} ({selectedProduct.unit})
                    </span>
                    <div className="flex items-center bg-fresh-600 text-white rounded-xl shadow-xs overflow-hidden text-xs font-bold">
                      <button
                        onClick={() => updateQuantity(selectedProduct.id, quantityInCart - 1)}
                        className="px-3 py-1.5 hover:bg-fresh-700"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-extrabold">{quantityInCart}</span>
                      <button
                        onClick={() => updateQuantity(selectedProduct.id, quantityInCart + 1)}
                        className="px-3 py-1.5 hover:bg-fresh-700"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md transition-all transform active:scale-98 text-center"
                >
                  Buy Now Instantly
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Frequently Bought Together / Related items */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Frequently Bought Together</h2>
              <p className="text-xs text-slate-600">Customers who bought this item also purchased</p>
            </div>
            <button
              onClick={() => setActiveView('products')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              View More in {selectedProduct.category} →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedProducts.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
