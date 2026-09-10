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

// Embeds the WebVM terminal for one view in its own same-origin iframe, so
// that navigating between views can swap out the underlying VM by letting
// the browser unmount/navigate the iframe rather than us tearing down a live
// CheerpX instance in-process (see WebVmFrame for why that matters).
export default function WebVmEmbed({ view }: WebVmEmbedProps) {
  return (
    <Box sx={{ position: 'relative', mt: 2, width: `${TERMINAL_WIDTH}px` }}>
      {/*
        The terminal's border/glow are drawn here, in the parent document,
        rather than on the terminal itself inside the iframe: an iframe
        always clips its own content to its border box (overflow can't be
        un-clipped), so a glow that needs to bleed outward has to come from
        outside it. This overlay is sized to the terminal only (not the
        taller iframe, which also holds the CPU/Disk footer below it) so the
        frame hugs just the terminal, matching the pre-iframe layout.
      */}
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
          // Terminal's own black (TerminalThemeSetter) for exactly the
          // terminal's height, then the site's background below it (matching
          // the footer) - so this placeholder, visible before the embedded
          // document has painted anything, doesn't stand taller than the
          // terminal it's standing in for.
          background: `linear-gradient(to bottom, ${TERMINAL_BLACK} 0, ${TERMINAL_BLACK} ${TERMINAL_HEIGHT}px, ${PAGE_BACKGROUND} ${TERMINAL_HEIGHT}px, ${PAGE_BACKGROUND} 100%)`,
        }}
      />
    </Box>
  )
}
