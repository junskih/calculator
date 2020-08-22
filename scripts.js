const display = document.querySelector("#display");
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

function addNumber() {
  let prevElement = getOutputLast();
  console.log(prevElement)
  if (isNumber(prevElement)) {
    output.pop();
    output.push(prevElement + this.textContent);
  } else {
    output.push(this.textContent);
  }
  updateDisplay(output);
}

function addDecimal() {
  
}

function switchSign() {
  let operand = output[output.length - 1];
  let operator = output[output.length - 2];
  console.log(operand);
  console.log(operator);

  if (isNumber(getOutputLast())) {
    // Switch plus or minus operator if exists
    if (operator === "+") {
      operator = "-";
    } else if (operator === "-") {
      operator = "+";
    } else if (isPositiveNumber(operand)) {
      operand = `(-${operand})`;
      console.log("made negative");
    } else {
      operand = operand.match(/[\d+]/)[0];
      console.log("made positive");
    }
  }
  output.pop();
  output.pop();
  output.push(operator);
  output.push(operand);
  updateDisplay(output);
}

function addOperator() {
  if (isNumber(getOutputLast())) {
    output.push(this.textContent);
  } else if (isOperator(getOutputLast())) {
    output.pop();
    output.push(this.textContent);
  }
  updateDisplay();
}

function calculateOutput() {
  console.log("calculating...")
}

function getOutputLast() {
  return output[output.length - 1];
}

function setOutputLast(input) {
  output[-1] = input;
}

function isOutputEmpty() {
  return output.length === 0;
}

function clearOutput() {
  output.length = 0;
  updateDisplay();
}

function deleteCharacter() {
  if (!isOutputEmpty()) {
    output.pop();
    updateDisplay();
  }
}

function updateDisplay() {
  display.textContent = output.join(" ");
  console.table(output);
}

/* Type checking functions */
function isNumber(input) {
  const numberRegEx = /\d/;
  return numberRegEx.test(input);
}

function isPositiveNumber(input) {
  const positiveNumberRegex = /+[\d+]$/;
  return positiveNumberRegex.test(input);
}

function isOperator(input) {
  const operatorRegEx = /[-+×%\/]/;
  return operatorRegEx.test(input);
}

/* Operator functions */
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => b === 0 ? 0 : a / b;
const modulo = (a, b) => a % b;
