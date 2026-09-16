import React from 'react';
import { Sparkles, ArrowRight, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../../types';
import { CATEGORIES } from '../../data/mockData';

interface HomeScreenProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenTryOn: (product?: Product) => void;
  onNavigateTab: (tab: 'home' | 'shop' | 'try-on' | 'favorites' | 'profile') => void;
  onSelectCategory: (categorySlug: string) => void;
  onOpenCart: () => void;
  cartCount: number;
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  onSelectProduct,
  onOpenTryOn,
  onNavigateTab,
  onSelectCategory,
  onOpenCart,
  cartCount,
  favorites,
  onToggleFavorite,
}) => {
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
      {/* Brand Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-5 py-3 flex items-center justify-between z-30">
        <div>
          <h1 className="text-lg font-extrabold tracking-[0.2em] text-neutral-900 leading-none">
            THREADLY
          </h1>
          <p className="text-[9px] font-medium tracking-[0.15em] text-neutral-400 uppercase mt-0.5">
            Wear Your Style
          </p>
        </div>
        <button
          onClick={onOpenCart}
          className="relative p-2 text-neutral-800 hover:text-black transition-colors"
          aria-label="Shopping Bag"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden bg-neutral-900">
        <img
          src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=85"
          alt="Threadly Hero"
          className="w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3 h-3 text-[#D4A373]" />
            Fall/Winter 2026
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
            WEAR YOUR STYLE.
          </h2>
          <p className="text-xs text-neutral-300 mt-2 max-w-[85%] leading-relaxed">
            Architectural 300GSM heavyweights and mineral washes engineered for enduring drape.
          </p>

          <div className="flex items-center gap-3 w-full mt-5">
            <button
              onClick={() => onNavigateTab('shop')}
              className="flex-1 py-3 px-4 bg-white text-neutral-900 font-bold text-xs tracking-wider rounded-md text-center hover:bg-neutral-100 transition-colors uppercase"
            >
              Shop Collection
            </button>
            <button
              onClick={() => onOpenTryOn()}
              className="flex-1 py-3 px-4 bg-transparent border border-white/80 text-white font-bold text-xs tracking-wider rounded-md text-center flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors uppercase"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              Try It On
            </button>
          </div>
        </div>
      </div>

      {/* AI Virtual Try-On Interactive Banner */}
      <div className="px-5 mt-6">
        <div
          onClick={() => onOpenTryOn()}
          className="p-5 rounded-2xl bg-gradient-to-br from-[#F5F2EC] to-[#ECE7DD] border border-[#DDD5C5] cursor-pointer hover:shadow-md transition-all relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-[#8A5D2C] text-[10px] font-extrabold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              AI Virtual Fitting Room
            </div>
            <h3 className="text-lg font-extrabold text-neutral-900 mt-1">
              See How It Fits You
            </h3>
            <p className="text-xs text-neutral-600 mt-1 max-w-[80%] leading-relaxed">
              Snap a quick photo or pick a model to preview any Threadly T-shirt on your silhouette before buying.
            </p>
            <div className="flex items-center gap-1 text-neutral-900 text-xs font-bold mt-3 tracking-wide">
              <span>LAUNCH FITTING ROOM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-[#D4A373]/15 rounded-full blur-xl pointer-events-none" />
        </div>
      </div>

      {/* Categories Horizontal Carousel */}
      <div className="mt-8">
        <div className="px-5 flex items-center justify-between mb-3">
          <h3 className="text-xs font-black tracking-widest text-neutral-900 uppercase">
            Curated Categories
          </h3>
          <button
            onClick={() => onNavigateTab('shop')}
            className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900"
          >
            All Categories
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.slug);
                onNavigateTab('shop');
              }}
              className="relative w-36 h-48 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer group shadow-sm"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <span className="text-[9px] font-semibold text-neutral-300 uppercase tracking-wider block">
                  {cat.count} Cuts
                </span>
                <span className="text-xs font-bold leading-tight block mt-0.5">
                  {cat.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Sellers Grid */}
      <div className="mt-8 px-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-black tracking-widest text-neutral-900 uppercase">
              Signature Best Sellers
            </h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Tested over 50+ wash cycles for longevity
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('shop')}
            className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {bestSellers.map((product) => {
            const isFav = favorites.includes(product.id);
            return (
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
                  {/* Heart Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(product.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-800 shadow-sm hover:scale-110 transition-transform"
                    aria-label="Toggle Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'fill-red-500 text-red-500' : 'text-neutral-700'
                      }`}
                    />
                  </button>

                  {/* Try-On Button Badge */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTryOn(product);
                    }}
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
                    {product.discountPrice && (
                      <span className="text-[10px] text-neutral-400 line-through">
                        ${product.discountPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Collection Grid */}
      <div className="mt-8 px-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-black tracking-widest text-neutral-900 uppercase">
              New Releases
            </h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Wakayama Supima & Tokyo Studio graphics
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('shop')}
            className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {newArrivals.map((product) => {
            const isFav = favorites.includes(product.id);
            return (
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
                  <span className="absolute top-2.5 left-2.5 px-1.5 py-0.5 rounded bg-neutral-900 text-white text-[9px] font-black tracking-wider uppercase">
                    NEW
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(product.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-800 shadow-sm hover:scale-110 transition-transform"
                    aria-label="Toggle Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'fill-red-500 text-red-500' : 'text-neutral-700'
                      }`}
                    />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTryOn(product);
                    }}
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
            );
          })}
        </div>
      </div>
    </div>
  );
};
