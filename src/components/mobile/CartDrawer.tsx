import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const freeShippingThreshold = 75;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 8;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full h-full bg-white flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="h-12 border-b border-neutral-200 px-4 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-neutral-900" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900">
              Shopping Bag ({items.reduce((sum, i) => sum + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-[#FAF9F6] px-5 py-2.5 border-b border-neutral-200">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-700">
            <span>
              {remainingForFreeShipping === 0
                ? 'Free Shipping Unlocked!'
                : `Add $${remainingForFreeShipping.toFixed(2)} more for Free Shipping`}
            </span>
            <span>{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-200 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-neutral-900 rounded-full transition-all duration-300"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-24 text-center flex flex-col items-center">
              <ShoppingBag className="w-10 h-10 text-neutral-300 mb-2" />
              <p className="text-xs font-bold text-neutral-800">Your bag is currently empty</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Explore our signature cuts to fill your bag.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-lg uppercase"
              >
                Shop Now
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-20 rounded-lg object-cover bg-neutral-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-neutral-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-neutral-400 hover:text-red-500 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      Size: {item.variant.size} • {item.variant.colorName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-neutral-200 rounded-md">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 text-neutral-600 hover:bg-neutral-100 rounded-l-md"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-neutral-600 hover:bg-neutral-100 rounded-r-md"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-neutral-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sticky Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-neutral-200 bg-white space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span className="font-semibold text-neutral-900">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-1.5 border-t border-neutral-100">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 bg-neutral-900 text-white font-extrabold text-xs tracking-widest rounded-xl uppercase flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
