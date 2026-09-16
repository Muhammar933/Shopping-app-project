import React, { useState } from 'react';
import {
  Home,
  Compass,
  Sparkles,
  Heart,
  User,
  ShoppingBag,
  Code2,
  ExternalLink,
  Laptop,
  Smartphone,
} from 'lucide-react';
import { Product, CartItem, UserProfile, Order } from './types';
import { PRODUCTS, PRESET_USERS, INITIAL_ORDERS } from './data/mockData';
import { MobileShell } from './components/mobile/MobileShell';
import { HomeScreen } from './components/mobile/HomeScreen';
import { ShopScreen } from './components/mobile/ShopScreen';
import { TryOnScreen } from './components/mobile/TryOnScreen';
import { FavoritesScreen } from './components/mobile/FavoritesScreen';
import { ProfileScreen } from './components/mobile/ProfileScreen';
import { ProductDetailModal } from './components/mobile/ProductDetailModal';
import { CartDrawer } from './components/mobile/CartDrawer';
import { CheckoutModal } from './components/mobile/CheckoutModal';
import { DevDocsModal } from './components/DevDocsModal';

export default function App() {
  // Mobile Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'try-on' | 'favorites' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Selected Product for Detail Modal
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Selected Product for Virtual Try-On
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(PRODUCTS[0]);

  // Wishlist / Favorites State
  const [favorites, setFavorites] = useState<string[]>(['prod-01', 'prod-03']);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-1',
      product: PRODUCTS[0],
      variant: PRODUCTS[0].variants[1],
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Active User Profile & Orders
  const [currentUser, setCurrentUser] = useState<UserProfile>(PRESET_USERS[0]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Dev Architecture Modal State
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // Handlers
  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (
    product: Product,
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL',
    colorName: string
  ) => {
    const variant =
      product.variants.find((v) => v.size === size && v.colorName === colorName) ||
      product.variants[0];

    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.variant.id === variant.id
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: `ci-${Date.now()}`,
          product,
          variant,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleOrderComplete = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
  };

  const handleOpenTryOnWithProduct = (product?: Product) => {
    if (product) {
      setTryOnProduct(product);
    }
    setActiveProduct(null);
    setActiveTab('try-on');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const favoriteProducts = PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-[#EBEAE5] text-neutral-900 flex flex-col items-center justify-between p-4 sm:p-6 font-sans antialiased selection:bg-neutral-900 selection:text-white">
      {/* Top Bar / Simulator Control Ribbon */}
      <header className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-neutral-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-black text-xs tracking-tighter">
            TH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest uppercase text-neutral-900">
                THREADLY
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-bold tracking-wider uppercase border border-neutral-200">
                Live Simulator
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-medium">
              "WEAR YOUR STYLE." • React Native Expo Mobile Experience
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setIsDocsOpen(true)}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-neutral-900 text-white hover:bg-black text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Code2 className="w-4 h-4 text-[#D4A373]" />
            Architecture & API Specs
          </button>
        </div>
      </header>

      {/* Main Interactive Mobile Device Canvas */}
      <main className="w-full flex-1 flex items-center justify-center py-2 relative">
        <MobileShell activeTab={activeTab}>
          {/* Active Screen Based on Selected Tab */}
          {activeTab === 'home' && (
            <HomeScreen
              products={PRODUCTS}
              onSelectProduct={(p) => setActiveProduct(p)}
              onOpenTryOn={handleOpenTryOnWithProduct}
              onNavigateTab={setActiveTab}
              onSelectCategory={(slug) => setSelectedCategory(slug)}
              onOpenCart={() => setIsCartOpen(true)}
              cartCount={cartCount}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'shop' && (
            <ShopScreen
              products={PRODUCTS}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectProduct={(p) => setActiveProduct(p)}
              onOpenTryOn={handleOpenTryOnWithProduct}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'try-on' && (
            <TryOnScreen
              products={PRODUCTS}
              selectedProduct={tryOnProduct}
              onSelectProduct={setTryOnProduct}
              onAddToCart={(p, sz, col) => {
                handleAddToCart(p, sz, col);
                setIsCartOpen(true);
              }}
              onSaveLook={(p) => handleToggleFavorite(p.id)}
            />
          )}

          {activeTab === 'favorites' && (
            <FavoritesScreen
              favoriteProducts={favoriteProducts}
              onSelectProduct={(p) => setActiveProduct(p)}
              onOpenTryOn={handleOpenTryOnWithProduct}
              onToggleFavorite={handleToggleFavorite}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              currentUser={currentUser}
              onSwitchUser={setCurrentUser}
              orders={orders}
            />
          )}

          {/* Product Detail Modal */}
          {activeProduct && (
            <ProductDetailModal
              product={activeProduct}
              onClose={() => setActiveProduct(null)}
              onOpenTryOn={handleOpenTryOnWithProduct}
              onAddToCart={handleAddToCart}
              isFavorited={favorites.includes(activeProduct.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {/* Cart Drawer Modal */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onUpdateQuantity={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onProceedToCheckout={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
            }}
          />

          {/* Checkout Modal */}
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            items={cartItems}
            onOrderComplete={handleOrderComplete}
          />

          {/* Persistent Bottom Tab Navigation Bar */}
          <nav className="absolute inset-x-0 bottom-0 h-16 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-3 flex items-center justify-around z-40">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'home' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-tight">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'shop' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-tight">Shop</span>
            </button>

            {/* Elevated Try-On Center Button */}
            <button
              onClick={() => setActiveTab('try-on')}
              className="flex flex-col items-center group -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-all border-2 border-white">
                <Sparkles className="w-5 h-5 text-[#D4A373]" />
              </div>
              <span className="text-[10px] font-extrabold text-neutral-900 mt-0.5 tracking-tight">
                Try-On
              </span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`relative flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'favorites' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-tight">Saved</span>
              {favorites.length > 0 && (
                <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'profile' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-tight">Profile</span>
            </button>
          </nav>
        </MobileShell>
      </main>

      {/* Dev Architecture & API Explorer Modal */}
      <DevDocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      {/* Footer Info */}
      <footer className="w-full max-w-5xl text-center py-2 text-[11px] text-neutral-500 flex items-center justify-center gap-4">
        <span>THREADLY • "WEAR YOUR STYLE."</span>
        <span>•</span>
        <span>React Native + Expo Router (`/mobile`)</span>
        <span>•</span>
        <span>Express + Prisma Monolith (`/backend`)</span>
      </footer>
    </div>
  );
}
