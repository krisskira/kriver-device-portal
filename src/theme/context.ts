import { createContext } from 'react';

export type ThemeName = 'light' | 'dark';

export const ThemeContext = createContext<{ theme: ThemeName; toggle: () => void } | null>(null);
