import { Terminal } from '@xterm/xterm'
import { executeCommand } from './XTermCommandExecute'

export interface XTermDataHandlerParams {
  instance: Terminal
  currentLineRef: React.RefObject<string>
  cursorPositionRef: React.RefObject<number>
  setCurrentLine: (line: string) => void
  setCursorPosition: (position: number) => void
  terminalActions: (action: { type: string; data: string | undefined }) => void
  availableCommands: Record<string, (args: string[]) => string>
  setPongOverlayVisible?: (visible: boolean) => void
}

export const createOnDataHandler = (params: XTermDataHandlerParams) => {
  const {
    instance,
    currentLineRef,
    cursorPositionRef,
    setCurrentLine,
    setCursorPosition,
    terminalActions,
    availableCommands,
    setPongOverlayVisible
  } = params

  const CLEAR_LINE = '\r\x1b[2K\r'


  // Helper function to position cursor correctly
  const positionCursor = (line: string, cursorPos: number) => {
    if (cursorPos < line.length) {
      const moveBack = line.length - cursorPos
      instance.write(`\x1b[${moveBack}D`)
    }
  }


  // Helper function to move cursor directly without redrawing the line
  const moveCursorDirectly = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      instance.write('\x1b[D')
    } else {
      instance.write('\x1b[C')
    }
  }


  // Helper function to redraw line and position cursor
  const redrawLineWithCursor = (line: string, cursorPos: number) => {
    instance.write(`${CLEAR_LINE}${line}`)
    positionCursor(line, cursorPos)
  }


  // Helper function to handle arrow key navigation
  const handleArrowKey = (data: string) => {
    const arrowKeys = {
      up: ['\x1b[A', '\x1b[1;2A', '\x1b[1;5A'],
      down: ['\x1b[B', '\x1b[1;2B', '\x1b[1;5B'],
      left: ['\x1b[D', '\x1b[1;2D', '\x1b[1;5D'],
      right: ['\x1b[C', '\x1b[1;2C', '\x1b[1;5C']
    }

    for (const [direction, sequences] of Object.entries(arrowKeys)) {
      if (sequences.includes(data)) {
        if (direction === 'up' || direction === 'down') {
          terminalActions({ type: 'navigateHistory', data: direction })
          setTimeout(() => {
            redrawLineWithCursor(currentLineRef.current, cursorPositionRef.current)
          }, 0)
        } else if (direction === 'right' && cursorPositionRef.current < currentLineRef.current.length) {
          const newCursorPos = cursorPositionRef.current + 1
          setCursorPosition(newCursorPos)
          moveCursorDirectly('right')
        } else if (direction === 'left' && cursorPositionRef.current > 0) {
          const newCursorPos = cursorPositionRef.current - 1
          setCursorPosition(newCursorPos)
          moveCursorDirectly('left')
        }
        return true
      }
    }
    return false
  }


  // Helper function to execute commands
  const handleEnter = (data: string) => {
    if (data !== '\r' && data !== '\n') {
      return false
    }
    
    const command = currentLineRef.current.trim()
    if (!command) {
      instance.write('\r\n')
      return true
    }
    
    if (command.toLowerCase() === 'clear') {
      instance.write(`${CLEAR_LINE}`)
      instance.clear()
    } else if (command.toLowerCase() === 'pong' && setPongOverlayVisible) {
      setPongOverlayVisible(true)
      instance.write('\r\n')
    } else {
      const result = executeCommand(command, availableCommands)
      if (result) {
        instance.write('\r\n' + result + '\r\n')
      }
    }
    terminalActions({ type: 'addToHistory', data: command })
    terminalActions({ type: 'resetAfterExecution', data: undefined })
    return true
  }


  // Helper function to handle delete
  const handleDelete = (data: string) => {
    if (data !== '\x7f' && data !== '\b') {
      return false
    }

    const currentLine = currentLineRef.current
    const cursorPos = cursorPositionRef.current
    
    if (cursorPos > 0) {
      const newLine = currentLine.slice(0, cursorPos - 1) + currentLine.slice(cursorPos)
      const newCursorPos = cursorPos - 1
      
      setCurrentLine(newLine)
      setCursorPosition(newCursorPos)
      
      if (cursorPos === currentLine.length) {
        instance.write('\b \b')
      } else {
        const remainingText = newLine.slice(newCursorPos)
        instance.write(`\b${remainingText} \x1b[${remainingText.length + 1}D`)
      }
    }
    
    return true
  }


  // Helper function to handle character insertion
  const handleCharacterInput = (data: string) => {
    if (data.length !== 1 || data < ' ') {
      return false
    }

    const currentLine = currentLineRef.current
    const cursorPos = cursorPositionRef.current
    
    const newLine = currentLine.slice(0, cursorPos) + data + currentLine.slice(cursorPos)
    const isAtEnd = cursorPos === currentLine.length
    
    // Update state
    setCurrentLine(newLine)
    setCursorPosition(cursorPos + 1)
    
    if (isAtEnd) {
      // Simple case: just write the character
      instance.write(data)
    } else {
      // Complex case: insert in middle, need to redraw from cursor position
      const remainingText = newLine.slice(cursorPos + 1)
      instance.write(`${data}${remainingText} \x1b[${remainingText.length + 1}D`)
    }
    
    return true
  }

  return (data: string) => {
    console.log(`Received data: ${data} (length: ${data.length})`)

    // Handle arrow keys
    if (handleArrowKey(data)) {
      return
    }
      
    // Handle enter key
    if (handleEnter(data)) {
      return
    }
    
    // Handle delete
    if (handleDelete(data)) {
      return
    }
    
    // Handle regular character input
    if (handleCharacterInput(data)) {
      return
    }
    
    // Let the terminal handle other input naturally
    instance.write(data)
  }
}
