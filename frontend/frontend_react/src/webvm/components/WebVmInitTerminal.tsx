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

  // Load the web links addon
  term.loadAddon(linkAddon);

  // Wait for fonts to load before fitting (critical for Firefox)
  async function initializeTerminal() {
    if (!term) {
      return;
    }
    // Wait for fonts to be ready (especially important for "Fira Mono")
    await document.fonts.ready;
    // Use double requestAnimationFrame to ensure DOM and fonts are fully rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        term.resize(102, 28);
      });
    });
  };

  initializeTerminal();

  term.scrollToTop();
  term.focus();

  console.log('Terminal setup complete');
}