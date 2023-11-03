// Add a number or operator to the equation
function addToDisplay(value) {
    // Checks if any memory function has been used
    if (memoryUsed) {
        document.getElementById('display').value = '';
        memoryUsed = false;
    }

    // Concatinates the entered value
    document.getElementById('display').value += value;
    // Clears the result
    document.getElementById('result').value = '';
    // Evaluates the input
    calculateRealTime();
}

// Delete the last character on the equation
function deleteLastCharacter() {
    var display = document.getElementById('display');
    var currentValue = display.value;
    display.value = currentValue.slice(0, -1);
    document.getElementById('result').value = '';
    calculateRealTime();
}

// Resets the value of the input and output
function clearDisplay() {
    document.getElementById('display').value = '';
    document.getElementById('result').value = '';
}

function evaluateEquation(num){
    var result;

    try {
        result = eval(num.value);

        // Check if the result is a repeating decimal
        if (result.toString().includes('.')) {
            var parts = result.toString().split('.');
            var decimalPart = parts[1];
            
            
            // Check if the decimal part is repeating
            if (/(\d{7,})\1/.test(decimalPart)) {
                decimalPart = decimalPart.substring(0, 6); // Round off to 6 decimal places
            }
        
            result = parseFloat(parts[0] + '.' + decimalPart);

        }
        return result;
    } catch (error) {
        return "Syntax Error";
    }
}

// Simplify the equation by solving it
function calculate() {
    var display = document.getElementById('display');
    var resultDisplay = document.getElementById('result');
    var result;

    resultDisplay.value = "";

    if (display.value == ''){
        display.value = '';
    } else {
        try {
            result = eval(display.value);

            // Check if the result is a repeating decimal
            if (result.toString().includes('.')) {
                var parts = result.toString().split('.');
                var decimalPart = parts[1];
                
                
                // Check if the decimal part is repeating
                if (/(\d{7,})\1/.test(decimalPart)) {
                    decimalPart = decimalPart.substring(0, 6); // Round off to 6 decimal places
                }
                result = parseFloat(parts[0] + '.' + decimalPart);
            }
            
            result = limitTo12Digits(result);
            
            display.value = result;
        } catch (error) {
            resultDisplay.value = "Syntax Error";
        }
    }
}

// Calculates the equation from the input
function calculateRealTime() {
    var display = document.getElementById('display');
    var resultDisplay = document.getElementById('result');
    var result;

    var equation = display.value;

    // Checks if there is an invalid syntax
    if (/[\*\/]{2,}/.test(equation)) {
        resultDisplay.value = "Syntax Error";
    } else if (/\d[\+\-\*\/]\d/.test(equation)) {
        result = eval(equation);

        // Check if the result is a repeating decimal
        if (result.toString().includes('.')) {
            var parts = result.toString().split('.');
            var decimalPart = parts[1];
            
            
            // Check if the decimal part is repeating
            if (/(\d{7,})\1/.test(decimalPart)) {
                decimalPart = decimalPart.substring(0, 6); // Round off to 6 decimal places
            }
            result = parseFloat(parts[0] + '.' + decimalPart);
        }

        result = limitTo12Digits(result);

        resultDisplay.value = result;
    } else {
        resultDisplay.value = "";
    }
}

// Add decimal to the equation
function addDecimal() {
    var display = document.getElementById('display');
    var currentValue = display.value;

    // Split the currentValue into an array of numbers and operators
    var parts = currentValue.split(/([+\-*/])/);

    // Find the last number in the array and add a decimal point if it doesn't have one already
    var lastPart = parts[parts.length - 1];
    if (lastPart.indexOf('.') === -1) {
        parts[parts.length - 1] += '.';
    }

    // Join the array back into a single string and update the display
    display.value = parts.join('');
}

// Apply exponential form if the result exceeded 12 digits
function formatNumber(num) {
    const numString = num.toString();

    // Checks the length of the number
    if (numString.length <= 12) {
        return numString;
    } else {
        if (numString.includes('e')) {
            return numString; // Number is already in exponential notation
        }
        return num.toExponential();
    }
}

