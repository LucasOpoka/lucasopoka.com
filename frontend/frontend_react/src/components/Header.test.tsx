import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'

describe('Header', () => {
  it('renders all navigation links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )
    expect(screen.getByText('home')).toBeInTheDocument()
    expect(screen.getByText('pong')).toBeInTheDocument()
    expect(screen.getByText('contact')).toBeInTheDocument()
  })
})
