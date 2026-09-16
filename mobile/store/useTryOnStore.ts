import { create } from 'zustand';
import { TryOnSession, Product } from '../types';
import { tryOnService } from '../services/tryOnService';

interface TryOnState {
  activeSession: TryOnSession | null;
  selectedProduct: Product | null;
  capturedImageUri: string | null;
  isProcessing: boolean;
  error: string | null;
  setSelectedProduct: (product: Product | null) => void;
  setCapturedImageUri: (uri: string | null) => void;
  startTryOn: (productId: string, imageUri: string) => Promise<TryOnSession>;
  pollSession: (sessionId: string) => Promise<TryOnSession>;
  resetTryOn: () => void;
}

export const useTryOnStore = create<TryOnState>((set, get) => ({
  activeSession: null,
  selectedProduct: null,
  capturedImageUri: null,
  isProcessing: false,
  error: null,

  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setCapturedImageUri: (uri) => set({ capturedImageUri: uri }),

  startTryOn: async (productId, imageUri) => {
    set({ isProcessing: true, error: null });
    try {
      const session = await tryOnService.submitTryOn(productId, imageUri);
      set({ activeSession: session, isProcessing: true });
      return session;
    } catch (err: any) {
      set({ isProcessing: false, error: err.message || 'Failed to start try-on session' });
      throw err;
    }
  },

  pollSession: async (sessionId: string) => {
    try {
      const session = await tryOnService.getSessionStatus(sessionId);
      const isStillProcessing = session.status === 'PENDING' || session.status === 'PROCESSING';
      set({ activeSession: session, isProcessing: isStillProcessing });
      return session;
    } catch (err: any) {
      set({ isProcessing: false, error: err.message });
      throw err;
    }
  },

  resetTryOn: () => {
    set({
      activeSession: null,
      selectedProduct: null,
      capturedImageUri: null,
      isProcessing: false,
      error: null,
    });
  },
}));
