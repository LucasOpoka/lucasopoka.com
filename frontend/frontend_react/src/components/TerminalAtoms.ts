import { atom } from 'jotai'
import type { Terminal } from '@xterm/xterm'

// Terminal instance atom

/**
 * Atom that stores the terminal instance.
 * This allows other components to access the terminal instance for operations
 * like writing text, clearing the screen, or managing terminal state.
 */
export const terminalInstanceAtom = atom<Terminal | null>(null)

// History state atoms

/**
 * Atom that stores the current command line being typed by the user.
 * This represents the text that appears in the terminal input field.
 * 
 */
export const currentLineAtom = atom<string>('')

/**
 * Atom that stores the array of previously executed commands.
 * Each command is stored as a string in chronological order.
 * Used for command history navigation with arrow keys.
 * 
 */
export const commandHistoryArrayAtom = atom<string[]>([])

/**
 * Atom that tracks the current position in the command history.
 * -1 indicates we're at the bottom (no history navigation active)
 * 0+ indicates the index of the currently selected history item
 *
 */
export const historyIndexAtom = atom<number>(-1)

/**
 * Atom that stores the cursor position within the current command line.
 * Used to track where the text cursor should be positioned.
 * 
 */
export const cursorPositionAtom = atom<number>(0)

// Default commands definition

/**
 * Default set of commands available in the terminal.
 * Each command is a function that takes an array of arguments and returns a string response.
 */
export const defaultCommands = {
  'hello': () => 'Hello World!',
  'help': () => {return `Available commands: hello, help, clear, echo, whoami, pwd, pong, exit`},
  'clear': () => 'clear',
  'echo': (args: string[]) => args.join(' '),
  'whoami': () => 'lucas',
  'pwd': () => '/home/lucas',
  'pong': () => 'pong',
  'exit': () => 'Goodbye!',
}

/**
 * Atom that stores the available commands for the terminal.
 * This is a writable atom that can be updated to add or modify commands.
 * Initially set to the defaultCommands object.
 */
export const availableCommandsAtom = atom<{ [key: string]: (args: string[]) => string }>(defaultCommands)

// Pong overlay state atom

/**
 * When true, the pong game canvas is displayed over the terminal.
 */
export const pongOverlayVisibleAtom = atom<boolean>(false)


// History state action atoms

/**
 * Write-only atom that handles all terminal actions.
 * 
 * @param action - The action to perform
 * @param action.type - The type of action to perform
 * @param action.data - Optional data for the action
 */
export const terminalActionsAtom = atom(
  null,
  (get, set, action: { type: string; data?: string | undefined }) => {
    switch (action.type) {
    case 'addToHistory':
      if (action.data && action.data.trim()) {
        const currentHistory = get(commandHistoryArrayAtom)
        set(commandHistoryArrayAtom, [...currentHistory, action.data])
        set(historyIndexAtom, -1)
        set(currentLineAtom, '')
      }
      break
    case 'navigateHistory': {
      const history = get(commandHistoryArrayAtom)
      const currentIndex = get(historyIndexAtom)
      let newIndex = currentIndex
      
      if (action.data === 'up') {
        if (currentIndex === -1) {
          newIndex = history.length - 1
        } else if (currentIndex > 0) {
          newIndex = currentIndex - 1
        }
      } else if (action.data === 'down') {
        if (currentIndex === -1) {
          return // Already at bottom
        } else if (currentIndex < history.length - 1) {
          newIndex = currentIndex + 1
        } else {
          newIndex = -1
        }
      }
      
      set(historyIndexAtom, newIndex)
      
      if (newIndex === -1) {
        set(currentLineAtom, '')
        set(cursorPositionAtom, 0)
      } else {
        set(currentLineAtom, history[newIndex])
        set(cursorPositionAtom, history[newIndex].length)
      }
      break
    }
    case 'resetAfterExecution':
      set(historyIndexAtom, -1)
      set(currentLineAtom, '')
      set(cursorPositionAtom, 0)
      break
    }
  }
)

