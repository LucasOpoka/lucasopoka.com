import { useEffect } from 'react';
import { useXTerm } from 'react-xtermjs';
import { Box } from '@mui/material';
import '@xterm/xterm/css/xterm.css';
import { blockCacheAtom } from '../WebVmAtoms';
import WebVmFooter from './WebVmFooter';
import { useViewNavigation } from '../hooks/useViewNavigation';
import { initTerminal } from './WebVmInitTerminal.tsx';
import { initCheerpX } from './WebVmInitCheerpX.ts';
import { getDefaultStore } from 'jotai';

export const TERMINAL_WIDTH = 800;
export const TERMINAL_HEIGHT = 427;

export default function WebVM() {

  // Create terminal instance
  const { instance: term, ref: termRef } = useXTerm();

  // Use the view navigation hook - only when CheerpX is ready
  useViewNavigation(term);

  // Initialize terminal and virtual machine
  useEffect(() => {
    const initializeWebVM = async () => {
      initTerminal(term);
      await initCheerpX(term);
    };

    initializeWebVM();
  }, [term]);


  async function handleReset(): Promise<void> {
    const blockCache = getDefaultStore().get(blockCacheAtom);
    if (blockCache === null) return;
    await blockCache.reset();
    location.reload();
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (term) {
        term.dispose();
      }
    };
  }, []);

  return (
    <Box>
      <Box
        ref={termRef}
        sx={{
          mt: 2,
          height: `${TERMINAL_HEIGHT}px`,
          width: `${TERMINAL_WIDTH}px`,
          border: '1px solid #87ff8755',
          boxShadow: '0 0 200px #87ff8734',
          backgroundColor: 'black',
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
  );
}
