import { Terminal } from '@xterm/xterm'
import { executeCommandProgrammatically } from '../terminal/ExecuteCommandProgrammatically'

/**
 * Displays a view-specific intro message with typing animation
 * @param instance - The xterm.js terminal instance
 * @param viewType - The type of view (home, pong, contact)
 * @param setCurrentLine - Function to update the current line state
 * @param setCursorPosition - Function to update the cursor position state
 * @param setIsTyping - Function to update the typing state
 * @param terminalActions - Function to handle terminal actions like history
 */
export async function displayViewIntroMessage(
  instance: Terminal,
  viewType: 'home' | 'pong' | 'contact',
  setCurrentLine: (line: string) => void,
  setCursorPosition: (position: number) => void,
  setIsTyping: (typing: boolean) => void,
  terminalActions: (action: { type: string; data: string | undefined }) => void
): Promise<void> {
  // Map view types to their corresponding curl commands
  const commandMap: Record<'home' | 'pong' | 'contact', string> = {
    home: 'curl lucasopoka.com',
    pong: 'curl lucasopoka.com/pong',
    contact: 'curl lucasopoka.com/contact'
  }

  const command = commandMap[viewType]
  
  if (!command) {
    return
  }

  try {
    // Set typing state to true
    if (setIsTyping) {
      setIsTyping(true)
    }

    // Execute the command programmatically
    await executeCommandProgrammatically(
      instance,
      command,
      setCurrentLine,
      setCursorPosition,
      terminalActions
    )
  } finally {
    // Reset typing state when done
    if (setIsTyping) {
      setIsTyping(false)
    }
    
    // Reset current line state to empty for clean terminal state
    if (setCurrentLine) {
      setCurrentLine('')
    }
    if (setCursorPosition) {
      setCursorPosition(0)
    }
    
    // Add prompt after intro message
    instance.write('$ ')
  }
}
