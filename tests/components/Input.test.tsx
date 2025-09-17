import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input, Select } from '@/components/ui/Input'

describe('Input Components', () => {
  describe('Input', () => {
    it('renders with default classes', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
      )
    })

    it('merges custom className', () => {
      render(<Input className="custom-class" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-class')
      expect(input).toHaveClass('flex h-10 w-full')
    })

    it('handles different input types', () => {
      const { rerender } = render(<Input type="password" data-testid="input" />)
      let input = screen.getByTestId('input')
      expect(input).toHaveAttribute('type', 'password')

      rerender(<Input type="email" data-testid="input" />)
      input = screen.getByTestId('input')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('forwards ref correctly', () => {
      const ref = { current: null }
      render(<Input ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })

    it('handles disabled state', () => {
      render(<Input disabled />)
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
      expect(input).toHaveClass('disabled:cursor-not-allowed disabled:opacity-50')
    })

    it('handles placeholder text', () => {
      render(<Input placeholder="Enter text" />)
      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toBeInTheDocument()
    })

    it('handles value changes', async () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'test value')
      expect(input).toHaveValue('test value')
    })
  })

  describe('Select', () => {
    it('renders with default classes', () => {
      render(<Select />)
      const select = screen.getByRole('combobox')
      expect(select).toHaveClass(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
      )
    })

    it('merges custom className', () => {
      render(<Select className="custom-class" />)
      const select = screen.getByRole('combobox')
      expect(select).toHaveClass('custom-class')
      expect(select).toHaveClass('flex h-10 w-full')
    })

    it('renders with options', () => {
      render(
        <Select>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      )
      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(2)
      expect(options[0]).toHaveValue('1')
      expect(options[1]).toHaveValue('2')
    })

    it('handles disabled state', () => {
      render(<Select disabled />)
      const select = screen.getByRole('combobox')
      expect(select).toBeDisabled()
      expect(select).toHaveClass('disabled:cursor-not-allowed disabled:opacity-50')
    })

    it('handles value changes', async () => {
      render(
        <Select>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      )
      const select = screen.getByRole('combobox')
      await userEvent.selectOptions(select, '2')
      expect(select).toHaveValue('2')
    })
  })
})
