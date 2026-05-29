import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string, tenantSlug: string) => Promise<void>;
  register: (email: string, password: string, name: string, tenantSlug: string) => Promise<void>;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoading: false,

      login: async (email, password, tenantSlug) => {
        set({ isLoading: true });
        try {
          const response = await axios.post('/api/auth/login', {
            email,
            password,
            tenantSlug,
          });
          
          const { user, accessToken } = response.data;
          
          set({
            user,
            accessToken,
            isLoading: false,
          });
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email, password, name, tenantSlug) => {
        set({ isLoading: true });
        try {
          const response = await axios.post('/api/auth/register', {
            email,
            password,
            name,
            tenantSlug,
          });
          
          const { user, accessToken } = response.data;
          
          set({
            user,
            accessToken,
            isLoading: false,
          });
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, accessToken: null });
        delete axios.defaults.headers.common['Authorization'];
      },

      setAccessToken: (token: string) => {
        set({ accessToken: token });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
