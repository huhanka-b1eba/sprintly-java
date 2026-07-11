'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    useSyncExternalStore,
    type PropsWithChildren,
} from 'react';

import { THEME_STORAGE_KEY } from './theme-storage';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
    theme: Theme;
    mounted: boolean;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getSystemTheme = (): Theme =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

const applyTheme = (theme: Theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
};

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeProvider({ children }: Readonly<PropsWithChildren>) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') {
            return 'light';
        }

        const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

        return storedTheme === 'light' || storedTheme === 'dark'
            ? storedTheme
            : getSystemTheme();
    });
    const mounted = useSyncExternalStore(
        subscribe,
        getClientSnapshot,
        getServerSnapshot,
    );

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const updateTheme = useCallback((nextTheme: Theme) => {
        setTheme(nextTheme);
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        updateTheme(theme === 'dark' ? 'light' : 'dark');
    }, [theme, updateTheme]);

    const value = useMemo(
        () => ({
            mounted,
            theme,
            setTheme: updateTheme,
            toggleTheme,
        }),
        [mounted, theme, toggleTheme, updateTheme],
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider.');
    }

    return context;
}

export { THEME_STORAGE_KEY };