// Deletes trailing zeros from exponential
function removeTrailingZerosFromExponential(num) {
    let numString = num.toString();
    
    // Removes the repeating zeros
    numString = numString.replace(/(\d+\.\d*?[1-9])0+e/, '$1e');
    
    return numString;
}

// Limits the result to 12 digits
function limitTo12Digits(num) {
    const formattedNumber = formatNumber(num);

    // Split the number into mantissa and exponent parts
    const [mantissa, exponent] = formattedNumber.split('e');

    // Calculate the maximum number of digits allowed for the mantissa
    const maxMantissaLength = 12 - (exponent ? exponent.length : 0);

    // Slice the mantissa to the maximum allowed length
    const slicedMantissa = mantissa.slice(0, maxMantissaLength);

    // Combine the sliced mantissa and the exponent
    const result = slicedMantissa + (exponent ? 'e' + exponent : '');

    // Removes trailing zeros
    return removeTrailingZerosFromExponential(result);
}

// Converts the decimal number system to binary 
function convertToBinary() {
    calculate();
    var display = document.getElementById('display');
    var resultDisplay = document.getElementById('result');

    if (display.value !=  '') {
        if (!isNaN(display.value)) {
            var currentValue = eval(display.value); 


            // Splits the integer and decimal part
            var parts = currentValue.toString().split('.');
            var integerPart = parts[0];
            var decimalPart = parts[1];

        if (!isNaN(currentValue)) {
            var binaryIntegerPart = parseInt(integerPart, 10).toString(2);

            var binaryDecimalPart = '';
            if (decimalPart) {
                binaryDecimalPart = '.';
                var decimalValue = '0.' + decimalPart;
            
                // Multiply the decimal to 2
                for (var i = 0; i < 6; i++) {
                    decimalValue *= 2;
                    binaryDecimalPart += Math.floor(decimalValue);
                    decimalValue -= Math.floor(decimalValue);
                }
            }

            // Concatinate the integer and decimal part
            var binaryResult = binaryIntegerPart + binaryDecimalPart;
            
            // Remove trailing zeros on decimal part
            binaryResult = binaryResult.replace(/(\.\d*?)0+$/, '$1');

            if (binaryResult.toString().length > 20){
                resultDisplay.value = "Number Too Large";
            } else {
                resultDisplay.value = binaryResult;
            }
        }
        } else {
            resultDisplay.value = "Invalid Number";
        }
    }
}

// Default memory value
var memory = 0;
var memoryUsed = false;

// Increments the memory with the value of the current equation
function memoryPlus() {
    var displayValue = document.getElementById('display');
    var result = parseFloat(evaluateEquation(displayValue));
    
    if (displayValue.value != ''){
        if (isNaN(result)) {
            document.getElementById('result').value = "Syntax Error";
        }

        if (!isNaN(result)) {
            memoryUsed = true;
            memory += result;
            document.getElementById('memory').value = "M = " + limitTo12Digits(memory);
            document.getElementById('result').value = limitTo12Digits(memory);
        }
    }
}


function removeTrailingZerosOnBinary(decimal) {
    var binary = (decimal >>> 0).toString(2);
  
    // Remove trailing zeros from the decimal part
    binary = binary.replace(/(\.\d*?)0+$/, '$1');
  
    return binary;
}

// Decrements the memory with the value of the current equation
function memoryMinus() {
    var displayValue = document.getElementById('display');
    var result = parseFloat(evaluateEquation(displayValue));
    
    if (displayValue.value != ''){

        if (isNaN(result)) {
            document.getElementById('result').value = "Syntax Error";
        }

        if (!isNaN(result)) {
            memoryUsed = true;
            memory -= result;
            document.getElementById('memory').value = "M = " + limitTo12Digits(memory);
            document.getElementById('result').value = limitTo12Digits(memory);
        }
    }
}

// Resets the value of memory
function memoryClear() {
    memory = 0;
    document.getElementById('memory').value = "";
} 