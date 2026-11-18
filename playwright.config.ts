import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',

  use: {
    baseURL: 'http://localhost:4200',
  },

  // Both servers start before any test runs: the Angular dev server on 4200
  // (which proxies /api) and the Express suggestions stub on 3000.
  webServer: [
    {
      command: 'npm run serve:api',
      port: 3000,
      timeout: 60_000,
      reuseExistingServer: true,
    },
    {
      command: 'npm start',
      port: 4200,
      timeout: 180_000,
      reuseExistingServer: true,
    },
  ],

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
