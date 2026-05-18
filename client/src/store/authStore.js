import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Auth store (plan §8). Wired to the Auth API in Phase 3;
 * for now it just holds the JWT + current user locally.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: ({ user, token }) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => Boolean(useAuthStore.getState().token),
    }),
    { name: 'viso-auth' }
  )
)
