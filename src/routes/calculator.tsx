import { useState } from "react";
import styled from "styled-components";
import { useTheme } from "../components/theme";

const CalculatorContainer = styled.div<{ darkMode: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${(props) => (props.darkMode ? "#1e1e1e" : "#f0f0f0")};
  padding: 20px;
  user-select: none;
`;

const Display = styled.div<{ darkMode: boolean }>`
  background-color: ${(props) => (props.darkMode ? "#2d2d2d" : "#ffffff")};
  color: ${(props) => (props.darkMode ? "#ffffff" : "#000000")};
  font-size: 48px;
  font-weight: 300;
  text-align: right;
  padding: 30px 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  word-wrap: break-word;
  word-break: break-all;
  overflow-x: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  flex: 1;
`;

const Button = styled.button<{
  darkMode: boolean;
  variant?: "number" | "operator" | "equals" | "clear";
  span?: number;
}>`
  grid-column: span ${(props) => props.span || 1};
  font-size: 28px;
  font-weight: 400;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.1s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;

  ${(props) => {
    if (props.variant === "operator") {
      return `
        background-color: #ff9500;
        color: white;
        &:hover {
          background-color: #ffb143;
        }
        &:active {
          background-color: #cc7700;
        }
      `;
    } else if (props.variant === "equals") {
      return `
        background-color: #ff9500;
        color: white;
        &:hover {
          background-color: #ffb143;
        }
        &:active {
          background-color: #cc7700;
        }
      `;
    } else if (props.variant === "clear") {
      return `
        background-color: ${props.darkMode ? "#505050" : "#a5a5a5"};
        color: ${props.darkMode ? "white" : "black"};
        &:hover {
          background-color: ${props.darkMode ? "#606060" : "#b5b5b5"};
        }
        &:active {
          background-color: ${props.darkMode ? "#404040" : "#959595"};
        }
      `;
    } else {
      return `
        background-color: ${props.darkMode ? "#333333" : "#e0e0e0"};
        color: ${props.darkMode ? "white" : "black"};
        &:hover {
          background-color: ${props.darkMode ? "#404040" : "#f0f0f0"};
        }
        &:active {
          background-color: ${props.darkMode ? "#2a2a2a" : "#d0d0d0"};
        }
      `;
    }
  }}

  ${(props) =>
    props.span === 2 &&
    `
    border-radius: 50px;
  `}

  &:active {
    transform: scale(0.95);
  }
`;

const Calculator = () => {
  const { darkMode } = useTheme();
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (
    firstValue: number,
    secondValue: number,
    operation: string
  ): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      case "%":
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  return (
    <CalculatorContainer darkMode={darkMode}>
      <Display darkMode={darkMode}>{display}</Display>
      <ButtonGrid>
        {/* Row 1 */}
        <Button
          darkMode={darkMode}
          variant="clear"
          onClick={clear}
        >
          AC
        </Button>
        <Button
          darkMode={darkMode}
          variant="clear"
          onClick={toggleSign}
        >
          +/-
        </Button>
        <Button
          darkMode={darkMode}
          variant="clear"
          onClick={inputPercent}
        >
          %
        </Button>
        <Button
          darkMode={darkMode}
          variant="operator"
          onClick={() => performOperation("÷")}
        >
          ÷
        </Button>

        {/* Row 2 */}
        <Button darkMode={darkMode} onClick={() => inputDigit("7")}>
          7
        </Button>
        <Button darkMode={darkMode} onClick={() => inputDigit("8")}>
          8
        </Button>
        <Button darkMode={darkMode} onClick={() => inputDigit("9")}>
          9
        </Button>
        <Button
          darkMode={darkMode}
          variant="operator"
          onClick={() => performOperation("×")}
        >
          ×
        </Button>

        {/* Row 3 */}
        <Button darkMode={darkMode} onClick={() => inputDigit("4")}>
          4
        </Button>
        <Button darkMode={darkMode} onClick={() => inputDigit("5")}>
          5
        </Button>
        <Button darkMode={darkMode} onClick={() => inputDigit("6")}>
          6
        </Button>
        <Button
          darkMode={darkMode}
          variant="operator"
          onClick={() => performOperation("-")}
        >
          -
        </Button>

        {/* Row 4 */}
        <Button darkMode={darkMode} onClick={() => inputDigit("1")}>
          1
        </Button>
        <Button darkMode={darkMode} onClick={() => inputDigit("2")}>
          2
        </Button>
        <Button darkMode={darkMode} onClick={() => inputDigit("3")}>
          3
        </Button>
        <Button
          darkMode={darkMode}
          variant="operator"
          onClick={() => performOperation("+")}
        >
          +
        </Button>

        {/* Row 5 */}
        <Button darkMode={darkMode} span={2} onClick={() => inputDigit("0")}>
          0
        </Button>
        <Button darkMode={darkMode} onClick={inputDecimal}>
          .
        </Button>
        <Button
          darkMode={darkMode}
          variant="equals"
          onClick={() => performOperation("=")}
        >
          =
        </Button>
      </ButtonGrid>
    </CalculatorContainer>
  );
};

export default Calculator;
