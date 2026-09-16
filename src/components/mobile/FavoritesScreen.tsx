import React from 'react';
import { Heart, Sparkles, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';

interface FavoritesScreenProps {
  favoriteProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenTryOn: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  onNavigateTab: (tab: 'home' | 'shop' | 'try-on' | 'favorites' | 'profile') => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  favoriteProducts,
  onSelectProduct,
  onOpenTryOn,
  onToggleFavorite,
  onNavigateTab,
}) => {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-5 py-3 z-30 flex items-center justify-between">
        <h1 className="text-sm font-extrabold tracking-widest uppercase text-neutral-900">
          Saved Wishlist
        </h1>
        <span className="text-[11px] font-semibold text-neutral-400">
          {favoriteProducts.length} items
        </span>
      </div>

      <div className="p-5">
        {favoriteProducts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-800">Your Wishlist is Empty</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-[220px]">
              Tap the heart icon on any T-shirt to save colorways and cuts for later.
            </p>
            <button
              onClick={() => onNavigateTab('shop')}
              className="mt-5 px-5 py-2.5 bg-neutral-900 text-white text-xs font-bold rounded-lg uppercase tracking-wider"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    onClick={() => onSelectProduct(product)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => onToggleFavorite(product.id)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500 shadow-sm"
                  >
                    <Heart className="w-4 h-4 fill-red-500" />
                  </button>

                  <button
                    onClick={() => onOpenTryOn(product)}
                    className="absolute bottom-2.5 left-2.5 px-2 py-1 rounded bg-neutral-900/85 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider flex items-center gap-1 hover:bg-black transition-colors"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-[#D4A373]" />
                    TRY ON
                  </button>
                </div>

                <div
                  onClick={() => onSelectProduct(product)}
                  className="mt-2.5 flex flex-col"
                >
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h4 className="text-xs font-semibold text-neutral-900 truncate mt-0.5">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-neutral-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
