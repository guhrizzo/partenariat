"use client";

import * as React from "react";

export type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "contractflow-theme";
const THEME_CHANGE_EVENT = "contractflow-theme-change";

function readStoredTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

function getServerTheme(): Theme {
  return "system";
}

function subscribeToTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

function getSystemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getServerSystemPrefersDark(): boolean {
  return false;
}

function subscribeToSystemPreference(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.classList.toggle("light", resolved === "light");
}

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

/**
 * `useSyncExternalStore` lê localStorage/matchMedia sem o mismatch de
 * hidratação que `useState` + `useEffect` teria (o script inline
 * `beforeInteractive` no root layout já aplicou a classe certa no `<html>`
 * antes da hidratação); o único efeito daqui em diante é sincronizar essa
 * classe com o estado do React, o uso permitido de `useEffect`.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore(subscribeToTheme, readStoredTheme, getServerTheme);
  const systemPrefersDark = React.useSyncExternalStore(
    subscribeToSystemPreference,
    getSystemPrefersDark,
    getServerSystemPrefersDark
  );

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme;

  React.useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = React.useCallback((next: Theme) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider.");
  }
  return ctx;
}
