import React, { useState } from 'react';
import {
  X,
  Heart,
  Sparkles,
  ShoppingBag,
  Star,
  ShieldCheck,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Product } from '../../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onOpenTryOn: (product: Product) => void;
  onAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL', colorName: string) => void;
  isFavorited: boolean;
  onToggleFavorite: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenTryOn,
  onAddToCart,
  isFavorited,
  onToggleFavorite,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'>('M');
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants[0]?.colorName || 'Pitch Black'
  );
  const [addedToast, setAddedToast] = useState(false);

  const uniqueColors = Array.from(
    new Set(product.variants.map((v) => JSON.stringify({ name: v.colorName, hex: v.colorHex })))
  ).map((s: string) => JSON.parse(s));

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].filter((s) =>
    product.variants.some((v) => v.size === s)
  ) as ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
      {/* Top Navbar */}
      <div className="h-12 border-b border-neutral-200 px-4 flex items-center justify-between bg-white/95 backdrop-blur-md z-10">
        <button
          onClick={onClose}
          className="p-1.5 text-neutral-700 hover:text-black rounded-full hover:bg-neutral-100"
        >
          <X className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-neutral-900 uppercase tracking-widest truncate max-w-[200px]">
          {product.name}
        </span>
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="p-1.5 text-neutral-700 hover:text-black rounded-full hover:bg-neutral-100"
        >
          <Heart
            className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
          />
        </button>
      </div>

      {/* Body Scroll */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
        {/* Main Image View */}
        <div className="relative aspect-[3/4] w-full bg-neutral-100">
          <img
            src={product.images[selectedImageIndex] || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-full">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    selectedImageIndex === idx ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-5 space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-[#8A5D2C]">
                <Star className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
                <span className="text-xs font-bold">4.9 (42)</span>
              </div>
            </div>
            <h1 className="text-xl font-extrabold text-neutral-900 mt-1">
              {product.name}
            </h1>
            <p className="text-xs text-neutral-500 mt-1 italic">
              "{product.tagline}"
            </p>

            <div className="flex items-center gap-3 mt-3">
              <span className="text-xl font-black text-neutral-900">
                ${product.price.toFixed(2)}
              </span>
              {product.discountPrice && (
                <span className="text-sm font-medium text-neutral-400 line-through">
                  ${product.discountPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Virtual Try-On Banner */}
          <div
            onClick={() => {
              onOpenTryOn(product);
            }}
            className="p-3.5 rounded-xl bg-gradient-to-br from-[#F5F2EC] to-[#ECE7DD] border border-[#DDD5C5] cursor-pointer flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[#8A5D2C] text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#D4A373]" />
                Virtual Fitting Room
              </div>
              <p className="text-xs font-bold text-neutral-900 mt-0.5">
                See this T-shirt on yourself
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              Try It On
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Colorways */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Color: {selectedColor}
            </span>
            <div className="flex flex-wrap gap-2">
              {uniqueColors.map((col: any) => {
                const isSelected = selectedColor === col.name;
                return (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="text-neutral-900">{col.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Size
              </span>
              <span className="text-[11px] text-neutral-400 underline cursor-pointer">
                Size Guide
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                    selectedSize === sz
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                      : 'border-neutral-200 text-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Description & Fabric Specs */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Craft & Fabric
            </span>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {product.description}
            </p>
            <div className="bg-[#FAF9F6] p-3 rounded-lg text-[11px] text-neutral-700 font-medium">
              {product.fabricDetails}
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Verified Reviews ({product.reviews.length})
              </span>
            </div>
            <div className="space-y-2">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-white rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-900">{rev.author}</span>
                    <span className="text-[10px] text-neutral-400">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-500 my-1">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <p className="text-[11px] text-neutral-600">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-white/95 backdrop-blur-md border-t border-neutral-200 flex items-center gap-3">
        <div>
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">
            Total Price
          </span>
          <span className="text-lg font-black text-neutral-900">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleAdd}
          className="flex-1 py-3.5 px-4 bg-neutral-900 text-white font-extrabold text-xs tracking-wider rounded-xl uppercase flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-sm"
        >
          {addedToast ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              Added To Bag
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              Add To Bag
            </>
          )}
        </button>
      </div>
    </div>
  );
};
