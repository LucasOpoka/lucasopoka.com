import { WebLinksAddon } from '@xterm/addon-web-links'
import { FitAddon } from '@xterm/addon-fit'
import { TerminalThemeSetter } from '../TerminalThemeSetter'
import type { Terminal } from '@xterm/xterm'

export function initTerminal(term: Terminal | null): void {
  if (!term) {
    return
  }

  console.log('Setting up terminal with react-xtermjs...')

  // Apply terminal theme
  TerminalThemeSetter(term)

  // Configure additional terminal options
  term.options.convertEol = true
  term.options.scrollback = 0 // Disable scrollbar

  const linkAddon = new WebLinksAddon()
  const fitAddon = new FitAddon()

  // Load the addons
  term.loadAddon(linkAddon)
  term.loadAddon(fitAddon)

  // Wait for fonts to load before fitting (critical for Firefox)
  async function initializeTerminal() {
    if (!term) {
      return
    }
    // Wait for fonts to be ready (especially important for "Fira Mono")
    await document.fonts.ready
    // Use double requestAnimationFrame to ensure DOM and fonts are fully rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        //term.resize(102, 28);
        fitAddon.fit()
      })
    })
  }

  initializeTerminal()

  term.scrollToTop()
  term.focus()

  console.log('Terminal setup complete')
}
