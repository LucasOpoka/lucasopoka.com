import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { getDefaultStore } from 'jotai'
import { cxReadFuncAtom } from '../WebVmAtoms'
import { VIEW_CONFIGS, type ViewName } from '../viewConfigs'

const store = getDefaultStore()

// Boots a fresh VM straight into the given view: waits for CheerpX and the
// shell prompt, then cd's into the view's directory and cats its ascii art.
// Runs once per mount - this hook lives inside the per-view iframe
// (webvm-frame), which only ever handles a single view for its lifetime.
export function useWebVmView(term: Terminal | null, view: ViewName) {
  const hasExecuted = useRef(false)

  useEffect(() => {
    if (!term || hasExecuted.current) {
      return
    }

    hasExecuted.current = true

    async function navigateToView() {
      try {
        if (!term) {
          return
        }

        const config = VIEW_CONFIGS[view]

        await waitForWebVMReady()
        await waitForPrompt(term)

        const cdCommand = `cd ${config.directory} && cat ${config.asciiArtFile}`
        await executeCommandInTerminal(term, cdCommand)
        term.focus()
      } catch (error) {
        console.error('Error executing view navigation:', error)
      }
    }

    navigateToView()
  }, [term, view])
}

// Caller must already have confirmed the prompt is ready (see waitForPrompt).
async function executeCommandInTerminal(term: Terminal, command: string) {
  const cxReadFunc = store.get(cxReadFuncAtom).func
  if (!term || !cxReadFunc) {
    throw new Error('No terminal or cxReadFunc')
  }

  // Send the command with a small delay to make it look natural
  for (let i = 0; i < command.length; i++) {
    cxReadFunc(command.charCodeAt(i))
    await new Promise((resolve) => setTimeout(resolve, 30))
  }

  // Send newline to execute
  cxReadFunc('\n'.charCodeAt(0))
}

async function waitForWebVMReady() {
  const startTime = Date.now()
  const maxWaitTime = 10000 // 10 seconds max wait time

  while (Date.now() - startTime < maxWaitTime) {
    const cxReadFunc = store.get(cxReadFuncAtom).func
    if (cxReadFunc) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  throw new Error('WebVM did not initialize')
}

async function waitForPrompt(terminal: Terminal) {
  const startTime = Date.now()
  const maxWaitTime = 10000 // 10 seconds max wait time

  while (Date.now() - startTime < maxWaitTime) {
    // Check if the terminal has the prompt pattern
    const buffer = terminal.buffer
    const bufferHeight = buffer.active.length

    // Search the whole buffer starting from the last line
    for (let i = bufferHeight - 1; i >= 0; i--) {
      const line = buffer.active.getLine(i)?.translateToString() || ''
      const promptRegex = /^user@:~(\/.*)?\$\s/

      const match = line.match(promptRegex)
      if (match) {
        return
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  throw new Error('Prompt did not appear within maximum wait time')
}
