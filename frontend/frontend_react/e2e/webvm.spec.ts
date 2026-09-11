import { test, expect } from '@playwright/test'

// CheerpX fetches its WASM engine and disk image over the network (see
// deploy/publish-disk-image.sh), hence the generous retries below. Would
// have caught the real bug motivating e2e tests: prod shipped with no disk image.
test('the WebVM boots and runs a real command', async ({ page }) => {
  await page.goto('/')

  // The terminal lives inside the per-view WebVM <iframe> (see WebVmEmbed/WebVmFrame),
  // not directly on the page.
  const terminal = page
    .frameLocator('iframe[title="WebVM - home"]')
    .locator('.xterm-screen')
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
