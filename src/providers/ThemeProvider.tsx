"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "light",
    setTheme: () => { },
});

const STORAGE_KEY = "omniai-theme";

function getSystemTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
    const resolved = theme === "system" ? getSystemTheme() : theme;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
}

export function ThemeProvider({
    children,
    defaultTheme = "light",
}: {
    children: ReactNode;
    defaultTheme?: Theme;
    // Accept but ignore next-themes compat props
    attribute?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
}) {
    const [theme, setThemeState] = useState<Theme>(defaultTheme);

    // On mount: read localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
        const initial = stored ?? defaultTheme;
        setThemeState(initial);
        applyTheme(initial);
    }, [defaultTheme]);

    // System theme listener
    useEffect(() => {
        if (theme !== "system") return;
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => applyTheme("system");
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, [theme]);

    function setTheme(next: Theme) {
        setThemeState(next);
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    return useContext(ThemeContext);
}
