import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { useXTerm } from 'react-xtermjs';
import { Box } from '@mui/material';
import '@xterm/xterm/css/xterm.css';
import { 
  blockCacheAtom
} from '../WebVmAtoms';
import WebVmFooter from './WebVmFooter';
import { useViewNavigation } from '../hooks/useViewNavigation';
import { createWebVmCallbacks } from './WebVmCallbacks';
import { initTerminal, initCheerpX } from './WebVmInitTerminal.tsx';

export const TERMINAL_WIDTH = 797;
export const TERMINAL_HEIGHT = 427;
export const BORDER_WIDTH = 7.5;
export const BORDER_HEIGHT = 15;

export default function WebVM(cacheId: string) {

  // Create terminal instance
  const { instance: term, ref: termRef } = useXTerm();

  // WebVM component atoms
  const [blockCache, setBlockCache] = useAtom(blockCacheAtom);

  // Reference to the CheerpX read function
  const cxReadFuncRef = useRef<((char: number) => void) | null>(null);

  // Use the view navigation hook - only when CheerpX is ready
  useViewNavigation(term, cxReadFuncRef);

  // Create callbacks
  const { hddCallback, latencyCallback, cpuCallback } = createWebVmCallbacks();

  // Initialize terminal and virtual machine
  useEffect(() => {
    const initializeWebVM = async () => {
      initTerminal(
        term,
        cxReadFuncRef
      );
      await initCheerpX({
        term,
        cxReadFuncRef,
        setBlockCache,
        hddCallback,
        latencyCallback,
        cpuCallback,
        cacheId
      });
    };
    
    initializeWebVM();
  }, [term]);


  async function handleReset(): Promise<void> {
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
          position: 'relative'
        }}
      />
      <WebVmFooter onReset={handleReset} />
    </Box>
  );
}
