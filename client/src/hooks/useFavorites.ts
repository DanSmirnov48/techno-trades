import { Product } from '@/types/index';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type FavoriteItem = {
  product: Product;
};

type FavoriteState = {
  favorites: FavoriteItem[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  clearFavorites: () => void;
};

export const useFavorites = create<FavoriteState>()(
  persist(
    (set) => ({
      favorites: [],
      addFavorite: (product) =>
        set((state) => {
          return { favorites: [...state.favorites, { product }] };
        }),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter(
            (item) => item.product._id !== id
          ),
        })),
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
