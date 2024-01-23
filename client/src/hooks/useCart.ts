import { Product } from '@/types/index'
import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
} from 'zustand/middleware'

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity: 1 }],
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== id),
        })),
      clearCart: () => set({ items: [] }),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId
              ? { ...item, quantity }
              : item
          ),
        })),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);