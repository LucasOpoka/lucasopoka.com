import { Terminal } from '@xterm/xterm'
import { typeCommand } from './TerminalCommandHandlers'
import { commandHandlers } from './TerminalCommandHandlers'

/**
 * Executes a command programmatically by typing it and then running it
 * @param instance - The xterm.js terminal instance
 * @param command - The command to execute (e.g., 'curl lucasopoka.com')
 * @param setCurrentLine - Function to update the current line state
 * @param setCursorPosition - Function to update the cursor position state
 * @param terminalActions - Function to handle terminal actions like history
 */
export async function executeCommandProgrammatically(
  instance: Terminal,
  command: string,
  setCurrentLine: (line: string) => void,
  setCursorPosition: (position: number) => void,
  terminalActions: (action: { type: string; data: string | undefined }) => void
): Promise<void> {
  // Type the command with prompt
  await typeCommand(instance, command, setCurrentLine || (() => {}), setCursorPosition || (() => {}))
  
  // Parse command and arguments
  const parts = command.trim().split(/\s+/)
  const cmd = parts[0].toLowerCase()
  const args = parts.slice(1)
  
  // Execute the command using the actual command handler
  if (commandHandlers[cmd]) {
    await commandHandlers[cmd]({
      instance,
      args,
      setPongOverlayVisible: undefined,
      setCurrentLine,
      setCursorPosition
    })
    
    // Add the command to history
    if (terminalActions) {
      terminalActions({ type: 'addToHistory', data: command })
    }
  }
}
