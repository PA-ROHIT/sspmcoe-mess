import { describe, it, expect } from &apos;vitest&apos;
import { render, screen } from &apos;@testing-library/react&apos;
import userEvent from &apos;@testing-library/user-event&apos;
import { Input, Select } from &apos;@/components/ui/Input&apos;

describe(&apos;Input Components&apos;, () => {
  describe(&apos;Input&apos;, () => {
    it(&apos;renders with default classes&apos;, () => {
      render(<Input />)
      const input = screen.getByRole(&apos;textbox&apos;)
      expect(input).toHaveClass(
        &apos;flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background&apos;
      )
    })

    it(&apos;merges custom className&apos;, () => {
      render(<Input className="custom-class" />)
      const input = screen.getByRole(&apos;textbox&apos;)
      expect(input).toHaveClass(&apos;custom-class&apos;)
      expect(input).toHaveClass(&apos;flex h-10 w-full&apos;)
    })

    it(&apos;handles different input types&apos;, () => {
      const { rerender } = render(<Input type="password" data-testid="input" />)
      let input = screen.getByTestId(&apos;input&apos;)
      expect(input).toHaveAttribute(&apos;type&apos;, &apos;password&apos;)

      rerender(<Input type="email" data-testid="input" />)
      input = screen.getByTestId(&apos;input&apos;)
      expect(input).toHaveAttribute(&apos;type&apos;, &apos;email&apos;)
    })

    it(&apos;forwards ref correctly&apos;, () => {
      const ref = { current: null }
      render(<Input ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })

    it(&apos;handles disabled state&apos;, () => {
      render(<Input disabled />)
      const input = screen.getByRole(&apos;textbox&apos;)
      expect(input).toBeDisabled()
      expect(input).toHaveClass(&apos;disabled:cursor-not-allowed disabled:opacity-50&apos;)
    })

    it(&apos;handles placeholder text&apos;, () => {
      render(<Input placeholder="Enter text" />)
      const input = screen.getByPlaceholderText(&apos;Enter text&apos;)
      expect(input).toBeInTheDocument()
    })

    it(&apos;handles value changes&apos;, async () => {
      render(<Input />)
      const input = screen.getByRole(&apos;textbox&apos;)
      await userEvent.type(input, &apos;test value&apos;)
      expect(input).toHaveValue(&apos;test value&apos;)
    })
  })

  describe(&apos;Select&apos;, () => {
    it(&apos;renders with default classes&apos;, () => {
      render(<Select />)
      const select = screen.getByRole(&apos;combobox&apos;)
      expect(select).toHaveClass(
        &apos;flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background&apos;
      )
    })

    it(&apos;merges custom className&apos;, () => {
      render(<Select className="custom-class" />)
      const select = screen.getByRole(&apos;combobox&apos;)
      expect(select).toHaveClass(&apos;custom-class&apos;)
      expect(select).toHaveClass(&apos;flex h-10 w-full&apos;)
    })

    it(&apos;renders with options&apos;, () => {
      render(
        <Select>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      )
      const options = screen.getAllByRole(&apos;option&apos;)
      expect(options).toHaveLength(2)
      expect(options[0]).toHaveValue(&apos;1&apos;)
      expect(options[1]).toHaveValue(&apos;2&apos;)
    })

    it(&apos;handles disabled state&apos;, () => {
      render(<Select disabled />)
      const select = screen.getByRole(&apos;combobox&apos;)
      expect(select).toBeDisabled()
      expect(select).toHaveClass(&apos;disabled:cursor-not-allowed disabled:opacity-50&apos;)
    })

    it(&apos;handles value changes&apos;, async () => {
      render(
        <Select>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      )
      const select = screen.getByRole(&apos;combobox&apos;)
      await userEvent.selectOptions(select, &apos;2&apos;)
      expect(select).toHaveValue(&apos;2&apos;)
    })
  })
})
