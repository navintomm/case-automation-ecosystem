import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../theme/tokens';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  colors: typeof lightColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      colors: lightColors,
      toggleTheme: () => {
        const newMode = get().mode === 'light' ? 'dark' : 'light';
        set({ mode: newMode, colors: newMode === 'light' ? lightColors : darkColors });
      },
      setTheme: (mode) => set({ mode, colors: mode === 'light' ? lightColors : darkColors }),
    }),
    {
      name: 'case-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
