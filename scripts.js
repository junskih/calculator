/* TODO:
keyboard support
can divide by zero sometimes
*/
const display = document.querySelector("#output-display");
const output = [];

// Event listeners
const btns = document.querySelectorAll(".btn");
btns.forEach(btn => {
  let btnID = btn.id;
  let btnClass = btn.classList[1]; // relevant class is the second one
  let func;

  if (btnID) {
    switch (btnID) {
      case "clear":
        func = clearOutput;
        break;
      case "backspace":
        func = deleteCharacter;
        break;
      case "sign":
        func = switchSign;
        break;
      case "decimal":
        func = addDecimal;
        break;
      case "equals":
        func = calculateOutput;
        break;
      default:
        console.log("Invalid ID: " + btnID);
        break;
    }
  } else if (btnClass) {
    switch (btnClass) {
      case "number":
        func = addNumber;
        break;
      case "operator":
        func = addOperator;
        break;
      default:
        console.log("Invalid class: " + btnClass);
        break;
    }
  }
  btn.addEventListener("click", func);
});

/* Button click event functions */
// Number buttons
function addNumber() {
  let last;
  if (!isOutputEmpty()) {
    last = getOutputLast();
    output.pop();
  }
  
  if (!last || last === "0") {
    // Add first digit or replace lone zero digit
    output.push(this.textContent);
  } else if (isNumber(last)) {
    // Add digit to number
    output.push(last + this.textContent);
  } else {
    // Add digit after operator
    output.push(last);
    output.push(this.textContent);
  }
  updateDisplay();
}

// Decimal button
function addDecimal() {
  if (isOutputEmpty()) return;
  let last = getOutputLast();
  if (isOperator(last) || hasDecimal(last)) return;
  
  if (isNumber(last)) {
    output.pop();
    output.push(last + this.textContent);
  }
  updateDisplay();
}

// Operator buttons
function addOperator() {
  if (isOutputEmpty()) return;
  let last = getOutputLast();
  
  if (isNumber(last) && endsInDecimal(last)) {
    // Remove trailing decimal
    output.pop();
    output.push(last.slice(0, last.length - 1));
    output.push(this.textContent);
    
  } else if (isNumber(last)) {
    // Add new operator
    output.push(this.textContent);
    
  } else if (isOperator(last)) {
    // Replace existing operator
    output.pop();
    output.push(this.textContent);
  }
  updateDisplay();
}

// Sign button
function switchSign() {
  if (isOutputEmpty()) return;
  let last = output[output.length - 1];
  let secondToLast = output[output.length - 2];
  
  // Switch operator or sign of number itself
  if (isPlusOrMinus(last)) {
    last = switchOperatorSign(last);
  } else if (isPlusOrMinus(secondToLast)) {
    secondToLast = switchOperatorSign(secondToLast);
  } else if (isNumber(last)) {
    last = switchNumberSign(last);
  }
  
  // Replace element(s)
  output.pop();
  if (secondToLast) {
    output.pop();
    output.push(secondToLast);
  }
  output.push(last);
  updateDisplay();
}

function switchOperatorSign(operator) {
  if (operator === "+") return "-";
  if (operator === "-") return "+";
  return operator;
}

function switchNumberSign(number) {
  if (isPositiveNumber(number)) {
    // Add minus sign
    number = `-${number}`;
  } else if (isNegativeNumber(number)) {
    // Extract positive number
    number = number.match(/\d+\.?\d*/)[0];
  }
  return number;
}

// Equals button
function calculateOutput() {
  if (isOutputEmpty()) return;
  let last = getOutputLast();
  if (isOperator(last)) return;
  
  let operatorCount = Math.floor(output.length / 2);
  // Loop over operators (POSSIBLE ENDLESS LOOP)
  while (operatorCount > 0) {
    for (let i = 0; i < output.length; i++) {
      if (isPrimaryOperator(output[i]) || (i === output.length - 2 && isSecondaryOperator(output[i]))) {
        // Result replaces both operands and operator
        let result = operate(i);
        output[i - 1] = result.toString();
        output.splice(i, 2);
        operatorCount--;
      }
    }
  }
  updateDisplay();
}

function operate(operatorIndex) {
  let operator = output[operatorIndex];
  let operand1 = Number(output[operatorIndex - 1]);
  let operand2 = Number(output[operatorIndex + 1]);
  
  let result = 0;
  switch (operator) {
    case "+":
      result = add(operand1, operand2);
      break;
    case "-":
      result = subtract(operand1, operand2);
      break;
    case "×":
      result = multiply(operand1, operand2);
      break;
    case "/":
      result = divide(operand1, operand2);
      break;
    case "%":
      result = modulo(operand1, operand2);
      break;
  }
  return result;
}

/* Utility/display functions */
function getOutputLast() {
  return output[output.length - 1];
}

function setOutputLast(input) {
  output[output.length - 1] = input;
}

function isOutputEmpty() {
  return output.length === 0;
}

function clearOutput() {
  output.length = 0;
  updateDisplay();
}

function deleteCharacter() {
  // Remove last digit from non-single-digit number, otherwise entire element
  if (!isOutputEmpty()) {
    let last = getOutputLast();
    if (typeof(last) == "number") {
      last = last.toString();
    }
    
    if (isPositiveNumber(last) && last.length > 1) {
      setOutputLast(last.slice(0, -1));
    } else if (isNegativeNumber(last) && last.length > 4) {
      setOutputLast(last.slice(0, -2) + last.slice(-1));
    } else {
      output.pop();
    }
    updateDisplay();
  }
}

function updateDisplay() {
  display.textContent = output.join(" ");
  //console.table(output);
}

/* Element type checking functions */
const isNumber = input => /\d+.?\d*$/.test(input);
const isPositiveNumber = input => /^\d+\.?\d*$/.test(input);
const isNegativeNumber = input => /^-\d+\.?\d*$/.test(input);
const isOperator = input => /^[-+×%\/]$/.test(input);
const isPrimaryOperator = input => /^[×%\/]$/.test(input);
const isSecondaryOperator = input => /^[-+]$/.test(input);
const isPlusOrMinus = input => /^[-+]$/.test(input);
const hasDecimal = input => /[.]/.test(input);
const endsInDecimal = input => /[.]\)?$/.test(input);

/* Operator functions */
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => b === 0 ? "Whoops, divided by zero!" : a / b;
const modulo = (a, b) => a % b;