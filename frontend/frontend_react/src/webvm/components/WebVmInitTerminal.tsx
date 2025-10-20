import { WebLinksAddon } from '@xterm/addon-web-links';
import { TerminalThemeSetter } from '../TerminalThemeSetter';
import type { Terminal } from '@xterm/xterm';


export function initTerminal(term: Terminal | null): void {
  if (!term) {
    return;
  }
  
  console.log('Setting up terminal with react-xtermjs...');
  
  // Apply terminal theme
  TerminalThemeSetter(term);
  
  // Configure additional terminal options
  term.options.convertEol = true;
  
  const linkAddon = new WebLinksAddon();
  
  // Set terminal dimensions (columns x rows)
  term.resize(102, 25);

  // Load the web links addon
  term.loadAddon(linkAddon);
  
  term.scrollToTop();
  term.focus();
  console.log('Terminal setup complete');
}