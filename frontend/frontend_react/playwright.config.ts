import { defineConfig, devices } from '@playwright/test'

// Runs against a real built-and-running container (see ci.yml's e2e job and
// deploy/e2e-compose.yml), never `npm run dev` - the bug that motivated these
// tests (prod's disk image missing) only showed up in the real image.
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
