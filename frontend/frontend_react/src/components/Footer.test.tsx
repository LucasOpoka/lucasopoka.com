import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the github link', () => {
    render(<Footer />)
    expect(
      screen.getByRole('link', { name: /github.com\/lucasopoka/i }),
    ).toHaveAttribute('href', 'https://github.com/lucasopoka')
  })
})
