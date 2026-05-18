import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Cart store (plan §7). Persisted to localStorage so the cart
 * survives reloads.
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const existing = get().items.find((i) => i._id === product._id)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i._id === product._id ? { ...i, qty: i.qty + 1 } : i
            ),
          })
        } else {
          set({ items: [...get().items, { ...product, qty: 1 }] })
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i._id !== id) }),

      updateQty: (id, qty) =>
        set({
          items: get().items.map((i) =>
            i._id === id ? { ...i, qty: Math.max(1, qty) } : i
          ),
        }),

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'viso-cart' }
  )
)
