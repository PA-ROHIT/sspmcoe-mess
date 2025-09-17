import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole('button', { name: 'Destructive' })).toHaveClass('bg-destructive')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button', { name: 'Outline' })).toHaveClass('border-input')
  })

  it('applies size classes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button', { name: 'Small' })).toHaveClass('h-9')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button', { name: 'Large' })).toHaveClass('h-11')
  })

  it('shows loading state correctly', () => {
    render(<Button isLoading>Loading</Button>)
    const button = screen.getByRole('button', { name: /loading/i })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
    expect(spinner?.parentElement).toHaveClass('flex items-center gap-2')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Button ref={ref}>Ref Test</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByRole('button', { name: 'Click me' }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disables click events when loading', async () => {
    const handleClick = vi.fn()
    render(<Button isLoading onClick={handleClick}>Loading</Button>)
    
    await userEvent.click(screen.getByRole('button', { name: /loading/i }))
    expect(handleClick).not.toHaveBeenCalled()
  })
})