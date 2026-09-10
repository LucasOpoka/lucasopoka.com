import { Box } from '@mui/material'
import type { ViewName } from '../viewConfigs'
import {
  TERMINAL_WIDTH,
  TERMINAL_HEIGHT,
  TERMINAL_FOOTER_HEIGHT,
  TERMINAL_BLACK,
  PAGE_BACKGROUND,
} from '../terminalLayout'

interface WebVmEmbedProps {
  view: ViewName
}

// Embeds the WebVM terminal in its own same-origin iframe, so navigating
// between views can swap the VM by navigating the iframe instead of tearing
// down a live CheerpX instance in-process (see WebVmFrame).
export default function WebVmEmbed({ view }: WebVmEmbedProps) {
  return (
    <Box sx={{ position: 'relative', mt: 2, width: `${TERMINAL_WIDTH}px` }}>
      {/* Border/glow drawn in the parent doc, not the iframe, since an
        iframe always clips content to its border box. Sized to just the
        terminal, matching the pre-iframe layout. */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${TERMINAL_WIDTH}px`,
          height: `${TERMINAL_HEIGHT}px`,
          border: '1px solid #87ff8755',
          boxShadow: '0 0 200px #87ff8734',
          pointerEvents: 'none',
        }}
      />
      <Box
        component="iframe"
        title={`WebVM - ${view}`}
        src={`/webvm-frame?view=${view}`}
        sx={{
          display: 'block',
          border: 'none',
          width: `${TERMINAL_WIDTH}px`,
          height: `${TERMINAL_HEIGHT + TERMINAL_FOOTER_HEIGHT}px`,
          // Terminal black for exactly TERMINAL_HEIGHT, then the page
          // background below - so this pre-paint placeholder doesn't stand
          // taller than the terminal it's standing in for.
          background: `linear-gradient(to bottom, ${TERMINAL_BLACK} 0, ${TERMINAL_BLACK} ${TERMINAL_HEIGHT}px, ${PAGE_BACKGROUND} ${TERMINAL_HEIGHT}px, ${PAGE_BACKGROUND} 100%)`,
        }}
      />
    </Box>
  )
}
