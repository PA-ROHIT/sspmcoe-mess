import { describe, it, expect } from &apos;vitest&apos;
import { render, screen } from &apos;@testing-library/react&apos;
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from &apos;@/components/ui/Card&apos;

describe(&apos;Card Components&apos;, () => {
  describe(&apos;Card&apos;, () => {
    it(&apos;renders with default classes&apos;, () => {
      render(<Card>Content</Card>)
      const card = screen.getByText(&apos;Content&apos;)
      expect(card).toHaveClass(&apos;rounded-lg border bg-card text-card-foreground shadow-sm&apos;)
    })

    it(&apos;merges custom className&apos;, () => {
      render(<Card className="custom-class">Content</Card>)
      const card = screen.getByText(&apos;Content&apos;)
      expect(card).toHaveClass(&apos;custom-class&apos;)
      expect(card).toHaveClass(&apos;rounded-lg&apos;)
    })
  })

  describe(&apos;CardHeader&apos;, () => {
    it(&apos;renders title and subtitle&apos;, () => {
      render(<CardHeader title="Test Title" subtitle="Test Subtitle" />)
      expect(screen.getByText(&apos;Test Title&apos;)).toBeInTheDocument()
      expect(screen.getByText(&apos;Test Subtitle&apos;)).toBeInTheDocument()
    })

    it(&apos;renders only title when no subtitle provided&apos;, () => {
      render(<CardHeader title="Test Title" />)
      expect(screen.getByText(&apos;Test Title&apos;)).toBeInTheDocument()
      expect(screen.queryByText(&apos;Test Subtitle&apos;)).not.toBeInTheDocument()
    })

    it(&apos;applies correct classes&apos;, () => {
      render(<CardHeader title="Test Title" className="custom-class" />)
      const header = screen.getByText(&apos;Test Title&apos;).parentElement
      expect(header).toHaveClass(&apos;flex flex-col space-y-1.5 p-6 custom-class&apos;)
    })
  })

  describe(&apos;CardTitle&apos;, () => {
    it(&apos;renders content with correct classes&apos;, () => {
      render(<CardTitle>Test Title</CardTitle>)
      const title = screen.getByText(&apos;Test Title&apos;)
      expect(title).toHaveClass(&apos;text-2xl font-semibold leading-none tracking-tight&apos;)
    })
  })

  describe(&apos;CardDescription&apos;, () => {
    it(&apos;renders content with correct classes&apos;, () => {
      render(<CardDescription>Test Description</CardDescription>)
      const description = screen.getByText(&apos;Test Description&apos;)
      expect(description).toHaveClass(&apos;text-sm text-muted-foreground&apos;)
    })
  })

  describe(&apos;CardContent&apos;, () => {
    it(&apos;renders content with correct classes&apos;, () => {
      render(<CardContent data-testid="content">Test Content</CardContent>)
      const content = screen.getByTestId(&apos;content&apos;)
      expect(content).toHaveClass(&apos;p-6 pt-0&apos;)
    })
  })

  describe(&apos;CardFooter&apos;, () => {
    it(&apos;renders content with correct classes&apos;, () => {
      render(<CardFooter data-testid="footer">Test Footer</CardFooter>)
      const footer = screen.getByTestId(&apos;footer&apos;)
      expect(footer).toHaveClass(&apos;flex items-center p-6 pt-0&apos;)
    })
  })

  describe(&apos;Component Integration&apos;, () => {
    it(&apos;renders a complete card structure&apos;, () => {
      render(
        <Card>
          <CardHeader title="Card Title" subtitle="Card Subtitle" />
          <CardContent>Card Content</CardContent>
          <CardFooter>Card Footer</CardFooter>
        </Card>
      )

      expect(screen.getByText(&apos;Card Title&apos;)).toBeInTheDocument()
      expect(screen.getByText(&apos;Card Subtitle&apos;)).toBeInTheDocument()
      expect(screen.getByText(&apos;Card Content&apos;)).toBeInTheDocument()
      expect(screen.getByText(&apos;Card Footer&apos;)).toBeInTheDocument()
    })
  })
})