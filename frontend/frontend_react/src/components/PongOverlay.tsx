import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import { PongGame, MAIN_COLOR } from '../PongGame'
import { TERMINAL_WIDTH, TERMINAL_HEIGHT, BORDER_WIDTH, BORDER_HEIGHT } from './Terminal'
import muiTheme from '../muiTheme'


interface PongOverlayProps {
  isVisible: boolean
  onClose: () => void
  onFocusTerminal?: () => void
}

function PongOverlay({ isVisible, onClose, onFocusTerminal }: PongOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<PongGame | null>(null)

  useEffect(() => {
    if (isVisible && canvasRef.current) {
      const canvas = canvasRef.current
      // Account for the custom borders
      canvas.width = TERMINAL_WIDTH - 2 * BORDER_WIDTH
      canvas.height = TERMINAL_HEIGHT - 2 * BORDER_HEIGHT
      
      // Create and start the game
      gameRef.current = new PongGame(canvas)
      gameRef.current.startGame()
      
      // Focus the canvas to ensure keyboard events work
      canvas.focus()
    }

    // Cleanup when overlay is hidden
    return () => {
      if (gameRef.current) {
        gameRef.current.stop()
        gameRef.current = null
      }
    }
  }, [isVisible])

  // Handle escape key to close overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        onClose()
        // Focus terminal after closing
        setTimeout(() => {
          onFocusTerminal?.()
        }, 0)
      }
    }

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isVisible, onClose, onFocusTerminal])

  if (!isVisible) return null

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}
      onClick={() => {
        onClose()
        setTimeout(() => {
          onFocusTerminal?.()
        }, 0)
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: `${TERMINAL_HEIGHT}px`,
          width: `${TERMINAL_WIDTH}px`,
          border: '1px solid #87ff8755',
          boxShadow: '0 0 200px #87ff8734',
          outlineOffset: '-7.5px',
          outline: `3px solid ${MAIN_COLOR}`,
          borderLeft: `${BORDER_WIDTH}px solid ${MAIN_COLOR}`,
          borderRight: `${BORDER_WIDTH}px solid ${MAIN_COLOR}`,
          borderTop: `${BORDER_HEIGHT}px solid ${MAIN_COLOR}`,
          borderBottom: `${BORDER_HEIGHT}px solid ${MAIN_COLOR}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'block',
            '& canvas': {
              width: '100%',
              height: '100%',
              display: 'block',
              outline: 'none'
            }
          }}
        >
          <canvas
            ref={canvasRef}
            tabIndex={0}
          />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: 5,
            right: 15,
            color: muiTheme.palette.secondary.main,
            fontSize: '10px',
            backgroundColor: 'transparent',
            padding: '5px 10px',
            borderRadius: '4px'
          }}
        >
          Press ESC to exit
        </Box>
      </Box>
    </Box>
  )
}

export default PongOverlay
