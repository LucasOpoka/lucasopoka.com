// Single source of truth for the terminal's on-screen geometry and colors -
// shared by the React components (WebVM.tsx, WebVmEmbed.tsx) and, via
// vite.config.ts's transformIndexHtml, by index.html's loading placeholder,
// so the two can't drift out of sync.
export const TERMINAL_WIDTH = 800
export const TERMINAL_HEIGHT = 427
// Height of the CPU/Disk/Reset-Disk footer below the terminal, inside the
// same iframe. Not derived from the footer's own layout (WebVmFooter has no
// fixed height) - measured (~21px rendered) with a little breathing room.
// If it's ever too small, WebVmFrame sizes to natural content height (no
// minHeight: 100vh), so the footer just visibly clips/scrolls inside the
// terminal box instead of silently pushing the site's real Footer down.
export const TERMINAL_FOOTER_HEIGHT = 28

export const TERMINAL_BLACK = '#000000'
export const PAGE_BACKGROUND = '#121212'
