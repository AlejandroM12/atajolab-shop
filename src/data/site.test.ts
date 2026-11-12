import { describe, expect, it } from "vitest";
import { QR_TOOL_URL, SITE } from "./site";

describe("enlaces del ecosistema", () => {
  it("AtajoLab QR apunta al dominio oficial por https", () => {
    expect(QR_TOOL_URL).toBe("https://qr.atajolab.dev");
    expect(new URL(QR_TOOL_URL).protocol).toBe("https:");
  });
  it("el sitio institucional y la tienda usan https", () => {
    expect(SITE.institutionalUrl).toBe("https://atajolab.dev");
    expect(SITE.url.startsWith("https://")).toBe(true);
  });
});
