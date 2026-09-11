import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import WebVM from './WebVM'

describe('WebVM', () => {
  it('mounts and unmounts without crashing (CheerpX and react-xtermjs mocked)', () => {
    const { container, unmount } = render(<WebVM view="home" />)
    expect(container.querySelector('div')).toBeTruthy()
    unmount()
  })
})
