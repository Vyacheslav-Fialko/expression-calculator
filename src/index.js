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

function calculate(a, b, operator) {
    switch (operator) {
        case '+':
            a += b;
            break;
        case '-':
            a -= b;
            break;
        case '*':
            a *= b;
            break;  
        case '/':
            if (b === 0) {
                throw new Error('TypeError: Division by zero.');
            }
            a /= b;
            break;
    }

    return a;
}

function getFirstPositionOfOperation(expression) {
    return operators.reduce((acc, currentItem) => {
        let indexOfItem = expression.indexOf(currentItem);
        return (indexOfItem !== -1 && indexOfItem < acc) ? indexOfItem : acc;
    }, expression.length);
}

function priorityIsHigher(stackOperation, newOperation) {
    return priorities[stackOperation] >= priorities[newOperation];
}

function expressionCalculator(expr) {

    function replaceCalculatedResult() {
        let lastStackOperation = stack.pop();
        let secondNumner = Number(output.pop());
        let firstNumber = Number(output.pop());
        output.push(calculate(firstNumber, secondNumner, lastStackOperation));
    }

    expr = expr.replace(/\s/g, '');

    let output = [];
    let stack = [];

    while (expr) {

        let firstOperationPos = getFirstPositionOfOperation(expr);
    
        if (firstOperationPos) {                //first symbol is number
            let  number = expr.slice(0, firstOperationPos);
            output.push(number);
            expr = expr.slice(firstOperationPos, expr.length);
        } else {                                //first symbol is operation
            let operation = expr[0];

            if (operation === ')') {

                if (!(stack.includes('('))) throw new Error('ExpressionError: Brackets must be paired');

                while (stack[stack.length - 1] !== '(') {
                    replaceCalculatedResult();
                }
                
                stack.pop();

            } else {

                if (!(operation === '(')) {

                    while (stack.length && priorityIsHigher(stack[stack.length - 1], operation)) {
                        replaceCalculatedResult();
                    }

                }

                stack.push(operation);
            }
            
            expr = expr.slice(1, expr.length);
        }
    }

    if (output.includes(NaN) || stack.includes('(')) throw new Error('ExpressionError: Brackets must be paired');

    while (stack.length) {
        replaceCalculatedResult();
    }

    return output[0];
}

module.exports = {
    expressionCalculator
}