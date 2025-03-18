import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeContextType {
  theme: string;
  isDark: boolean;
  updateTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeContext = useTheme();

  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
