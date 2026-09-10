import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import {
  TERMINAL_HEIGHT,
  TERMINAL_BLACK,
  PAGE_BACKGROUND,
} from './src/webvm/terminalLayout.ts'

// index.html and styles.css can't import terminalLayout.ts (index.html runs
// before any JS bundle; styles.css is plain CSS) - so their __TOKEN__
// placeholders are filled in here instead, the only way to keep their
// loading-placeholder colors from drifting from the real constants.
function injectTerminalLayoutTokens(): Plugin {
  const replacements: Record<string, string> = {
    __TERMINAL_HEIGHT__: String(TERMINAL_HEIGHT),
    __TERMINAL_BLACK__: TERMINAL_BLACK,
    __PAGE_BACKGROUND__: PAGE_BACKGROUND,
  }

  function replaceTokens(code: string): string {
    return Object.entries(replacements).reduce(
      (result, [token, value]) => result.replaceAll(token, value),
      code,
    )
  }

  return {
    name: 'inject-terminal-layout-tokens',
    transformIndexHtml(html) {
      return replaceTokens(html)
    },
    transform(code, id) {
      if (id.endsWith('src/styles.css')) {
        return replaceTokens(code)
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: ['esnext', 'chrome91', 'firefox90', 'safari15'],
    outDir: 'dist',
    assetsDir: 'assets',
  },
  oxc: {
    target: 'esnext',
  },
  plugins: [react(), injectTerminalLayoutTokens()],
  server: {
    port: 3000,
    host: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // e2e/ holds Playwright specs, run by `npm run e2e` — Vitest's default glob would otherwise
    // also pick them up and try (and fail) to run them with its own test runner. Setting
    // `exclude` replaces Vitest's own default list, so it's repeated here alongside e2e/.
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{vite,vitest}.config.*',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
})
