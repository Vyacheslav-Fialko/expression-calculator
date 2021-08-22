function eval() {
    // Do not use eval!!!
    return;
}

const operators = ['+', '-', '*', '/', '(', ')'];

const priorities = {
    '+': 0,
    '-': 0,
    '*': 1,
    '/': 1,
}

const calculate = (a, b, operator) => {
  
  switch (operator) {
    case '+':
      return  a += b;
    case '-':
      return a -= b;
    case '*':
      return a *= b;
    case '/':
      if (b === 0) {
        throw new Error('TypeError: Division by zero.');
      }
      return a /= b; 
  }
}

const replaceCalculatedResult = (arrOperator, output) => {
  let lastOperator = arrOperator.pop();
  let secondNumber = Number(output.pop());
  let firstNumber = Number(output.pop());
  return output.push(calculate(firstNumber, secondNumber, lastOperator));
}

const getFirstPositionOperator = (expression) => {
  const res = operators.reduce((acc, item) => {
      let indexItem = expression.indexOf(item);
      return (indexItem !== -1 && indexItem < acc) ? indexItem : acc;
  }, expression.length);
  return res;
}

const isPriorityHigher  = (a, b) => {
    return priorities[a] >= priorities[b];
}

const expressionCalculator = (expr) => {
  expr = expr.replace(/\s/g, '');
  let output = [];
  let stackOperators = [];

  while (expr) {
    let firstOperatorPos = getFirstPositionOperator(expr);
    if (firstOperatorPos) {
      let  number = expr.slice(0, firstOperatorPos);
      output.push(number);
      expr = expr.slice(firstOperatorPos, expr.length);
    } else {
      let operator = expr[0];
      if (operator === ')') {
        if (!(stackOperators.includes('('))) {
          throw new Error('ExpressionError: Brackets must be paired');
        }
        while (stackOperators[stackOperators.length - 1] !== '(') {
          replaceCalculatedResult(stackOperators, output);
        }
        stackOperators.pop();
      } else {
        if (operator !== '(') {
          while (stackOperators.length && isPriorityHigher (stackOperators[stackOperators.length - 1], operator)) {
            replaceCalculatedResult(stackOperators, output);
          }
        }
        stackOperators.push(operator);
      }
      expr = expr.slice(1, expr.length);
    }
  }

  if (output.includes(NaN) || stackOperators.includes('(')) {
      throw new Error('ExpressionError: Brackets must be paired');
  }

  while (stackOperators.length) {
    replaceCalculatedResult(stackOperators, output);
  }
  const res = output[0];
  return res;
}

module.exports = {
    expressionCalculator
}