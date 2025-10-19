import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Terminal } from '@xterm/xterm';

interface ViewNavigationConfig {
  path: string;
  directory: string;
  asciiArtFile: string;
}

const VIEW_CONFIGS: Record<string, ViewNavigationConfig> = {
  '/': {
    path: '/',
    directory: '/home/user/home',
    asciiArtFile: 'ascii-art-home'
  },
  '/pong': {
    path: '/pong',
    directory: '/home/user/pong',
    asciiArtFile: 'ascii-art-pong'
  },
  '/contact': {
    path: '/contact',
    directory: '/home/user/contact',
    asciiArtFile: 'ascii-art-contact'
  }
};

export function useViewNavigation(terminal: Terminal | null, cxReadFuncRef: React.MutableRefObject<((char: number) => void) | null>) {
  const location = useLocation();
  const lastExecutedView = useRef<string | null>(null);

  useEffect(() => {
    if (!terminal) {
      return;
    }

    const currentPath = location.pathname;
    const config = VIEW_CONFIGS[currentPath];
    
    if (!config) {
      return;
    }

    // Only execute if this is a new view or initial load
    if (lastExecutedView.current === currentPath) {
      return;
    }

    lastExecutedView.current = currentPath;
    
    // CD and show ASCII art
    const executeViewNavigation = async () => {
      try {
        // Wait for WebVM to be ready by checking cxReadFuncRef
        await waitForWebVMReady();
        
        const cdCommand = `cd ${config.directory} && cat ${config.asciiArtFile}`;
        await executeCommandInTerminal(cdCommand);
      } catch (error) {
        console.error('Error executing view navigation:', error);
      }
    };

    executeViewNavigation();
  }, [location.pathname, terminal, cxReadFuncRef]);

  async function waitForWebVMReady(): Promise<void> {
    const startTime = Date.now();
    const maxWaitTime = 10000; // 10 seconds max wait time
    
    while (Date.now() - startTime < maxWaitTime) {
      if (cxReadFuncRef.current) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error('WebVM did not initialize');
  };

  const executeCommandInTerminal = async (command: string): Promise<void> => {
    if (!cxReadFuncRef.current || !terminal) {
      return;
    }

    // Wait for the prompt to be ready
    await waitForPrompt(terminal);
    
    // Send the command with a small delay to make it look natural
    for (let i = 0; i < command.length; i++) {
      cxReadFuncRef.current(command.charCodeAt(i));
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    
    // Send newline to execute
    cxReadFuncRef.current('\n'.charCodeAt(0));
  };

  async function waitForPrompt(terminal: Terminal): Promise<void> {
    const startTime = Date.now();
    const maxWaitTime = 1000; // 1 second max wait time
    
    while (Date.now() - startTime < maxWaitTime) {
      
      // Check if the terminal has the prompt pattern
      const buffer = terminal.buffer;
      const currentLine = buffer.active.getLine(buffer.active.cursorY)?.translateToString() || '';
      const trimmedLine = currentLine.trim();

      if (trimmedLine.includes('user@:') && trimmedLine.endsWith('$')) {
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error('Prompt did not appear within maximum wait time');
  };
}
