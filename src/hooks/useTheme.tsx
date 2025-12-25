import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type ColorTheme = 'ocean' | 'emerald' | 'sunset' | 'violet' | 'rose';

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('policyrag_theme');
    return (stored as Theme) || 'light';
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    const stored = localStorage.getItem('policyrag_color_theme');
    return (stored as ColorTheme) || 'ocean';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Handle light/dark mode
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Handle color theme
    root.setAttribute('data-theme', colorTheme);
    
    localStorage.setItem('policyrag_theme', theme);
    localStorage.setItem('policyrag_color_theme', colorTheme);
  }, [theme, colorTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setColorTheme = (newColorTheme: ColorTheme) => {
    setColorThemeState(newColorTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorTheme, setTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
