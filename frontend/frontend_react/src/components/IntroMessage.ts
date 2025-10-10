import { Terminal } from '@xterm/xterm'

/**
 * Displays the intro message on the terminal
 * @param instance - The xterm.js terminal instance
 */
export function displayIntroMessage(instance: Terminal): void {
  instance.writeln(`Give this interactive terminal a go, hope you have fun!`)
}
