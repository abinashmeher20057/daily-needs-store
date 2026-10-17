import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, Heart, Plus, Minus, Check, Zap } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    addToCart, 
    updateQuantity, 
    getItemQuantityInCart, 
    toggleWishlist, 
    isInWishlist,
    viewProductDetails 
  } = useStore();

  const quantity = getItemQuantityInCart(product.id);
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top badges & Wishlist */}
      <div className="relative w-full aspect-square bg-slate-50 rounded-xl overflow-hidden mb-3">
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
            {discountPercent}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-500 shadow-sm' 
              : 'bg-white/80 hover:bg-white text-slate-400 hover:text-slate-600 shadow-xs'
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Product Image */}
        <div 
          onClick={() => viewProductDetails(product)}
          className="w-full h-full cursor-pointer overflow-hidden flex items-center justify-center"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Low Stock Warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 z-10 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
            Only {product.stock} left!
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Unit & ETA */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-700">
              {product.unit}
            </span>
            <span className="inline-flex items-center gap-0.5 text-fresh-600 font-semibold">
              <Zap className="w-3 h-3" /> 12 MINS
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => viewProductDetails(product)}
            className="font-bold text-slate-900 text-sm line-clamp-2 cursor-pointer hover:text-brand-600 transition-colors leading-snug mb-1"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded text-[11px] font-bold">
              <span>{product.rating}</span>
              <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-[11px] text-slate-500">
              ({product.reviewsCount.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                ₹{product.price}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.mrp}
                </span>
              )}
            </div>
          </div>

          {/* Add / Stepper Button */}
          {quantity === 0 ? (
            <button
              onClick={() => addToCart(product, 1)}
              className="bg-fresh-50 hover:bg-fresh-600 text-fresh-700 hover:text-white border border-fresh-500/50 hover:border-fresh-600 font-bold text-xs uppercase px-3.5 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD</span>
            </button>
          ) : (
            <div className="flex items-center bg-fresh-600 text-white rounded-xl shadow-sm overflow-hidden text-xs font-bold">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="px-2.5 py-1.5 hover:bg-fresh-700 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 py-1 min-w-[24px] text-center font-extrabold text-xs">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="px-2.5 py-1.5 hover:bg-fresh-700 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
