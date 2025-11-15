import { WebLinksAddon } from '@xterm/addon-web-links';
import { TerminalThemeSetter } from '../TerminalThemeSetter';
import type { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';


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
  const fitAddon = new FitAddon();


  // Load the web links addon
  term.loadAddon(linkAddon);
  term.loadAddon(fitAddon);

  // Use fitAddon for height as line spacing differs between Chrome and Firefox
  fitAddon.fit();
  // Set width manually as fitAddon leaves empty margin on the right
  term.resize(102, term.rows);
  
  term.scrollToTop();
  term.focus();

  console.log('Terminal setup complete');
}