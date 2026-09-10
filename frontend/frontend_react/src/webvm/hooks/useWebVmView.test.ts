import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { getDefaultStore } from 'jotai'
import type { Terminal } from '@xterm/xterm'
import { useWebVmView } from './useWebVmView'
import { cxReadFuncAtom } from '../WebVmAtoms'
import { VIEW_CONFIGS } from '../viewConfigs'

const store = getDefaultStore()

function createFakeTerminal(promptLines: string[] = []): Terminal {
  return {
    focus: vi.fn(),
    buffer: {
      active: {
        length: promptLines.length,
        getLine: (i: number) => ({
          translateToString: () => promptLines[i] ?? '',
        }),
      },
    },
  } as unknown as Terminal
}

beforeEach(() => {
  vi.useFakeTimers()
  store.set(cxReadFuncAtom, { func: null })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  store.set(cxReadFuncAtom, { func: null })
})

describe('useWebVmView', () => {
  it('does nothing while term is null', async () => {
    renderHook(() => useWebVmView(null, 'home'))
    await vi.advanceTimersByTimeAsync(11000)
    // Nothing to assert directly on a null term - the real assertion is that
    // this doesn't throw and doesn't touch cxReadFuncAtom's consumer path.
    expect(store.get(cxReadFuncAtom).func).toBeNull()
  })

  it('types cd+cat for the given view once the VM and prompt are ready, then focuses', async () => {
    const receivedChars: number[] = []
    const readFunc = vi.fn((code: number) => receivedChars.push(code))
    store.set(cxReadFuncAtom, { func: readFunc })

    const term = createFakeTerminal(['user@:~$ '])

    renderHook(() => useWebVmView(term, 'home'))

    const config = VIEW_CONFIGS.home
    const expectedCommand = `cd ${config.directory} && cat ${config.asciiArtFile}`
    // 30ms per character, plus slack for the polling loops' own 100ms ticks.
    await vi.advanceTimersByTimeAsync(expectedCommand.length * 30 + 500)

    const sentCommand = String.fromCharCode(
      ...receivedChars.slice(0, expectedCommand.length),
    )
    expect(sentCommand).toBe(expectedCommand)
    // Last character sent is the newline that submits the command.
    expect(receivedChars.at(-1)).toBe('\n'.charCodeAt(0))
    expect(term.focus).toHaveBeenCalledTimes(1)
  })

  it('picks the requested view directory/ascii file, not always home', async () => {
    const receivedChars: number[] = []
    const readFunc = vi.fn((code: number) => receivedChars.push(code))
    store.set(cxReadFuncAtom, { func: readFunc })

    const term = createFakeTerminal(['user@:~/pong$ '])
    renderHook(() => useWebVmView(term, 'pong'))

    const config = VIEW_CONFIGS.pong
    const expectedCommand = `cd ${config.directory} && cat ${config.asciiArtFile}`
    await vi.advanceTimersByTimeAsync(expectedCommand.length * 30 + 500)

    const sentCommand = String.fromCharCode(
      ...receivedChars.slice(0, expectedCommand.length),
    )
    expect(sentCommand).toBe(expectedCommand)
  })

  it('runs only once even if re-rendered with the same term', async () => {
    const readFunc = vi.fn()
    store.set(cxReadFuncAtom, { func: readFunc })
    const term = createFakeTerminal(['user@:~$ '])

    const { rerender } = renderHook(
      ({ term, view }: { term: Terminal; view: 'home' }) =>
        useWebVmView(term, view),
      { initialProps: { term, view: 'home' } },
    )
    await vi.advanceTimersByTimeAsync(2000)
    const callsAfterFirstRun = readFunc.mock.calls.length
    expect(callsAfterFirstRun).toBeGreaterThan(0)

    rerender({ term, view: 'home' })
    await vi.advanceTimersByTimeAsync(2000)

    expect(readFunc.mock.calls.length).toBe(callsAfterFirstRun)
  })

  it('logs an error if the VM never becomes ready', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const term = createFakeTerminal(['user@:~$ '])
    // cxReadFuncAtom is left at { func: null } - waitForWebVMReady's loop
    // never finds a readFunc.

    renderHook(() => useWebVmView(term, 'home'))
    await vi.advanceTimersByTimeAsync(10500)

    expect(consoleError).toHaveBeenCalledWith(
      'Error executing view navigation:',
      expect.objectContaining({ message: 'WebVM did not initialize' }),
    )
  })

  it('logs an error if the prompt never appears', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    store.set(cxReadFuncAtom, { func: vi.fn() })
    // No prompt-shaped line ever shows up in the buffer.
    const term = createFakeTerminal(['still booting...'])

    renderHook(() => useWebVmView(term, 'home'))
    await vi.advanceTimersByTimeAsync(10500)

    expect(consoleError).toHaveBeenCalledWith(
      'Error executing view navigation:',
      expect.objectContaining({
        message: 'Prompt did not appear within maximum wait time',
      }),
    )
  })
})
