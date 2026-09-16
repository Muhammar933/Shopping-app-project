import { create } from 'zustand';
import { Cart } from '../types';
import { cartService } from '../services/cartService';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearLocalCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await cartService.getCart();
      set({ cart, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, variantId, quantity = 1) => {
    set({ isLoading: true });
    try {
      const cart = await cartService.addItem(productId, variantId, quantity);
      set({ cart, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ isLoading: true });
    try {
      const cart = await cartService.updateQuantity(itemId, quantity);
      set({ cart, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true });
    try {
      const cart = await cartService.removeItem(itemId);
      set({ cart, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  clearLocalCart: () => {
    set({ cart: null });
  },
}));
