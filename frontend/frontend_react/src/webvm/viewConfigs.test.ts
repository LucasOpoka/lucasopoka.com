import { describe, it, expect } from 'vitest'
import { VIEW_CONFIGS, DEFAULT_VIEW, isViewName } from './viewConfigs'

describe('isViewName', () => {
  it('accepts every real view name', () => {
    for (const name of Object.keys(VIEW_CONFIGS)) {
      expect(isViewName(name)).toBe(true)
    }
  })

  it('rejects an unknown string', () => {
    expect(isViewName('does-not-exist')).toBe(false)
  })

  it('rejects null', () => {
    expect(isViewName(null)).toBe(false)
  })

  it('rejects the empty string', () => {
    expect(isViewName('')).toBe(false)
  })
})

describe('DEFAULT_VIEW', () => {
  it('is itself a valid view name', () => {
    expect(isViewName(DEFAULT_VIEW)).toBe(true)
  })
})
