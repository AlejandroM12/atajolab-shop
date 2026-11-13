export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_KEY = "atajolab-shop:theme";
export const THEME_EVENT = "atajolab-shop:theme-change";
export const THEME_ORDER: ThemePreference[] = ["system", "light", "dark"];

export const THEME_LABELS: Record<ThemePreference, string> = {
  system: "Sistema",
  light: "Claro",
  dark: "Oscuro",
};

/** Cualquier valor guardado inválido equivale a "sistema". */
export function parseTheme(value: string | null | undefined): ThemePreference {
  return value === "light" || value === "dark" ? value : "system";
}

export function resolveTheme(pref: ThemePreference, systemDark: boolean): ResolvedTheme {
  if (pref === "system") return systemDark ? "dark" : "light";
  return pref;
}

/** Orden del ciclo del botón: sistema → claro → oscuro → sistema. */
export function nextTheme(pref: ThemePreference): ThemePreference {
  return THEME_ORDER[(THEME_ORDER.indexOf(pref) + 1) % THEME_ORDER.length];
}

/**
 * Se ejecuta en <head>, antes del primer pintado, para fijar data-theme sin parpadeo.
 * Debe mantenerse equivalente a parseTheme + resolveTheme.
 */
export const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement,p=null;try{p=localStorage.getItem("${THEME_KEY}")}catch(e){}var s=false;try{s=matchMedia("(prefers-color-scheme: dark)").matches}catch(e){}d.setAttribute("data-theme",p==="dark"||(p!=="light"&&s)?"dark":"light")})();`;
