import { create } from 'zustand';
import api from '../services/api';

interface AuthState {
  user: any | null;
  isLoading: boolean;
  setUser: (user: any) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user: any) => set({ user, isLoading: false }),
  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data, isLoading: false });
    } catch (error) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
      }
      set({ user: null, isLoading: false });
    }
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
      }
      set({ user: null });
    }
  }
}));
