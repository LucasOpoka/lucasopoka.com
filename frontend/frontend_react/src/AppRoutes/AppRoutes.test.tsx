import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('AppRoutes', () => {
  it('renders the home view at /', () => {
    renderAt('/')
    expect(document.title).toBe('home')
    expect(screen.getByText(/Hi there, my name is Lucas/)).toBeInTheDocument()
  })

  it('renders the pong view at /pong', () => {
    renderAt('/pong')
    expect(document.title).toBe('pong')
    expect(
      screen.getByText(/Please enjoy a session of Pong/),
    ).toBeInTheDocument()
  })

  it('renders the contact view at /contact', () => {
    renderAt('/contact')
    expect(document.title).toBe('contact')
    expect(screen.getByText(/please do reach out/)).toBeInTheDocument()
  })

  it('redirects unknown routes to home', () => {
    renderAt('/this-route-does-not-exist')
    expect(document.title).toBe('home')
  })
})
