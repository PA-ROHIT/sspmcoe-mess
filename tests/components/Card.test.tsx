import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default classes', () => {
      render(<Card>Content</Card>)
      const card = screen.getByText('Content')
      expect(card).toHaveClass('rounded-lg border bg-card text-card-foreground shadow-sm')
    })

    it('merges custom className', () => {
      render(<Card className="custom-class">Content</Card>)
      const card = screen.getByText('Content')
      expect(card).toHaveClass('custom-class')
      expect(card).toHaveClass('rounded-lg')
    })
  })

  describe('CardHeader', () => {
    it('renders title and subtitle', () => {
      render(<CardHeader title="Test Title" subtitle="Test Subtitle" />)
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
    })

    it('renders only title when no subtitle provided', () => {
      render(<CardHeader title="Test Title" />)
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument()
    })

    it('applies correct classes', () => {
      render(<CardHeader title="Test Title" className="custom-class" />)
      const header = screen.getByText('Test Title').parentElement
      expect(header).toHaveClass('flex flex-col space-y-1.5 p-6 custom-class')
    })
  })

  describe('CardTitle', () => {
    it('renders content with correct classes', () => {
      render(<CardTitle>Test Title</CardTitle>)
      const title = screen.getByText('Test Title')
      expect(title).toHaveClass('text-2xl font-semibold leading-none tracking-tight')
    })
  })

  describe('CardDescription', () => {
    it('renders content with correct classes', () => {
      render(<CardDescription>Test Description</CardDescription>)
      const description = screen.getByText('Test Description')
      expect(description).toHaveClass('text-sm text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('renders content with correct classes', () => {
      render(<CardContent data-testid="content">Test Content</CardContent>)
      const content = screen.getByTestId('content')
      expect(content).toHaveClass('p-6 pt-0')
    })
  })

  describe('CardFooter', () => {
    it('renders content with correct classes', () => {
      render(<CardFooter data-testid="footer">Test Footer</CardFooter>)
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveClass('flex items-center p-6 pt-0')
    })
  })

  describe('Component Integration', () => {
    it('renders a complete card structure', () => {
      render(
        <Card>
          <CardHeader title="Card Title" subtitle="Card Subtitle" />
          <CardContent>Card Content</CardContent>
          <CardFooter>Card Footer</CardFooter>
        </Card>
      )

      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card Subtitle')).toBeInTheDocument()
      expect(screen.getByText('Card Content')).toBeInTheDocument()
      expect(screen.getByText('Card Footer')).toBeInTheDocument()
    })
  })
})