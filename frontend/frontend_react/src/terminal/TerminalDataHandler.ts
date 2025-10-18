import { Terminal } from '@xterm/xterm'
import { getCommandHandler } from './TerminalCommandHandlers'

export interface DataHandlerParams {
  instance: Terminal
  currentLineRef: React.RefObject<string>
  cursorPositionRef: React.RefObject<number>
  setCurrentLine: (line: string) => void
  setCursorPosition: (position: number) => void
  terminalActions: (action: { type: string; data: string | undefined }) => void
  setPongOverlayVisible?: (visible: boolean) => void
  isTypingRef: React.RefObject<boolean>
}

export const createOnDataHandler = (params: DataHandlerParams) => {
  const {
    instance,
    currentLineRef,
    cursorPositionRef,
    setCurrentLine,
    setCursorPosition,
    terminalActions,
    setPongOverlayVisible,
    isTypingRef
  } = params

  const CLEAR_LINE = '\r\x1b[2K\r'
  const PROMPT = '$ '


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
    instance.write(`${CLEAR_LINE}${PROMPT}${line}`)
    positionCursor(`${PROMPT}${line}`, cursorPos + PROMPT.length)
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
  const handleEnter = async (data: string) => {
    if (data !== '\r' && data !== '\n') {
      return false
    }
    
    const command = currentLineRef.current.trim()
    if (!command) {
      instance.write('\r\n')
      instance.write(PROMPT)
      return true
    }
    
    if (command.toLowerCase() === 'clear') {
      instance.write(`${CLEAR_LINE}`)
      instance.clear()
      instance.write(PROMPT)
    } else {
      // Parse command and arguments
      const parts = command.trim().split(/\s+/)
      const cmd = parts[0].toLowerCase()
      const args = parts.slice(1)
      
      // Get the appropriate handler (includes unknown command handling)
      const handler = getCommandHandler(cmd)
      await handler({
        instance,
        args,
        setPongOverlayVisible,
        setCurrentLine,
        setCursorPosition
      })
      instance.write(PROMPT)
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

  return async (data: string) => {
    console.log(`Received data: ${data} (length: ${data.length})`)

    // Block user input when typing is in progress
    if (isTypingRef.current) {
      console.log('Input blocked: typing in progress')
      return
    }

    // Handle arrow keys
    if (handleArrowKey(data)) {
      return
    }
      
    // Handle enter key
    if (await handleEnter(data)) {
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
