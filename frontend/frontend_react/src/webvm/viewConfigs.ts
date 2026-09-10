interface ViewConfig {
  directory: string
  asciiArtFile: string
}

export const VIEW_CONFIGS = {
  home: { directory: '/home/user/home', asciiArtFile: 'home' },
  pong: { directory: '/home/user/pong', asciiArtFile: 'pong' },
  contact: { directory: '/home/user/contact', asciiArtFile: 'contact' },
} satisfies Record<string, ViewConfig>

export type ViewName = keyof typeof VIEW_CONFIGS

export const DEFAULT_VIEW: ViewName = 'home'

export function isViewName(value: string | null): value is ViewName {
  return value !== null && Object.hasOwn(VIEW_CONFIGS, value)
}
