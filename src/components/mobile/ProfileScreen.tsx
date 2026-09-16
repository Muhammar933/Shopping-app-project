import React from 'react';
import {
  Package,
  MapPin,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { UserProfile, Order } from '../../types';
import { PRESET_USERS } from '../../data/mockData';

interface ProfileScreenProps {
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
  orders: Order[];
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onSwitchUser,
  orders,
}) => {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-5 py-3 z-30 flex items-center justify-between">
        <h1 className="text-sm font-extrabold tracking-widest uppercase text-neutral-900">
          My Account
        </h1>
      </div>

      <div className="p-5 space-y-5">
        {/* User Card */}
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center gap-3.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-neutral-100"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-neutral-900 truncate">
              {currentUser.name}
            </h2>
            <p className="text-xs text-neutral-500 truncate">{currentUser.email}</p>
            {currentUser.role === 'ADMIN' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 text-[#D4A373] text-[9px] font-extrabold tracking-wider uppercase mt-1">
                <ShieldCheck className="w-3 h-3" />
                Threadly Admin
              </span>
            )}
          </div>
        </div>

        {/* Persona Switcher (Development & Testing) */}
        <div className="bg-[#F6F5F2] p-3 rounded-xl border border-neutral-200">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
            Switch Test Profile (RBAC Simulation)
          </span>
          <div className="flex gap-2">
            {PRESET_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => onSwitchUser(user)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold truncate transition-all ${
                  currentUser.id === user.id
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                {user.name.split(' ')[0]}
                {user.role === 'ADMIN' ? ' (Admin)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-900">
            Recent Orders & Shipments
          </h3>

          {orders.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-xl border border-neutral-200">
              <Package className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-neutral-800">No orders placed yet</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">Your order receipts will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 bg-white rounded-xl border border-neutral-200 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-neutral-400">{ord.date}</span>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        ord.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-800'
                          : ord.status === 'PROCESSING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {ord.status === 'DELIVERED' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {ord.status}
                    </span>
                  </div>

                  {/* Order items preview */}
                  <div className="divide-y divide-neutral-100">
                    {ord.items.map((item) => (
                      <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-9 h-9 rounded object-cover"
                          />
                          <div>
                            <p className="font-semibold text-neutral-900 truncate max-w-[180px]">
                              {item.product.name}
                            </p>
                            <p className="text-[10px] text-neutral-400">
                              Qty: {item.quantity} • {item.variant.size} • {item.variant.colorName}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-neutral-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-500">Order Total</span>
                    <span className="text-neutral-900">${ord.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Links */}
        <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden shadow-sm">
          <div className="p-3.5 flex items-center justify-between hover:bg-neutral-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-neutral-700" />
              <span className="text-xs font-semibold text-neutral-900">Shipping Addresses</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="p-3.5 flex items-center justify-between hover:bg-neutral-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-neutral-700" />
              <span className="text-xs font-semibold text-neutral-900">App Preferences</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
        </div>

        {/* Brand Footer */}
        <div className="text-center pt-4 pb-2">
          <p className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase">
            Threadly Studio • 2026
          </p>
          <p className="text-[9px] text-neutral-400 mt-0.5">
            React Native Expo Client & Modular Monolith
          </p>
        </div>
      </div>
    </div>
  );
};
