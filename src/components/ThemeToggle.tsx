"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  nextTheme,
  parseTheme,
  resolveTheme,
  THEME_EVENT,
  THEME_KEY,
  THEME_LABELS,
  type ThemePreference,
} from "@/lib/theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

// Respaldo en memoria si el navegador no permite usar localStorage.
let memory: string | null = null;

function readPreference(): ThemePreference {
  try {
    return parseTheme(localStorage.getItem(THEME_KEY));
  } catch {
    return parseTheme(memory);
  }
}

function apply(pref: ThemePreference) {
  const theme = resolveTheme(pref, window.matchMedia(DARK_QUERY).matches);
  document.documentElement.setAttribute("data-theme", theme);
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

const ICONS: Record<ThemePreference, React.ReactNode> = {
  system: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  dark: <path d="M20 14.5A8 8 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />,
};

export function ThemeToggle() {
  const pref = useSyncExternalStore(subscribe, readPreference, () => "system" as ThemePreference);

  // Aplica el tema elegido y, si es "sistema", reacciona a los cambios del sistema operativo.
  useEffect(() => {
    apply(pref);
    if (pref !== "system") return;
    const mq = window.matchMedia(DARK_QUERY);
    const onChange = () => apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [pref]);

  const change = () => {
    const next = nextTheme(pref);
    memory = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* sin almacenamiento: el cambio rige solo durante esta visita */
    }
    apply(next);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <button
      type="button"
      onClick={change}
      data-theme-pref={pref}
      aria-label={`Tema: ${THEME_LABELS[pref]}. Cambiar tema`}
      title={`Tema: ${THEME_LABELS[pref]}`}
      className="grid h-11 w-10 place-items-center rounded-md text-ink-soft hover:bg-paper-2 hover:text-ink"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {ICONS[pref]}
      </svg>
    </button>
  );
}
