import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// vitest.config's `test` block doesn't set `globals: true` (every test file
// imports describe/it/expect explicitly instead), so @testing-library/react
// can't auto-detect a global afterEach to hook its own DOM cleanup into -
// without this, multiple render() calls across `it()` blocks in the same
// file pile up in the same document instead of each starting fresh.
afterEach(cleanup)

// CheerpX needs SharedArrayBuffer/WASM and network access to boot a real VM —
// none of that is available (or wanted) in CI. Mocked at the package level so
// every view (they all render <WebVM />) can be smoke-tested without it.
vi.mock('@leaningtech/cheerpx', () => ({
  Linux: {
    create: vi.fn().mockResolvedValue({
      registerCallback: vi.fn(),
      setCustomConsole: vi.fn(() => null),
      run: vi.fn().mockResolvedValue(undefined),
    }),
  },
  GitHubDevice: { create: vi.fn().mockResolvedValue({}) },
  IDBDevice: { create: vi.fn().mockResolvedValue({}) },
  OverlayDevice: { create: vi.fn().mockResolvedValue({}) },
  DataDevice: { create: vi.fn().mockResolvedValue({}) },
}))

// react-xtermjs mounts real xterm.js onto a canvas, which jsdom doesn't
// implement. Returning a null terminal instance is enough: WebVM's own
// effects (initTerminal/initCheerpX/useWebVmView) all already guard on
// `if (!term) return`, so mounting stays a true no-op rather than a fake VM.
vi.mock('react-xtermjs', () => ({
  useXTerm: () => ({ instance: null, ref: { current: null } }),
}))
