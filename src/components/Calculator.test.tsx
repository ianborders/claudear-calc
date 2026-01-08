import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Calculator from './Calculator'

const getButton = (name: string) => screen.getByRole('button', { name })

describe('Calculator', () => {
  it('renders with initial display of 0', () => {
    render(<Calculator />)
    expect(screen.getByTestId('display')).toHaveTextContent('0')
  })

  it('renders all digit buttons', () => {
    render(<Calculator />)
    for (let i = 0; i <= 9; i++) {
      expect(getButton(String(i))).toBeInTheDocument()
    }
  })

  it('renders operator buttons', () => {
    render(<Calculator />)
    expect(getButton('+')).toBeInTheDocument()
    expect(getButton('−')).toBeInTheDocument()
    expect(getButton('×')).toBeInTheDocument()
    expect(getButton('÷')).toBeInTheDocument()
    expect(getButton('=')).toBeInTheDocument()
  })

  it('inputs digits correctly', () => {
    render(<Calculator />)
    fireEvent.click(getButton('1'))
    fireEvent.click(getButton('2'))
    fireEvent.click(getButton('3'))
    expect(screen.getByTestId('display')).toHaveTextContent('123')
  })

  it('replaces initial 0 when inputting digits', () => {
    render(<Calculator />)
    fireEvent.click(getButton('5'))
    expect(screen.getByTestId('display')).toHaveTextContent('5')
  })

  it('handles decimal input', () => {
    render(<Calculator />)
    fireEvent.click(getButton('3'))
    fireEvent.click(getButton('.'))
    fireEvent.click(getButton('1'))
    fireEvent.click(getButton('4'))
    expect(screen.getByTestId('display')).toHaveTextContent('3.14')
  })

  it('prevents multiple decimals', () => {
    render(<Calculator />)
    fireEvent.click(getButton('3'))
    fireEvent.click(getButton('.'))
    fireEvent.click(getButton('1'))
    fireEvent.click(getButton('.'))
    fireEvent.click(getButton('4'))
    expect(screen.getByTestId('display')).toHaveTextContent('3.14')
  })

  it('clears display with AC button', () => {
    render(<Calculator />)
    fireEvent.click(getButton('5'))
    fireEvent.click(getButton('5'))
    fireEvent.click(getButton('AC'))
    expect(screen.getByTestId('display')).toHaveTextContent('0')
  })

  it('performs addition', () => {
    render(<Calculator />)
    fireEvent.click(getButton('5'))
    fireEvent.click(getButton('+'))
    fireEvent.click(getButton('3'))
    fireEvent.click(getButton('='))
    expect(screen.getByTestId('display')).toHaveTextContent('8')
  })

  it('performs subtraction', () => {
    render(<Calculator />)
    fireEvent.click(getButton('9'))
    fireEvent.click(getButton('−'))
    fireEvent.click(getButton('4'))
    fireEvent.click(getButton('='))
    expect(screen.getByTestId('display')).toHaveTextContent('5')
  })

  it('performs multiplication', () => {
    render(<Calculator />)
    fireEvent.click(getButton('6'))
    fireEvent.click(getButton('×'))
    fireEvent.click(getButton('7'))
    fireEvent.click(getButton('='))
    expect(screen.getByTestId('display')).toHaveTextContent('42')
  })

  it('performs division', () => {
    render(<Calculator />)
    fireEvent.click(getButton('8'))
    fireEvent.click(getButton('÷'))
    fireEvent.click(getButton('2'))
    fireEvent.click(getButton('='))
    expect(screen.getByTestId('display')).toHaveTextContent('4')
  })

  it('handles division by zero', () => {
    render(<Calculator />)
    fireEvent.click(getButton('5'))
    fireEvent.click(getButton('÷'))
    fireEvent.click(getButton('0'))
    fireEvent.click(getButton('='))
    expect(screen.getByTestId('display')).toHaveTextContent('0')
  })

  it('toggles sign with +/- button', () => {
    render(<Calculator />)
    fireEvent.click(getButton('5'))
    fireEvent.click(getButton('+/-'))
    expect(screen.getByTestId('display')).toHaveTextContent('-5')
    fireEvent.click(getButton('+/-'))
    expect(screen.getByTestId('display')).toHaveTextContent('5')
  })

  it('calculates percentage', () => {
    render(<Calculator />)
    fireEvent.click(getButton('5'))
    fireEvent.click(getButton('0'))
    fireEvent.click(getButton('%'))
    expect(screen.getByTestId('display')).toHaveTextContent('0.5')
  })

  it('chains operations', () => {
    render(<Calculator />)
    fireEvent.click(getButton('5'))
    fireEvent.click(getButton('+'))
    fireEvent.click(getButton('3'))
    fireEvent.click(getButton('+'))
    expect(screen.getByTestId('display')).toHaveTextContent('8')
    fireEvent.click(getButton('2'))
    fireEvent.click(getButton('='))
    expect(screen.getByTestId('display')).toHaveTextContent('10')
  })

  it('handles multi-digit numbers', () => {
    render(<Calculator />)
    fireEvent.click(getButton('1'))
    fireEvent.click(getButton('2'))
    fireEvent.click(getButton('3'))
    fireEvent.click(getButton('+'))
    fireEvent.click(getButton('4'))
    fireEvent.click(getButton('5'))
    fireEvent.click(getButton('6'))
    fireEvent.click(getButton('='))
    expect(screen.getByTestId('display')).toHaveTextContent('579')
  })

  it('handles decimal arithmetic', () => {
    render(<Calculator />)
    fireEvent.click(getButton('1'))
    fireEvent.click(getButton('.'))
    fireEvent.click(getButton('5'))
    fireEvent.click(getButton('+'))
    fireEvent.click(getButton('2'))
    fireEvent.click(getButton('.'))
    fireEvent.click(getButton('5'))
    fireEvent.click(getButton('='))
    expect(screen.getByTestId('display')).toHaveTextContent('4')
  })

  it('displays the title CALC-O-TRON', () => {
    render(<Calculator />)
    expect(screen.getByText('CALC-O-TRON')).toBeInTheDocument()
  })

  it('displays FREE PLAY text', () => {
    render(<Calculator />)
    expect(screen.getByText('FREE PLAY')).toBeInTheDocument()
  })
})
