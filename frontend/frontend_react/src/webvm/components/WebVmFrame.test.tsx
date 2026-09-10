import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import WebVmFrame from './WebVmFrame'

// WebVmFrame's only real job is resolving `?view=` into a valid ViewName -
// stub out the actual terminal so these tests exercise just that resolution,
// not CheerpX/react-xtermjs (already covered by WebVM.test.tsx).
vi.mock('./WebVM', () => ({
  default: ({ view }: { view: string }) => (
    <div data-testid="webvm" data-view={view} />
  ),
}))

function renderAt(search: string) {
  return render(
    <MemoryRouter initialEntries={[`/webvm-frame${search}`]}>
      <WebVmFrame />
    </MemoryRouter>,
  )
}

describe('WebVmFrame', () => {
  it('resolves a valid ?view= to that view', () => {
    renderAt('?view=pong')
    expect(screen.getByTestId('webvm')).toHaveAttribute('data-view', 'pong')
  })

  it('falls back to the default view when ?view= is missing', () => {
    renderAt('')
    expect(screen.getByTestId('webvm')).toHaveAttribute('data-view', 'home')
  })

  it('falls back to the default view when ?view= is not a real view name', () => {
    renderAt('?view=does-not-exist')
    expect(screen.getByTestId('webvm')).toHaveAttribute('data-view', 'home')
  })
})
