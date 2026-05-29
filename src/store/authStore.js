import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          const { user, token } = response.data;
          localStorage.setItem('token', token);
          set({ user, token, isLoading: false });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Error al registrar';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          const { user, token } = response.data;
          localStorage.setItem('token', token);
          set({ user, token, isLoading: false });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Error al iniciar sesión';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
