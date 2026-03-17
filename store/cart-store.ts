import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  imageUrl: string | null;
  variantId: number;
  variantLabel: string;
  price: number;
  quantity: number;
  printifyProductId: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId: number) => void;
  updateQuantity: (productId: string, variantId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, qty = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        });
      },
      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        }));
      },
      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getCount: () => get().items.reduce((c, i) => c + i.quantity, 0),
    }),
    { name: "fioresque-cart" }
  )
);
