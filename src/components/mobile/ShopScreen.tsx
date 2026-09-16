import React, { useState } from 'react';
import { Search, SlidersHorizontal, Sparkles, Heart, X, RotateCw } from 'lucide-react';
import { Product } from '../../types';
import { CATEGORIES } from '../../data/mockData';

interface ShopScreenProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenTryOn: (product?: Product) => void;
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  isLoading?: boolean;
}

const ProductCardSkeleton: React.FC = () => (
  <div className="flex flex-col select-none">
    {/* Image Container with sweeping shimmer */}
    <div className="relative aspect-[3/4] bg-neutral-200 rounded-xl overflow-hidden">
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
      {/* Top right wishlist heart placeholder */}
      <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/70 backdrop-blur-xs" />
      {/* Bottom left try-on badge placeholder */}
      <div className="absolute bottom-2.5 left-2.5 w-16 h-5 rounded bg-neutral-800/20 backdrop-blur-xs" />
    </div>

    {/* Info Placeholder */}
    <div className="mt-2.5 flex flex-col space-y-1.5">
      <div className="h-2.5 bg-neutral-200 rounded-sm w-1/3 overflow-hidden relative">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
      </div>
      <div className="h-3 bg-neutral-200 rounded-sm w-4/5 overflow-hidden relative">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
      </div>
      <div className="flex items-center gap-2 mt-0.5">
        <div className="h-3 bg-neutral-200 rounded-sm w-1/4 overflow-hidden relative">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
        </div>
        <div className="h-2.5 bg-neutral-200 rounded-sm w-1/5 overflow-hidden relative">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  </div>
);

export const ShopScreen: React.FC<ShopScreenProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onOpenTryOn,
  favorites,
  onToggleFavorite,
  isLoading: propLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelectCategory = (cat: string) => {
    setIsTransitioning(true);
    onSelectCategory(cat);
    setTimeout(() => setIsTransitioning(false), 380);
  };

  const handleSortChange = (newSort: any) => {
    setIsTransitioning(true);
    setSortBy(newSort);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleSimulateRefresh = () => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 450);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.categorySlug === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const showLoading = propLoading || isTransitioning;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
      {/* Header & Search Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-5 pt-3 pb-3 z-30 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-extrabold tracking-widest uppercase text-neutral-900">
            Catalog & Essentials
          </h1>
          <span className="text-[11px] font-semibold text-neutral-400">
            {sortedProducts.length} pieces
          </span>
        </div>

        {/* Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search heavyweight, wash, pocket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-9 bg-neutral-100 rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 border border-transparent focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Carousel */}
      <div className="bg-white border-b border-neutral-100 px-5 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleSelectCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          All Cuts
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelectCategory(cat.slug)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat.slug
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="px-5 py-2.5 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="font-medium">Filter & Sort</span>
          <button
            onClick={handleSimulateRefresh}
            title="Preview skeleton loading shimmer"
            className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <RotateCw className={`w-3 h-3 ${isTransitioning ? 'animate-spin text-neutral-800' : ''}`} />
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-700" />
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as any)}
            className="bg-transparent text-neutral-900 font-bold text-xs focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="newest">New Releases</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-5 mt-2">
        {showLoading ? (
          <div className="grid grid-cols-2 gap-3.5">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-bold text-neutral-800">No designs match your criteria</p>
            <p className="text-xs text-neutral-400 mt-1">Try relaxing filters or search terms</p>
            <button
              onClick={() => {
                setSearchQuery('');
                handleSelectCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {sortedProducts.map((product) => {
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
                    {product.isNew && (
                      <span className="absolute top-2.5 left-2.5 px-1.5 py-0.5 rounded bg-neutral-900 text-white text-[9px] font-black tracking-wider uppercase">
                        NEW
                      </span>
                    )}
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
        )}
      </div>
    </div>
  );
};
