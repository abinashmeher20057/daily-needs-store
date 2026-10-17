import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';

export const WishlistView = () => {
  const { wishlist, products, addToCart, showToast, setActiveView } = useStore();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleMoveAllToCart = () => {
    wishlistedProducts.forEach(product => {
      addToCart(product, 1);
    });
    showToast(`Added ${wishlistedProducts.length} items to your basket!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('home')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>My Wishlist</span>
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </h1>
            <p className="text-xs text-slate-500 font-medium">Items you saved for quick repurchasing</p>
          </div>
        </div>

        {wishlistedProducts.length > 0 && (
          <button
            onClick={handleMoveAllToCart}
            className="px-5 py-2.5 bg-fresh-600 hover:bg-fresh-700 text-white rounded-xl text-xs font-bold shadow-md shadow-fresh-600/20 flex items-center gap-1.5 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Move All to Basket</span>
          </button>
        )}
      </div>

      {/* Grid or Empty */}
      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center text-3xl">
            ❤️
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Your wishlist is empty</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Save your favourite staples, snacks, and personal care products by clicking the heart icon.
            </p>
          </div>
          <button
            onClick={() => setActiveView('home')}
            className="px-6 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
