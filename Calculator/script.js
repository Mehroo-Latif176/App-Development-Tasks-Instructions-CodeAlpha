// script.js (100% Fixed Code)

const previousOperandElement = document.getElementById("previous-operand");
const currentOperandElement = document.getElementById("current-operand");

let currentOperand = "0";
let previousOperand = "";
let operation = undefined;
let shouldResetScreen = false;

function appendNumber(number) {
  if (shouldResetScreen) {
    if (operation === undefined && previousOperand.includes("=")) {
      previousOperand = "";
    }
    currentOperand = "";
    shouldResetScreen = false;
  }
  if (number === "." && currentOperand.includes(".")) return;
  if (currentOperand === "0" && number !== ".") {
    currentOperand = number;
  } else {
    currentOperand += number;
  }
  updateDisplay();
}

function appendOperator(op) {
  if (currentOperand === "" && previousOperand === "") return;

  if (currentOperand === "" && previousOperand !== "") {
    if (!previousOperand.includes("=")) {
      operation = op;
      updateDisplay();
      return;
    }
  }

  if (previousOperand.includes("=")) {
    previousOperand = currentOperand;
  } else if (previousOperand !== "") {
    calculate();
  }

  operation = op;
  previousOperand = currentOperand;
  shouldResetScreen = true;
  updateDisplay();
}

function calculate() {
  let computation;
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return;

  let displayOperator = operation;
  if (operation === "*") displayOperator = "×";
  if (operation === "/") displayOperator = "÷";
  if (operation === "-") displayOperator = "−";

  // FIXED: Double case hata kar ab bilkul clean sahi switch lagaya hai
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "/":
      if (current === 0) {
        alert("Cannot divide by zero!");
        clearScreen();
        return;
      }
      computation = prev / current;
      break;
    case "%":
      computation = (prev * current) / 100;
      break;
    default:
      return;
  }

  // Yeh line poore sawal ko history ki tarah upar halke rang mein roke rakhegi
  previousOperand = `${prev} ${displayOperator} ${current} =`;
  currentOperand = computation.toString();
  operation = undefined;
  shouldResetScreen = true;
  updateDisplay();
}

function deleteNumber() {
  if (currentOperand === "0") return;
  if (currentOperand.length === 1) {
    currentOperand = "0";
  } else {
    currentOperand = currentOperand.slice(0, -1);
  }
  updateDisplay();
}

function clearScreen() {
  currentOperand = "0";
  previousOperand = "";
  operation = undefined;
  updateDisplay();
}

function updateDisplay() {
  currentOperandElement.innerText = currentOperand;

  let displayOperator = operation;
  if (operation === "*") displayOperator = "×";
  if (operation === "/") displayOperator = "÷";
  if (operation === "-") displayOperator = "−";

  if (operation != null) {
    previousOperandElement.innerText = `${previousOperand} ${displayOperator}`;
  } else if (previousOperand !== "") {
    previousOperandElement.innerText = previousOperand;
  } else {
    previousOperandElement.innerText = "";
  }
}

// Keyboard Support
window.addEventListener("keydown", (e) => {
  if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
  if (e.key === ".") appendNumber(".");
  if (e.key === "=") calculate();
  if (e.key === "Enter") {
    e.preventDefault();
    calculate();
  }
  if (e.key === "Backspace") deleteNumber();
  if (e.key === "Escape") clearScreen();
  if (e.key === "+") appendOperator("+");
  if (e.key === "-") appendOperator("-");
  if (e.key === "*") appendOperator("*");
  if (e.key === "/") {
    e.preventDefault();
    appendOperator("/");
  }
  if (e.key === "%") appendOperator("%");
});
