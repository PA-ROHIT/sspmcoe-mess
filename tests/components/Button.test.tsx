import { describe, it, expect, vi } from &apos;vitest&apos;
import { render, screen } from &apos;@testing-library/react&apos;
import userEvent from &apos;@testing-library/user-event&apos;
import { Button } from &apos;@/components/ui/Button&apos;

describe(&apos;Button&apos;, () => {
  it(&apos;renders children correctly&apos;, () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole(&apos;button&apos;, { name: &apos;Click me&apos; })).toBeInTheDocument()
  })

  it(&apos;applies variant classes correctly&apos;, () => {
    const { rerender } = render(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole(&apos;button&apos;, { name: &apos;Destructive&apos; })).toHaveClass(&apos;bg-destructive&apos;)

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole(&apos;button&apos;, { name: &apos;Outline&apos; })).toHaveClass(&apos;border-input&apos;)
  })

  it(&apos;applies size classes correctly&apos;, () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole(&apos;button&apos;, { name: &apos;Small&apos; })).toHaveClass(&apos;h-9&apos;)

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole(&apos;button&apos;, { name: &apos;Large&apos; })).toHaveClass(&apos;h-11&apos;)
  })

  it(&apos;shows loading state correctly&apos;, () => {
    render(<Button isLoading>Loading</Button>)
    const button = screen.getByRole(&apos;button&apos;, { name: /loading/i })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
    const spinner = document.querySelector(&apos;.animate-spin&apos;)
    expect(spinner).toBeInTheDocument()
    expect(spinner?.parentElement).toHaveClass(&apos;flex items-center gap-2&apos;)
  })

  it(&apos;forwards ref correctly&apos;, () => {
    const ref = { current: null }
    render(<Button ref={ref}>Ref Test</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it(&apos;handles click events&apos;, async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByRole(&apos;button&apos;, { name: &apos;Click me&apos; }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it(&apos;disables click events when loading&apos;, async () => {
    const handleClick = vi.fn()
    render(<Button isLoading onClick={handleClick}>Loading</Button>)
    
    await userEvent.click(screen.getByRole(&apos;button&apos;, { name: /loading/i }))
    expect(handleClick).not.toHaveBeenCalled()
  })
})