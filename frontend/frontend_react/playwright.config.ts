import { defineConfig, devices } from '@playwright/test'

// Runs against a real built-and-running container (see .github/workflows/ci.yml's e2e job and
// ../../deploy/e2e-compose.yml), never against `npm run dev` — the bug that motivated adding
// these tests (the WebVM's disk image missing from the production build) only ever showed up in
// the real Docker image, not the dev server.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:18080',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
