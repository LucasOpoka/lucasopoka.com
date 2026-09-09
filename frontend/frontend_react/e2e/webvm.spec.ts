import { test, expect } from '@playwright/test'

// CheerpX boots a real x86 Linux VM in-browser: it fetches its WASM engine from Leaning
// Technologies' CDN and streams the disk image chunks this repo publishes as a GitHub Release
// (see deploy/publish-disk-image.sh). Both are real network dependencies outside this repo's
// control, hence the generous timeout and the retries configured in playwright.config.ts — a
// slow CDN response shouldn't be treated the same as a genuine regression.
//
// This is the test that would have caught the real bug that motivated adding e2e tests at all:
// the production image was shipped without the disk image data, so the terminal never got past
// its initial boot prompt.
test('the WebVM boots and runs a real command', async ({ page }) => {
  await page.goto('/')

  const terminal = page.locator('.xterm-screen')
  await expect(terminal).toBeVisible()

  // The home view runs `cd ... && cat home` on load, which prints this ASCII-art caption once
  // the VM has actually booted and the disk image resolved correctly.
  await expect(terminal).toContainText(
    'Can this be a Linux VM in your browser',
    {
      timeout: 60_000,
    },
  )

  // Confirms the shell is actually interactive afterward, not just that the boot banner printed.
  await expect(terminal).toContainText('user@:~/home$', { timeout: 15_000 })
})
