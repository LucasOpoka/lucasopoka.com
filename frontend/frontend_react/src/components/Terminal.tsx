import { useEffect, useRef } from 'react'
import { useXTerm } from 'react-xtermjs'
import { Box } from '@mui/material'
import { useAtom } from 'jotai'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { displayIntroMessage } from './IntroMessage'
import { createOnDataHandler } from '../terminal/TerminalDataHandler'
import { TerminalThemeSetter } from '../terminal/TerminalThemeSetter'
import PongOverlay from './PongOverlay'
import {
  currentLineAtom,
  cursorPositionAtom,
  terminalActionsAtom,
  availableCommandsAtom,
  defaultCommands,
  pongOverlayVisibleAtom
} from '../terminal/TerminalAtoms'

export const TERMINAL_WIDTH = 797;
export const TERMINAL_HEIGHT = 427;
export const BORDER_WIDTH = 7.5;
export const BORDER_HEIGHT = 15;

function Terminal() {
  const { instance, ref } = useXTerm()
  
  // History state atoms
  const [currentLine, setCurrentLine] = useAtom(currentLineAtom)
  const [cursorPosition, setCursorPosition] = useAtom(cursorPositionAtom)
  const [, terminalActions] = useAtom(terminalActionsAtom)
  
  // Available commands atoms
  const [availableCommands, setAvailableCommands] = useAtom(availableCommandsAtom)
  
  // Pong overlay state
  const [pongOverlayVisible, setPongOverlayVisible] = useAtom(pongOverlayVisibleAtom)
  
  // Refs to store current atom values for use in event handlers
  const currentLineRef = useRef(currentLine)
  const cursorPositionRef = useRef(cursorPosition)
  
  // Update refs when atoms change
  currentLineRef.current = currentLine
  cursorPositionRef.current = cursorPosition

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

    // Create and load the addons
    const webLinksAddon = new WebLinksAddon()
    instance.loadAddon(webLinksAddon)

    // Set default commands
    setAvailableCommands(defaultCommands)

    // Configure terminal theme
    TerminalThemeSetter(instance)

    // Display intro message
    displayIntroMessage(instance)

    // Create the on data handler
    const onData = createOnDataHandler({
      instance,
      currentLineRef,
      cursorPositionRef,
      setCurrentLine,
      setCursorPosition,
      terminalActions,
      availableCommands,
      setPongOverlayVisible
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