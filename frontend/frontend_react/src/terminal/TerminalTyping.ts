import { Terminal } from '@xterm/xterm'

export interface TypingOptions {
  /** Delay between characters in milliseconds (default: 50) */
  delay?: number
  /** Whether to type line by line instead of character by character (default: false) */
  lineByLine?: boolean
}

export interface TypingProgress {
  /** Current character being typed */
  currentChar: string
  /** Index of current character */
  currentIndex: number
  /** Total characters to type */
  totalChars: number
  /** Whether typing is complete */
  isComplete: boolean
}

export type TypingCallback = (progress: TypingProgress) => void

/**
 * Converts bracket-style escape sequences to proper ANSI escape sequences
 * @param text - The text containing bracket sequences like [0m, [38;5;223m
 * @returns The text with converted escape sequences
 */
function convertBracketSequences(text: string): string {
  // Replace standalone bracket sequences with proper escape sequences
  return text.replace(/\[([0-9;:]*[a-zA-Z])/g, '\x1b[$1')
}

/**
 * Types text character by character or line to the terminal
 *
 * @param terminal - The xterm terminal instance
 * @param text - The text to type (can include escape sequences like \x1b[31m for red text)
 * @param options - Optional typing behavior options (uses defaults if not provided)
 * @param onProgress - Optional callback for typing progress
 * @param setCurrentLine - Optional function to update the current line state
 * @param setCursorPosition - Optional function to update the cursor position state
 * @param setIsTyping - Optional function to update the typing state
 * @param getCurrentLine - Optional function to get the current line content
 * @returns Promise that resolves when typing is complete
 */
export async function typeToTerminal(
  terminal: Terminal,
  text: string,
  options?: TypingOptions,
  onProgress?: TypingCallback,
  setCurrentLine?: (line: string) => void,
  setCursorPosition?: (position: number) => void,
  setIsTyping?: (typing: boolean) => void,
  getCurrentLine?: () => string
): Promise<void> {
  // Default options
  const defaultOptions: Required<TypingOptions> = {
    delay: 50,
    lineByLine: false
  }

  // Merge provided options with defaults
  const {
    delay,
    lineByLine
  } = { ...defaultOptions, ...options }


  // Convert bracket sequences to proper escape sequences
  const convertedText = convertBracketSequences(text)

  // Focus the terminal before starting to type
  terminal.focus()
  
  // Set typing state to true
  if (setIsTyping) {
    setIsTyping(true)
  }
  
  // Start with existing current line content if available
  let currentLine = getCurrentLine ? getCurrentLine() : ''
  
  try {
    // Handle line-by-line typing
    if (lineByLine) {
      const lines = convertedText.split(/\r?\n/)
      
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex]
        
        // Update current line state
        currentLine = line
        
        // Update state atoms if provided
        if (setCurrentLine) {
          setCurrentLine(currentLine)
        }
        if (setCursorPosition) {
          setCursorPosition(currentLine.length)
        }
        
        // Write the entire line at once
        terminal.write(line)
        
        // Call progress callback if provided
        if (onProgress) {
          onProgress({
            currentChar: line,
            currentIndex: lineIndex,
            totalChars: lines.length,
            isComplete: lineIndex === lines.length - 1
          })
        }
        
        // Add newline if not the last line
        if (lineIndex < lines.length - 1) {
          terminal.write('\n')
          terminal.write('\r') // Move cursor to start of next line
          
          // Reset current line for new line
          currentLine = ''
          if (setCurrentLine) {
            setCurrentLine(currentLine)
          }
          if (setCursorPosition) {
            setCursorPosition(0)
          }
        }
        
        // Wait between lines (except for the last line)
        if (lineIndex < lines.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
      
      return // Exit early for line-by-line mode
    }
    
    // Character-by-character typing (existing logic)
    for (let i = 0; i < convertedText.length; i++) {
      const char = convertedText[i]
      
      // Handle escape sequences
      if (char === '\x1b') {
        // Find the end of the escape sequence
        let escapeEnd = i + 1
        while (escapeEnd < convertedText.length && 
               convertedText[escapeEnd] >= '\x40' && convertedText[escapeEnd] <= '\x7e' && 
               convertedText[escapeEnd] !== '\x1b') {
          escapeEnd++
        }
        
        // Extract the complete escape sequence
        const escapeSequence = convertedText.slice(i, escapeEnd + 1)
        
        // Write the escape sequence directly to terminal
        terminal.write(escapeSequence)
        
        // Update index to skip processed characters
        i = escapeEnd
        
        // Don't update currentLine for escape sequences
        continue
      }
      
      
      // Handle newlines specially
      if (char === '\n' || char === '\r') {
        // Reset current line for newlines
        currentLine = ''
        
        // Update state atoms if provided
        if (setCurrentLine) {
          setCurrentLine(currentLine)
        }
        if (setCursorPosition) {
          setCursorPosition(0)
        }
        
        // Write the newline character
        terminal.write(char)
        terminal.write('\r')
      } else {
        // Update the current line state for regular characters
        currentLine += char
        
        // Update state atoms if provided
        if (setCurrentLine) {
          setCurrentLine(currentLine)
        }
        if (setCursorPosition) {
          setCursorPosition(currentLine.length)
        }
        
        // Write the character to the terminal
        terminal.write(char)
      }
      
      // Call progress callback if provided
      if (onProgress) {
        onProgress({
          currentChar: char,
          currentIndex: i,
          totalChars: convertedText.length,
          isComplete: i === convertedText.length - 1
        })
      }

      // Wait before typing next character
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  } finally {
    // Reset typing state when done
    if (setIsTyping) {
      setIsTyping(false)
    }
  }
}

