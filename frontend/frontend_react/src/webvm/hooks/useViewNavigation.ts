import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Terminal } from '@xterm/xterm';
import { getDefaultStore } from 'jotai';
import { cxReadFuncAtom } from '../WebVmAtoms';

interface ViewNavigationConfig {
  path: string;
  directory: string;
  asciiArtFile: string;
}

const VIEW_CONFIGS: Record<string, ViewNavigationConfig> = {
  '/': {
    path: '/',
    directory: '/home/user/home',
    asciiArtFile: 'home'
  },
  '/pong': {
    path: '/pong',
    directory: '/home/user/pong',
    asciiArtFile: 'pong'
  },
  '/contact': {
    path: '/contact',
    directory: '/home/user/contact',
    asciiArtFile: 'contact'
  }
};

const store = getDefaultStore();

export function useViewNavigation(terminal: Terminal | null) {
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
    async function executeViewNavigation() {
      try {
        if (!terminal) {
          return;
        }

        // Wait for the WebVM to be ready
        await waitForWebVMReady();

        // Clear screen and add prompt
        await waitForPrompt(terminal);

        // Navigate to directory and show the ASCII art
        const cdCommand = `cd ${config.directory} && cat ${config.asciiArtFile}`;
        await executeCommandInTerminal(cdCommand);
        terminal.focus();
      } catch (error) {
        console.error('Error executing view navigation:', error);
      } 
    };

    executeViewNavigation();
  }, [location.pathname, terminal]);


  async function executeCommandInTerminal(command: string) {
    const cxReadFunc = store.get(cxReadFuncAtom).func;
    if (!terminal || !cxReadFunc) {
      throw new Error('No terminal or cxReadFunc');
    }

    // Wait for the prompt to be ready
    await waitForPrompt(terminal);
    
    // Send the command with a small delay to make it look natural
    for (let i = 0; i < command.length; i++) {
      cxReadFunc(command.charCodeAt(i));
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    
    // Send newline to execute
    cxReadFunc('\n'.charCodeAt(0));
  };


  async function waitForWebVMReady() {
    const startTime = Date.now();
    const maxWaitTime = 10000; // 10 seconds max wait time
    
    while (Date.now() - startTime < maxWaitTime) {
      const cxReadFunc = store.get(cxReadFuncAtom).func;
      if (cxReadFunc) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    throw new Error('WebVM did not initialize');
  };


  async function waitForPrompt(terminal: Terminal) {
    const startTime = Date.now();
    const maxWaitTime = 10000; // 10 seconds max wait time
    
    while (Date.now() - startTime < maxWaitTime) {
      
      // Check if the terminal has the prompt pattern
      const buffer = terminal.buffer;
      const bufferHeight = buffer.active.length;
      
      // Search the whole buffer starting from the last line
      for (let i = bufferHeight - 1; i >= 0; i--) {
        const line = buffer.active.getLine(i)?.translateToString() || '';
        const promptRegex = /^user@:~(\/.*)?\$\s/;
        
        const match = line.match(promptRegex);
        if (match) {
          return;
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    throw new Error('Prompt did not appear within maximum wait time');
  };
}
