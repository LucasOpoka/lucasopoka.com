import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import WebVM from './WebVM'

describe('WebVM', () => {
  it('mounts and unmounts without crashing (CheerpX and react-xtermjs mocked)', () => {
    const { container, unmount } = render(
      <MemoryRouter>
        <WebVM />
      </MemoryRouter>,
    )
    expect(container.querySelector('div')).toBeTruthy()
    unmount()
  })
})
