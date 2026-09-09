import { test, expect } from '@playwright/test'

test.describe('static/routing', () => {
  test('home page renders the SPA', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('home')
    await expect(page.getByText('Hi there, my name is Lucas')).toBeVisible()
    // The nav buttons navigate via onClick + react-router, not a real href, so browsers
    // correctly don't give them the ARIA "link" role — matches the existing Header.test.tsx
    // Vitest smoke test, which uses the same getByText approach for the same reason.
    await expect(page.getByText('home', { exact: true })).toBeVisible()
    await expect(page.getByText('pong', { exact: true })).toBeVisible()
    await expect(page.getByText('contact', { exact: true })).toBeVisible()
  })

  test('navigating to pong and contact updates content and title', async ({
    page,
  }) => {
    await page.goto('/')

    await page.getByText('pong', { exact: true }).click()
    await expect(page).toHaveTitle('pong')
    await expect(page.getByText('Please enjoy a session of Pong')).toBeVisible()

    await page.getByText('contact', { exact: true }).click()
    await expect(page).toHaveTitle('contact')
    await expect(page.getByText('please do reach out')).toBeVisible()
  })

  test('unknown routes redirect to home', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')
    await expect(page).toHaveTitle('home')
  })
})

test.describe('curl fallback', () => {
  test('a curl-like User-Agent gets the plain-text version, not the SPA', async ({
    request,
  }) => {
    const response = await request.get('/', {
      headers: { 'User-Agent': 'curl/8.0' },
    })
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).not.toContain('<!doctype html>')
    expect(body).toContain('Can this be a Linux VM in your browser')
  })

  test('a browser User-Agent over plain HTTP is not affected by curl detection', async ({
    request,
  }) => {
    const response = await request.get('/', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('<!doctype html>')
  })
})

test('/healthz responds OK', async ({ request }) => {
  const response = await request.get('/healthz')
  expect(response.status()).toBe(200)
  expect(await response.text()).toBe('OK')
})
