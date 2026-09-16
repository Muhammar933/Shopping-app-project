import { create } from 'zustand';
import { Product } from '../types';
import { apiClient } from '../services/api';

interface FavoriteState {
  favorites: Product[];
  favoriteIds: Set<string>;
  isLoading: boolean;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (product: Product) => Promise<void>;
  isFavorited: (productId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],
  favoriteIds: new Set<string>(),
  isLoading: false,

  fetchFavorites: async () => {
    set({ isLoading: true });
    try {
      const res: any = await apiClient.get('/favorites');
      const favorites: Product[] = res.data || [];
      const favoriteIds = new Set(favorites.map((p) => p.id));
      set({ favorites, favoriteIds, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (product: Product) => {
    const { favoriteIds, favorites } = get();
    const isFav = favoriteIds.has(product.id);

    // Optimistic UI update
    const nextIds = new Set(favoriteIds);
    let nextList = [...favorites];

    if (isFav) {
      nextIds.delete(product.id);
      nextList = nextList.filter((p) => p.id !== product.id);
    } else {
      nextIds.add(product.id);
      nextList.unshift(product);
    }

    set({ favoriteIds: nextIds, favorites: nextList });

    try {
      if (isFav) {
        await apiClient.delete(`/favorites/${product.id}`);
      } else {
        await apiClient.post(`/favorites/${product.id}`);
      }
    } catch {
      // Revert on error
      set({ favoriteIds, favorites });
    }
  },

  isFavorited: (productId: string) => {
    return get().favoriteIds.has(productId);
  },
}));
