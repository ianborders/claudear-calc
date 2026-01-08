import { useState, useCallback } from 'react'
import './Calculator.css'

type Operator = '+' | '-' | '*' | '/' | null

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operator, setOperator] = useState<Operator>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }, [display, waitingForOperand])

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }, [display, waitingForOperand])

  const clear = useCallback(() => {
    setDisplay('0')
    setPreviousValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }, [])

  const toggleSign = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(value * -1))
  }, [display])

  const inputPercent = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(value / 100))
  }, [display])

  const performOperation = useCallback((nextOperator: Operator) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operator) {
      const currentValue = previousValue
      let result: number

      switch (operator) {
        case '+':
          result = currentValue + inputValue
          break
        case '-':
          result = currentValue - inputValue
          break
        case '*':
          result = currentValue * inputValue
          break
        case '/':
          result = inputValue !== 0 ? currentValue / inputValue : 0
          break
        default:
          result = inputValue
      }

      // Handle floating point precision
      result = Math.round(result * 1000000000) / 1000000000

      setDisplay(String(result))
      setPreviousValue(result)
    }

    setWaitingForOperand(true)
    setOperator(nextOperator)
  }, [display, operator, previousValue])

  const calculate = useCallback(() => {
    if (operator === null || previousValue === null) return

    const inputValue = parseFloat(display)
    let result: number

    switch (operator) {
      case '+':
        result = previousValue + inputValue
        break
      case '-':
        result = previousValue - inputValue
        break
      case '*':
        result = previousValue * inputValue
        break
      case '/':
        result = inputValue !== 0 ? previousValue / inputValue : 0
        break
      default:
        return
    }

    // Handle floating point precision
    result = Math.round(result * 1000000000) / 1000000000

    setDisplay(String(result))
    setPreviousValue(null)
    setOperator(null)
    setWaitingForOperand(true)
  }, [display, operator, previousValue])

  const getDisplayFontSize = () => {
    const length = display.length
    if (length > 12) return '1rem'
    if (length > 9) return '1.5rem'
    if (length > 6) return '2rem'
    return '2.5rem'
  }

  return (
    <div className="calculator-cabinet">
      <div className="cabinet-top">
        <div className="cabinet-light left"></div>
        <h1 className="title">CALC-O-TRON</h1>
        <div className="cabinet-light right"></div>
      </div>

      <div className="calculator">
        <div className="display-container">
          <div className="display" data-testid="display" style={{ fontSize: getDisplayFontSize() }}>
            {display}
          </div>
          <div className="display-glow"></div>
        </div>

        <div className="button-grid">
          <button className="btn function" onClick={clear}>AC</button>
          <button className="btn function" onClick={toggleSign}>+/-</button>
          <button className="btn function" onClick={inputPercent}>%</button>
          <button className="btn operator" onClick={() => performOperation('/')}>÷</button>

          <button className="btn digit" onClick={() => inputDigit('7')}>7</button>
          <button className="btn digit" onClick={() => inputDigit('8')}>8</button>
          <button className="btn digit" onClick={() => inputDigit('9')}>9</button>
          <button className="btn operator" onClick={() => performOperation('*')}>×</button>

          <button className="btn digit" onClick={() => inputDigit('4')}>4</button>
          <button className="btn digit" onClick={() => inputDigit('5')}>5</button>
          <button className="btn digit" onClick={() => inputDigit('6')}>6</button>
          <button className="btn operator" onClick={() => performOperation('-')}>−</button>

          <button className="btn digit" onClick={() => inputDigit('1')}>1</button>
          <button className="btn digit" onClick={() => inputDigit('2')}>2</button>
          <button className="btn digit" onClick={() => inputDigit('3')}>3</button>
          <button className="btn operator" onClick={() => performOperation('+')}>+</button>

          <button className="btn digit zero" onClick={() => inputDigit('0')}>0</button>
          <button className="btn digit" onClick={inputDecimal}>.</button>
          <button className="btn equals" onClick={calculate}>=</button>
        </div>
      </div>

      <div className="cabinet-bottom">
        <div className="coin-slot">
          <span>FREE PLAY</span>
        </div>
      </div>
    </div>
  )
}
