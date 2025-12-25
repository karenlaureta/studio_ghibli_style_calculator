/* ===== VARIABLES ===== */
let expression = '';     // Current mathematical expression as a string
let lastResult = null;   // Stores the last calculation result
let openParens = 0;      // Tracks unmatched opening parentheses

// DOM elements
const historyDisplay = document.getElementById('history'); // Shows previous calculation
const display = document.getElementById('display');       // Shows current input/result

/* ===== UPDATE DISPLAY ===== */
function updateDisplay() {
  // Show current expression or '0' if empty
  display.textContent = expression || '0';
  // Auto-scroll to the end of the display for long numbers
  display.scrollLeft = display.scrollWidth;
}

/* ===== APPEND NUMBER ===== */
function appendNumber(num) {
  // Reset last result if starting a new expression
  if (lastResult !== null && expression === '') lastResult = null;

  // Prevent multiple decimals in the same number
  if (num === '.' && /\d*\.\d*$/.test(expression)) return;

  // Append the number or decimal point to the expression
  expression += num;
  updateDisplay();
}

/* ===== APPEND OPERATOR ===== */
function appendOperator(op) {
  // Append operator (+, -, *, /) to the expression
  expression += op;
  updateDisplay();
}

/* ===== TOGGLE PARENTHESES ===== */
function toggleParenthesis() {
  // If no open parentheses or last character is operator/open paren, add '('
  if (openParens === 0 || /[\+\-\*\/\(]$/.test(expression)) {
    expression += '(';
    openParens++;
  } else {
    // Otherwise, close a parenthesis
    expression += ')';
    openParens--;
  }
  updateDisplay();
}

/* ===== CLEAR DISPLAY ===== */
function clearDisplay() {
  expression = '';           // Reset expression
  openParens = 0;            // Reset open parentheses count
  historyDisplay.textContent = ''; // Clear history
  updateDisplay();
}

/* ===== DELETE LAST CHARACTER ===== */
function deleteLast() {
  const last = expression.slice(-1); // Get last character
  // Adjust parentheses counter if needed
  if (last === '(') openParens--;
  if (last === ')') openParens++;
  // Remove last character
  expression = expression.slice(0, -1);
  updateDisplay();
}

/* ===== PERCENTAGE FUNCTION ===== */
function percentage() {
  // Find last number in expression and divide by 100
  expression = expression.replace(/(\d+\.?\d*)$/, n => n / 100);
  updateDisplay();
}

/* ===== CALCULATE RESULT ===== */
function calculate() {
  try {
    // Evaluate the expression using Function constructor
    const result = Function(`return (${expression})`)();

    // Show previous expression in history
    historyDisplay.textContent = expression;

    // Update expression with the result
    expression = result.toString();
    updateDisplay();
  } catch {
    // Display error if expression is invalid
    display.textContent = 'Error';
    expression = '';
  }
}
