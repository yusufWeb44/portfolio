import { create } from 'zustand';
import api from '../services/api';

interface AuthState {
  user: any | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null });
    } catch (error) {
      console.error('Logout failed', error);
    }
  }
}));
