import { useEffect, useRef } from 'react'
import { useXTerm } from 'react-xtermjs'
import { Box } from '@mui/material'
import { useAtom } from 'jotai'
import { WebglAddon } from '@xterm/addon-webgl';
import { WebLinksAddon } from '@xterm/addon-web-links'
import { displayIntroMessage } from './IntroMessage'
import { createOnDataHandler } from './XTermDataHandler'
import { XTermThemeSetter } from './XTermThemeSetter'
import {
  currentLineAtom,
  cursorPositionAtom,
  terminalActionsAtom,
  availableCommandsAtom,
  defaultCommands
} from './XTermAtoms'


function XTerm() {
  const { instance, ref } = useXTerm()
  
  // History state atoms
  const [currentLine, setCurrentLine] = useAtom(currentLineAtom)
  const [cursorPosition, setCursorPosition] = useAtom(cursorPositionAtom)
  const [, terminalActions] = useAtom(terminalActionsAtom)
  
  // Available commands atoms
  const [availableCommands, setAvailableCommands] = useAtom(availableCommandsAtom)
  
  // Refs to store current atom values for use in event handlers
  const currentLineRef = useRef(currentLine)
  const cursorPositionRef = useRef(cursorPosition)
  
  // Update refs when atoms change
  currentLineRef.current = currentLine
  cursorPositionRef.current = cursorPosition


  useEffect(() => {
    if (!instance) {
      return
    }

    // Create and load the addons
    const webLinksAddon = new WebLinksAddon()
    const webglAddon = new WebglAddon()
    instance.loadAddon(webLinksAddon)
    instance.loadAddon(webglAddon)

    // Set default commands
    setAvailableCommands(defaultCommands)

    // Configure terminal theme
    XTermThemeSetter(instance)

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
      availableCommands
    })

    // Add onData listener to instance
    instance.onData(onData)

    // Set terminal dimensions manually (columns x rows)
    instance.resize(106, 25)

    // Cleanup function to remove listeners
    return () => {
      webLinksAddon.dispose()
      webglAddon.dispose()
      instance.dispose()
    }
  }, [instance])

  return <Box ref={ref} sx={{ width: '100%', height: '100%'}} />
}

export default XTerm;