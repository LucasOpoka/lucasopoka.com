import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

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
  plugins: [react()],
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
