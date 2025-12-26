import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  ReactNode,
} from 'react';

type Theme = 'light' | 'dark' | 'system';
type ColorTheme = 'ocean' | 'emerald' | 'sunset' | 'violet' | 'rose';

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
}

const STORAGE_THEME = 'policyrag_theme';
const STORAGE_COLOR = 'policyrag_color_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/* ---------------- helpers ---------------- */

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

function isColorTheme(value: string | null): value is ColorTheme {
  return (
    value === 'ocean' ||
    value === 'emerald' ||
    value === 'sunset' ||
    value === 'violet' ||
    value === 'rose'
  );
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/* ---------------- provider ---------------- */

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_THEME);
    return isTheme(stored) ? stored : 'system';
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const stored = localStorage.getItem(STORAGE_COLOR);
    return isColorTheme(stored) ? stored : 'ocean';
  });

  /* Apply theme BEFORE paint to avoid flicker */
  useLayoutEffect(() => {
    const root = document.documentElement;

    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.setAttribute('data-theme', colorTheme);
  }, [theme, colorTheme]);

  /* Persist preferences */
  useEffect(() => {
    localStorage.setItem(STORAGE_THEME, theme);
    localStorage.setItem(STORAGE_COLOR, colorTheme);
  }, [theme, colorTheme]);

  /* React to system theme changes */
  useEffect(() => {
    if (theme !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const root = document.documentElement;
      root.classList.toggle('dark', media.matches);
    };

    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, colorTheme, setTheme, setColorTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/* ---------------- hook ---------------- */

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
