import { useEffect, useRef } from 'react'
import { useXTerm } from 'react-xtermjs'
import { Box } from '@mui/material'
import { useAtom } from 'jotai'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { displayViewIntroMessage } from './IntroMessage'
import { createOnDataHandler } from '../terminal/TerminalDataHandler'
import { TerminalThemeSetter } from '../terminal/TerminalThemeSetter'
import PongOverlay from './PongOverlay'
import {
  currentLineAtom,
  cursorPositionAtom,
  terminalActionsAtom,
  pongOverlayVisibleAtom,
  terminalInstanceAtom,
  isTypingAtom
} from '../terminal/TerminalAtoms'

export const TERMINAL_WIDTH = 797;
export const TERMINAL_HEIGHT = 427;
export const BORDER_WIDTH = 7.5;
export const BORDER_HEIGHT = 15;

interface TerminalProps {
  viewType?: 'home' | 'pong' | 'contact';
}

function Terminal({ viewType }: TerminalProps) {
  const { instance, ref } = useXTerm()
  
  // History state atoms
  const [currentLine, setCurrentLine] = useAtom(currentLineAtom)
  const [cursorPosition, setCursorPosition] = useAtom(cursorPositionAtom)
  const [, terminalActions] = useAtom(terminalActionsAtom)

  // Pong overlay state
  const [pongOverlayVisible, setPongOverlayVisible] = useAtom(pongOverlayVisibleAtom)
  
  // Terminal instance atom
  const [, setTerminalInstance] = useAtom(terminalInstanceAtom)
  
  // Typing state atom
  const [isTyping, setIsTyping] = useAtom(isTypingAtom)
  
  // Refs to store current atom values for use in event handlers
  const currentLineRef = useRef(currentLine)
  const cursorPositionRef = useRef(cursorPosition)
  const isTypingRef = useRef(isTyping)
  
  // Update refs when atoms change
  currentLineRef.current = currentLine
  cursorPositionRef.current = cursorPosition
  isTypingRef.current = isTyping

  // Function to focus the terminal
  const focusTerminal = () => {
    if (instance) {
      instance.focus()
    }
  }

  useEffect(() => {
    if (!instance) {
      return
    }

    // Store terminal instance in atom for use by other components
    setTerminalInstance(instance)

    // Create and load the addons
    const webLinksAddon = new WebLinksAddon()
    instance.loadAddon(webLinksAddon)

    // Configure terminal theme
    TerminalThemeSetter(instance)

    // Display intro message - use view-specific if viewType is provided
    if (viewType) {
      displayViewIntroMessage(
        instance,
        viewType,
        setCurrentLine,
        setCursorPosition,
        setIsTyping,
        terminalActions
      )
    }

    // Create the on data handler
    const onData = createOnDataHandler({
      instance,
      currentLineRef,
      cursorPositionRef,
      setCurrentLine,
      setCursorPosition,
      terminalActions,
      setPongOverlayVisible,
      isTypingRef
    })

    // Add onData listener to instance
    instance.onData(onData)

    // Set terminal dimensions manually (columns x rows)
    instance.resize(102, 25)

    // Cleanup function to remove listeners
    return () => {
      webLinksAddon.dispose()
      instance.dispose()
    }
  }, [instance])

  return (
    <Box
      sx={{
        mt: 2,
        height: `${TERMINAL_HEIGHT}px`,
        width: `${TERMINAL_WIDTH}px`,
        border: '1px solid #87ff8755',
        boxShadow: '0 0 200px #87ff8734',
        position: 'relative'
      }}
    >
      <Box ref={ref} sx={{ width: '100%', height: '100%'}} />
      <PongOverlay 
        isVisible={pongOverlayVisible} 
        onClose={() => setPongOverlayVisible(false)}
        onFocusTerminal={focusTerminal}
      />
    </Box>
  )
}

export default Terminal;