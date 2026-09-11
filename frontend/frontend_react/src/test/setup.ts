import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// `globals: true` isn't set in vitest.config, so @testing-library/react can't
// auto-register its own cleanup - without this, render()s across it() blocks
// in the same file pile up in the same document.
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

// react-xtermjs mounts real xterm.js onto a canvas, which jsdom lacks. A null
// terminal instance is enough: WebVM's effects all guard on `if (!term) return`,
// so mounting stays a true no-op rather than a fake VM.
vi.mock('react-xtermjs', () => ({
  useXTerm: () => ({ instance: null, ref: { current: null } }),
}))
