import { defineConfig } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Usa el Chrome instalado; en CI se puede ejecutar `npx playwright install chromium` y quitar `channel`.
    channel: process.env.PW_CHANNEL ?? "chrome",
  },
  projects: [
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, hasTouch: true } },
    { name: "desktop", use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    // Exportación estática con un número de WhatsApp de prueba (no es real).
    command: `npm run build && npx serve out -l ${PORT} -n`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 240_000,
    env: { NEXT_PUBLIC_WHATSAPP_NUMBER: "5493704000000" },
  },
});
