import { useEffect } from 'react'
import { useXTerm } from 'react-xtermjs'
import { Box } from '@mui/material'
import '@xterm/xterm/css/xterm.css'
import { blockCacheAtom } from '../WebVmAtoms'
import WebVmFooter from './WebVmFooter'
import { useWebVmView } from '../hooks/useWebVmView'
import { initTerminal } from './WebVmInitTerminal.tsx'
import { initCheerpX } from './WebVmInitCheerpX.ts'
import { getDefaultStore } from 'jotai'
import type { ViewName } from '../viewConfigs'
import {
  TERMINAL_WIDTH,
  TERMINAL_HEIGHT,
  TERMINAL_BLACK,
} from '../terminalLayout'

interface WebVMProps {
  view: ViewName
}

export default function WebVM({ view }: WebVMProps) {
  // Create terminal instance
  const { instance: term, ref: termRef } = useXTerm()

  // Boot straight into the requested view once CheerpX is ready
  useWebVmView(term, view)

  // Initialize terminal and virtual machine
  useEffect(() => {
    const initializeWebVM = async () => {
      initTerminal(term)
      await initCheerpX(term)
    }

    initializeWebVM()
  }, [term])

  async function handleReset(): Promise<void> {
    const blockCache = getDefaultStore().get(blockCacheAtom)
    if (blockCache === null) return
    await blockCache.reset()
    location.reload()
  }

  return (
    <Box>
      <Box
        ref={termRef}
        sx={{
          height: `${TERMINAL_HEIGHT}px`,
          width: `${TERMINAL_WIDTH}px`,
          backgroundColor: TERMINAL_BLACK,
          // Invisible - shrinks xterm's content area by 1px/side (border-box),
          // matching the pre-iframe layout where the real border (now in
          // WebVmEmbed) lived directly on this box.
          border: '1px solid transparent',
          // Hide Xterm terminal scrollbar
          '& .xterm-viewport': {
            '&::-webkit-scrollbar': {
              width: '0px',
              background: 'transparent',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'transparent',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          },
        }}
      />
      <WebVmFooter onReset={handleReset} />
    </Box>
  )
}
