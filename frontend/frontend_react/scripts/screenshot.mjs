#!/usr/bin/env node
// Dev utility: drives a real headless browser from the CLI for screenshots and JS eval, using
// @playwright/test's own bundled Chromium instead of the interactive browser. Not part of the
// app, not linted/type-checked, not run in CI.
//
// Usage:
//   node scripts/screenshot.mjs --url=http://localhost:3000 --out=/tmp/shot.png
//   node scripts/screenshot.mjs --url=... --out=... --clip=350,220,500,80
//   node scripts/screenshot.mjs --url=... --out=... --selector=".xterm-screen"
//   node scripts/screenshot.mjs --url=... --eval="document.title"
//
// Flags:
//   --url=<url>          page to load (required)
//   --out=<path>          where to save the screenshot (default: scripts/.output/shot.png)
//   --selector=<css>      wait for this selector to be visible before doing anything else
//   --clip=x,y,w,h        crop the screenshot to this viewport-pixel region
//   --width=<n>            viewport width (default 1440)
//   --height=<n>          viewport height (default 900)
//   --wait=<ms>            extra time to wait after load/selector, before screenshotting
//   --eval=<js>            evaluate this JS in the page and print the (JSON-stringified) result
//                          instead of taking a screenshot
//   --full                full-page screenshot instead of just the viewport

import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

function parseArgs(argv) {
  const args = {}
  for (const arg of argv) {
    const match = arg.match(/^--([^=]+)(?:=([\s\S]*))?$/)
    if (!match) continue
    args[match[1]] = match[2] ?? true
  }
  return args
}

const args = parseArgs(process.argv.slice(2))

if (!args.url) {
  console.error(
    'Usage: node scripts/screenshot.mjs --url=<url> [--out=<path>] [--selector=<css>] [--clip=x,y,w,h] [--eval=<js>] [--full] [--width=<n>] [--height=<n>] [--wait=<ms>]',
  )
  process.exit(1)
}

const width = Number(args.width ?? 1440)
const height = Number(args.height ?? 900)
const outPath = args.out ?? 'scripts/.output/shot.png'

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(args.url, { waitUntil: 'load' })

  if (args.selector) {
    await page.locator(args.selector).waitFor({ state: 'visible' })
  }
  if (args.wait) {
    await page.waitForTimeout(Number(args.wait))
  }

  if (args.eval) {
    const result = await page.evaluate(args.eval)
    console.log(JSON.stringify(result, null, 2))
  } else {
    await mkdir(dirname(outPath), { recursive: true })
    const clip = args.clip
      ? (() => {
          const [x, y, w, h] = args.clip.split(',').map(Number)
          return { x, y, width: w, height: h }
        })()
      : undefined
    await page.screenshot({ path: outPath, fullPage: !!args.full, clip })
    console.log(`Saved screenshot to ${outPath}`)
  }
} finally {
  await browser.close()
}
