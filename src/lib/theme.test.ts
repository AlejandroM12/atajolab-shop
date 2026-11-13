import { describe, expect, it } from "vitest";
import { nextTheme, parseTheme, resolveTheme, THEME_INIT_SCRIPT, THEME_KEY } from "./theme";

describe("tema", () => {
  it("interpreta la preferencia guardada; lo inválido equivale a sistema", () => {
    expect(parseTheme("light")).toBe("light");
    expect(parseTheme("dark")).toBe("dark");
    for (const v of [null, undefined, "", "system", "azul", "DARK"]) expect(parseTheme(v)).toBe("system");
  });

  it("resuelve el tema: sistema sigue al sistema operativo, claro/oscuro lo ignoran", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("el botón cicla sistema → claro → oscuro → sistema", () => {
    expect(nextTheme("system")).toBe("light");
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("system");
  });

  it("el script inicial usa la misma clave y las mismas reglas", () => {
    expect(THEME_INIT_SCRIPT).toContain(THEME_KEY);
    const run = (stored: string | null, systemDark: boolean) => {
      const attrs: Record<string, string> = {};
      const fn = new Function("document", "localStorage", "matchMedia", THEME_INIT_SCRIPT);
      fn(
        { documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v) } },
        { getItem: () => stored },
        () => ({ matches: systemDark }),
      );
      return attrs["data-theme"];
    };
    expect(run(null, false)).toBe("light");
    expect(run(null, true)).toBe("dark");
    expect(run("dark", false)).toBe("dark");
    expect(run("light", true)).toBe("light");
    expect(run("system", true)).toBe("dark");
    expect(run("basura", false)).toBe("light");
  });
});
