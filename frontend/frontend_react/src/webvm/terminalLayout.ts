// Single source of truth for the terminal's geometry/colors - shared by the
// React components and, via vite.config.ts's transformIndexHtml, by
// index.html's loading placeholder, so they can't drift out of sync.
export const TERMINAL_WIDTH = 800
export const TERMINAL_HEIGHT = 427
// CPU/Disk/Reset-Disk footer height below the terminal - measured (~21px
// rendered), not derived, since WebVmFooter has no fixed height.
export const TERMINAL_FOOTER_HEIGHT = 28

export const TERMINAL_BLACK = '#000000'
export const PAGE_BACKGROUND = '#121212'
