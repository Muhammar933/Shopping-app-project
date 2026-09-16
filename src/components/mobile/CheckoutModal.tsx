import React, { useState } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderComplete,
}) => {
  if (!isOpen) return null;

  const [address, setAddress] = useState({
    name: 'Elena Rostova',
    street: '742 Evergreen Terrace',
    city: 'Portland',
    state: 'OR',
    zip: '97201',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal >= 75 ? 0 : 8;
  const total = subtotal + shipping;

  const handlePay = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));

    const orderNumber = `TH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      date: 'Just now',
      items: [...items],
      subtotal,
      shipping,
      total,
      status: 'CONFIRMED',
      trackingNumber: `1Z${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`,
    };

    setConfirmedOrder(newOrder);
    onOrderComplete(newOrder);
    setIsProcessing(false);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom duration-200">
      {/* Header */}
      <div className="h-12 border-b border-neutral-200 px-4 flex items-center justify-between bg-white z-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900">
          {confirmedOrder ? 'Order Confirmation' : 'Express Checkout'}
        </h2>
        <button
          onClick={onClose}
          className="p-1 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {confirmedOrder ? (
        /* Order Confirmed Screen */
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 mb-4 animate-in zoom-in-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase">
            THREADLY ATELIER
          </span>
          <h1 className="text-2xl font-black text-neutral-900 mt-1">
            Order Confirmed
          </h1>
          <p className="text-xs font-semibold text-neutral-700 mt-1">
            Order #{confirmedOrder.orderNumber}
          </p>

          <p className="text-xs text-neutral-500 mt-3 max-w-[260px] leading-relaxed">
            We are preparing your pieces for shipment with our signature eco-packaging.
          </p>

          <div className="w-full bg-neutral-50 rounded-xl p-4 my-6 text-left border border-neutral-200 space-y-2 text-xs">
            <div className="flex justify-between font-medium text-neutral-600">
              <span>Items Total</span>
              <span className="text-neutral-900 font-bold">
                ${confirmedOrder.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-medium text-neutral-600">
              <span>Shipping</span>
              <span className="text-neutral-900 font-bold">
                {confirmedOrder.shipping === 0 ? 'FREE' : `$${confirmedOrder.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
              <span>Total Paid</span>
              <span>${confirmedOrder.total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-neutral-900 text-white font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-black transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        /* Checkout Form */
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
              <Truck className="w-4 h-4 text-neutral-700" />
              Delivery Address
            </div>
            <div className="space-y-2 text-xs">
              <input
                type="text"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
              />
              <input
                type="text"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="Street Address"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="City"
                  className="px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="State"
                  className="px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  placeholder="ZIP"
                  className="px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">
              Payment Method
            </span>
            <div className="space-y-2">
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                    : 'border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-neutral-800" />
                  <span className="text-xs font-semibold text-neutral-900">
                    Threadly Mock Pay (•••• 4242)
                  </span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300'
                  }`}
                >
                  {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('apple')}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'apple'
                    ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                    : 'border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-neutral-900"> Apple Pay</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'apple' ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300'
                  }`}
                >
                  {paymentMethod === 'apple' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee badge */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-green-700 bg-green-50/80 p-2.5 rounded-lg border border-green-200">
            <ShieldCheck className="w-4 h-4" />
            <span>30-Day Free Returns & Exchanges Guaranteed</span>
          </div>

          {/* Sticky Pay Button */}
          <div className="pt-2">
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3.5 bg-neutral-900 text-white font-extrabold text-xs tracking-widest rounded-xl uppercase flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-sm disabled:opacity-50"
            >
              {isProcessing ? 'AUTHORIZING TRANSACTION...' : `CONFIRM & PAY • $${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
