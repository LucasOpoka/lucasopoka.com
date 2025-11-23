import { Terminal } from '@xterm/xterm'

export function TerminalThemeSetter(instance: Terminal): void {
  // Configure terminal theme
  instance.options.theme = {
    background: '#000000',
    foreground: '#00ff00',
    cursor: '#00ff00',
    black: '#000000',
    red: '#ff0000',
    green: '#00ff00',
    yellow: '#ffff00',
    blue: '#0000ff',
    magenta: '#ff00ff',
    cyan: '#00ffff',
    white: '#ffffff',
    brightBlack: '#404040',
    brightRed: '#ff4040',
    brightGreen: '#40ff40',
    brightYellow: '#ffff40',
    brightBlue: '#4040ff',
    brightMagenta: '#ff40ff',
    brightCyan: '#40ffff',
    brightWhite: '#ffffff'
  }
  instance.options.fontSize = 13
  instance.options.fontFamily = '"Fira Mono", monospace'
  
  // Cursor configuration
  instance.options.cursorBlink = true
  instance.options.cursorStyle = 'block'
  instance.options.cursorWidth = 1
}
