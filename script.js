/* =========================================================
   PROCALC - SCIENTIFIC CALCULATOR
   COMPLETE SCRIPT
========================================================= */


/* =========================================================
   VARIABLES
========================================================= */

let expression = "";

let history = [];

let angleMode = "DEG";

/*
   Stores the result of the most recent
   successful calculation.

   This is used by the Ans button.
*/
let lastAnswer = null;


/* =========================================================
   GET HTML ELEMENTS
========================================================= */

const display =
    document.getElementById("display");

const expressionDisplay =
    document.getElementById("expressionDisplay");

const answerDisplay =
    document.getElementById("answerDisplay");

const clearButton =
    document.getElementById("clearButton");

const backspaceButton =
    document.getElementById("backspaceButton");

const parenthesisButton =
    document.getElementById("parenthesisButton");

const equalsButton =
    document.getElementById("equalsButton");

const ansButton =
    document.getElementById("ansButton");

const degButton =
    document.getElementById("degButton");

const radButton =
    document.getElementById("radButton");

const historyList =
    document.getElementById("historyList");

const clearHistoryButton =
    document.getElementById("clearHistoryButton");

const themeButton =
    document.getElementById("themeButton");


/* =========================================================
   UPDATE DISPLAY
========================================================= */

function updateDisplay() {

    /*
       Empty calculator.
    */

    if (expression === "") {

        display.textContent = "0";

        expressionDisplay.textContent = "";

        answerDisplay.textContent = "";

        return;
    }


    /*
       Convert internal scientific names
       into user-friendly names.

       asin -> sin⁻¹
       acos -> cos⁻¹
       atan -> tan⁻¹
    */

    display.textContent =
        formatExpressionForDisplay(
            expression
        );


    expressionDisplay.textContent = "";


    /*
       Live answer preview.
    */

    try {

        const result =
            evaluateExpression(
                expression
            );


        if (
            result !== null &&
            Number.isFinite(result)
        ) {

            answerDisplay.textContent =
                "= " +
                formatNumber(result);

        } else {

            answerDisplay.textContent = "";

        }

    } catch {

        /*
           Do not show error messages while
           the user is still typing.
        */

        answerDisplay.textContent = "";

    }

}


/* =========================================================
   FORMAT EXPRESSION FOR DISPLAY
========================================================= */

function formatExpressionForDisplay(
    value
) {

    return value
        .replace(
            /asin\(/g,
            "sin⁻¹("
        )
        .replace(
            /acos\(/g,
            "cos⁻¹("
        )
        .replace(
            /atan\(/g,
            "tan⁻¹("
        );

}


/* =========================================================
   ADD VALUE
========================================================= */

function addValue(value) {

    expression += value;

    updateDisplay();

}


/* =========================================================
   NORMAL KEYPAD BUTTONS
========================================================= */

document
    .querySelectorAll(
        ".keypad button[data-value]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const value =
                    button.getAttribute(
                        "data-value"
                    );

                addValue(value);

            }
        );

    });


/* =========================================================
   SCIENTIFIC BUTTONS
========================================================= */

document
    .querySelectorAll(
        ".scientific-buttons button[data-value]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const value =
                    button.getAttribute(
                        "data-value"
                    );

                addScientificValue(value);

            }
        );

    });


/* =========================================================
   SCIENTIFIC INPUT
========================================================= */

function addScientificValue(value) {

    /*
       x²
    */

    if (value === "^2") {

        expression += "^2";

        updateDisplay();

        return;
    }


    /*
       xʸ
    */

    if (value === "^") {

        expression += "^";

        updateDisplay();

        return;
    }


    /*
       Factorial
    */

    if (value === "!") {

        expression += "!";

        updateDisplay();

        return;
    }


    /*
       10ˣ
    */

    if (value === "10^") {

        expression += "10^";

        updateDisplay();

        return;
    }


    /*
       eˣ
    */

    if (value === "e^") {

        expression += "e^";

        updateDisplay();

        return;
    }


    /*
       1/x
    */

    if (value === "1/(") {

        expression += "1/(";

        updateDisplay();

        return;
    }


    /*
       All other scientific buttons.
    */

    expression += value;

    updateDisplay();

}


/* =========================================================
   PARENTHESES
========================================================= */

parenthesisButton.addEventListener(
    "click",
    () => {

        handleParentheses();

    }
);


function handleParentheses() {

    /*
       Empty expression -> (
    */

    if (expression === "") {

        expression = "(";

        updateDisplay();

        return;
    }


    const last =
        expression.slice(-1);


    /*
       If the previous character can
       end a value, add ).
    */

    if (
        /[0-9πe)]/.test(last)
    ) {

        expression += ")";

    } else {

        expression += "(";

    }


    updateDisplay();

}


/* =========================================================
   CLEAR
========================================================= */

clearButton.addEventListener(
    "click",
    () => {

        expression = "";

        updateDisplay();

    }
);


/* =========================================================
   BACKSPACE
========================================================= */

backspaceButton.addEventListener(
    "click",
    () => {

        if (
            expression.length === 0
        ) {

            return;

        }


        /*
           Delete complete function names
           when necessary.
        */

        const functions = [

            "asin(",
            "acos(",
            "atan(",
            "sqrt(",
            "sin(",
            "cos(",
            "tan(",
            "log(",
            "ln("

        ];


        for (
            const func of functions
        ) {

            if (
                expression.endsWith(func)
            ) {

                expression =
                    expression.slice(
                        0,
                        expression.length -
                        func.length
                    );

                updateDisplay();

                return;

            }

        }


        /*
           Otherwise delete one character.
        */

        expression =
            expression.slice(
                0,
                expression.length - 1
            );


        updateDisplay();

    }
);


/* =========================================================
   EQUALS
========================================================= */

equalsButton.addEventListener(
    "click",
    calculateResult
);


/* =========================================================
   CALCULATE RESULT
========================================================= */

function calculateResult() {

    if (
        expression.trim() === ""
    ) {

        return;

    }


    try {

        const originalExpression =
            expression;


        /*
           Calculate expression.
        */

        const result =
            evaluateExpression(
                expression
            );


        /*
           Check result.
        */

        if (
            !Number.isFinite(result)
        ) {

            throw new Error(
                "Invalid result"
            );

        }


        /*
           Save the answer for Ans.
        */

        lastAnswer = result;


        /*
           Format result.
        */

        const formattedResult =
            formatNumber(result);


        /*
           Add to history.
        */

        history.unshift({

            expression:
                originalExpression,

            result:
                formattedResult

        });


        /*
           Keep only the latest 50 items.
        */

        if (
            history.length > 50
        ) {

            history.pop();

        }


        /*
           Update history.
        */

        renderHistory();


        /*
           Put result into display.
        */

        expression =
            formattedResult;


        updateDisplay();


    } catch (error) {

        /*
           Show useful error message.
        */

        answerDisplay.textContent =
            "⚠ " +
            getFriendlyError(
                error
            );

    }

}


/* =========================================================
   ANS BUTTON
========================================================= */

ansButton.addEventListener(
    "click",
    () => {

        /*
           If there is no previous answer,
           show a helpful message.
        */

        if (
            lastAnswer === null ||
            !Number.isFinite(lastAnswer)
        ) {

            answerDisplay.textContent =
                "⚠ No previous answer";

            return;

        }


        /*
           Insert previous answer into
           current expression.
        */

        expression +=
            formatNumber(
                lastAnswer
            );


        updateDisplay();

    }
);


/* =========================================================
   FRIENDLY ERROR MESSAGES
========================================================= */

function getFriendlyError(
    error
) {

    const message =
        error &&
        error.message
            ? error.message
            : "";


    if (
        message.includes(
            "Division by zero"
        )
    ) {

        return "Cannot divide by zero";

    }


    if (
        message.includes(
            "Missing )"
        )
    ) {

        return "Missing closing parenthesis )";

    }


    if (
        message.includes(
            "Function requires ("
        )
    ) {

        return (
            "Function needs an opening parenthesis ("
        );

    }


    if (
        message.includes(
            "Invalid square root"
        )
    ) {

        return (
            "Square root requires a non-negative number"
        );

    }


    if (
        message.includes(
            "Invalid logarithm"
        )
    ) {

        return (
            "Logarithm requires a number greater than 0"
        );

    }


    if (
        message.includes(
            "Invalid inverse sine"
        )
    ) {

        return (
            "sin⁻¹ input must be between -1 and 1"
        );

    }


    if (
        message.includes(
            "Invalid inverse cosine"
        )
    ) {

        return (
            "cos⁻¹ input must be between -1 and 1"
        );

    }


    if (
        message.includes(
            "Invalid tangent"
        )
    ) {

        return (
            "tan is undefined at this angle"
        );

    }


    if (
        message.includes(
            "Invalid factorial"
        )
    ) {

        return (
            "Factorial requires a non-negative integer"
        );

    }


    if (
        message.includes(
            "Number too large"
        )
    ) {

        return (
            "Factorial number is too large"
        );

    }


    if (
        message.includes(
            "Invalid number"
        )
    ) {

        return (
            "Please check the number"
        );

    }


    if (
        message.includes(
            "Unknown character"
        )
    ) {

        return (
            "Invalid character in expression"
        );

    }


    if (
        message.includes(
            "Unexpected end"
        )
    ) {

        return (
            "Expression is incomplete"
        );

    }


    if (
        message.includes(
            "Unexpected token"
        )
    ) {

        return (
            "Invalid expression"
        );

    }


    if (
        message.includes(
            "Invalid expression"
        )
    ) {

        return (
            "Please check the expression"
        );

    }


    if (
        message.includes(
            "Invalid result"
        )
    ) {

        return (
            "The calculation produced an invalid result"
        );

    }


    return "Please check your input";

}


/* =========================================================
   DEG MODE
========================================================= */

degButton.addEventListener(
    "click",
    () => {

        angleMode = "DEG";


        degButton.classList.add(
            "active"
        );


        radButton.classList.remove(
            "active"
        );


        updateDisplay();

    }
);


/* =========================================================
   RAD MODE
========================================================= */

radButton.addEventListener(
    "click",
    () => {

        angleMode = "RAD";


        radButton.classList.add(
            "active"
        );


        degButton.classList.remove(
            "active"
        );


        updateDisplay();

    }
);


/* =========================================================
   CLEAR HISTORY
========================================================= */

clearHistoryButton.addEventListener(
    "click",
    () => {

        history = [];

        renderHistory();

    }
);


/* =========================================================
   HISTORY
========================================================= */

function renderHistory() {

    historyList.innerHTML = "";


    /*
       Empty history.
    */

    if (
        history.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "empty-history";


        empty.textContent =
            "No calculations yet";


        historyList.appendChild(
            empty
        );


        return;

    }


    /*
       Create history items.
    */

    history.forEach(
        item => {

            const historyItem =
                document.createElement(
                    "div"
                );


            historyItem.className =
                "history-item";


            /*
               Expression.
            */

            const expressionElement =
                document.createElement(
                    "div"
                );


            expressionElement.className =
                "history-expression";


            expressionElement.textContent =
                formatExpressionForDisplay(
                    item.expression
                );


            /*
               Result.
            */

            const resultElement =
                document.createElement(
                    "div"
                );


            resultElement.className =
                "history-result";


            resultElement.textContent =
                "= " +
                item.result;


            /*
               Add elements.
            */

            historyItem.appendChild(
                expressionElement
            );


            historyItem.appendChild(
                resultElement
            );


            /*
               Click history item to restore
               the original expression.
            */

            historyItem.addEventListener(
                "click",
                () => {

                    expression =
                        item.expression;


                    updateDisplay();

                }
            );


            historyList.appendChild(
                historyItem
            );

        }
    );

}


/* =========================================================
   FORMAT NUMBER
========================================================= */

function formatNumber(
    number
) {

    /*
       Remove negative zero.
    */

    if (
        Math.abs(number) < 1e-12
    ) {

        number = 0;

    }


    /*
       Integer.
    */

    if (
        Number.isInteger(number)
    ) {

        return number.toString();

    }


    /*
       Decimal precision.
    */

    return Number(
        number.toPrecision(12)
    ).toString();

}


/* =========================================================
   EVALUATE EXPRESSION
========================================================= */

function evaluateExpression(
    input
) {

    let tokens =
        tokenize(input);


    /*
       Add implicit multiplication.
    */

    tokens =
        insertImplicitMultiplication(
            tokens
        );


    return evaluateTokens(
        tokens
    );

}


/* =========================================================
   TOKENIZER
========================================================= */

function tokenize(
    input
) {

    const tokens = [];

    let i = 0;


    while (
        i < input.length
    ) {

        const char =
            input[i];


        /*
           Ignore spaces.
        */

        if (
            /\s/.test(char)
        ) {

            i++;

            continue;

        }


        /*
           NUMBER
        */

        if (
            /[0-9.]/.test(char)
        ) {

            let number = "";

            let decimalCount = 0;


            while (
                i < input.length &&
                /[0-9.]/.test(
                    input[i]
                )
            ) {

                if (
                    input[i] === "."
                ) {

                    decimalCount++;

                }


                number +=
                    input[i];


                i++;

            }


            if (
                decimalCount > 1
            ) {

                throw new Error(
                    "Invalid number"
                );

            }


            const parsedNumber =
                parseFloat(number);


            if (
                Number.isNaN(
                    parsedNumber
                )
            ) {

                throw new Error(
                    "Invalid number"
                );

            }


            tokens.push({

                type: "number",

                value:
                    parsedNumber

            });


            continue;

        }


        /*
           PI
        */

        if (
            char === "π"
        ) {

            tokens.push({

                type: "number",

                value:
                    Math.PI

            });


            i++;

            continue;

        }


        /*
           EULER'S NUMBER
        */

        if (
            char === "e"
        ) {

            tokens.push({

                type: "number",

                value:
                    Math.E

            });


            i++;

            continue;

        }


        /*
           OPERATORS
        */

        if (
            "+-*/^%!()".includes(
                char
            )
        ) {

            tokens.push({

                type: "operator",

                value:
                    char

            });


            i++;

            continue;

        }


        /*
           SCIENTIFIC FUNCTIONS
        */

        const functionNames = [

            "asin",
            "acos",
            "atan",
            "sqrt",
            "sin",
            "cos",
            "tan",
            "log",
            "ln"

        ];


        let foundFunction =
            false;


        for (
            const func of
            functionNames
        ) {

            if (
                input
                    .substring(i)
                    .startsWith(func)
            ) {

                tokens.push({

                    type: "function",

                    value:
                        func

                });


                i +=
                    func.length;


                foundFunction =
                    true;


                break;

            }

        }


        if (
            foundFunction
        ) {

            continue;

        }


        /*
           Unknown character.
        */

        throw new Error(
            "Unknown character: " +
            char
        );

    }


    return tokens;

}


/* =========================================================
   IMPLICIT MULTIPLICATION
========================================================= */

function insertImplicitMultiplication(
    tokens
) {

    const result = [];


    for (
        let i = 0;
        i < tokens.length;
        i++
    ) {

        const current =
            tokens[i];


        const previous =
            result[
                result.length - 1
            ];


        if (
            previous &&
            canEndValue(
                previous
            ) &&
            canStartValue(
                current
            )
        ) {

            result.push({

                type: "operator",

                value: "*"

            });

        }


        result.push(
            current
        );

    }


    return result;

}


/* =========================================================
   TOKEN HELPERS
========================================================= */

function canEndValue(
    token
) {

    return (

        token.type === "number" ||

        token.value === ")" ||

        token.value === "!"

    );

}


function canStartValue(
    token
) {

    return (

        token.type === "number" ||

        token.type === "function" ||

        token.value === "("

    );

}


/* =========================================================
   PARSER
========================================================= */

function evaluateTokens(
    tokens
) {

    let position = 0;


    /*
       ADDITION / SUBTRACTION
    */

    function parseExpression() {

        let value =
            parseTerm();


        while (
            position < tokens.length &&
            (
                tokens[position]
                    .value === "+" ||

                tokens[position]
                    .value === "-"
            )
        ) {

            const operator =
                tokens[position]
                    .value;


            position++;


            const right =
                parseTerm();


            if (
                operator === "+"
            ) {

                value += right;

            } else {

                value -= right;

            }

        }


        return value;

    }


    /*
       MULTIPLICATION / DIVISION
    */

    function parseTerm() {

        let value =
            parsePower();


        while (
            position < tokens.length &&
            (
                tokens[position]
                    .value === "*" ||

                tokens[position]
                    .value === "/"
            )
        ) {

            const operator =
                tokens[position]
                    .value;


            position++;


            const right =
                parsePower();


            if (
                operator === "*"
            ) {

                value *= right;

            } else {

                if (
                    right === 0
                ) {

                    throw new Error(
                        "Division by zero"
                    );

                }


                value /= right;

            }

        }


        return value;

    }


    /*
       POWER
    */

    function parsePower() {

        let value =
            parseUnary();


        if (
            position < tokens.length &&
            tokens[position]
                .value === "^"
        ) {

            position++;


            const exponent =
                parsePower();


            value =
                Math.pow(
                    value,
                    exponent
                );

        }


        return value;

    }


    /*
       UNARY + / -
    */

    function parseUnary() {

        if (
            position < tokens.length &&
            tokens[position]
                .value === "+"
        ) {

            position++;

            return parseUnary();

        }


        if (
            position < tokens.length &&
            tokens[position]
                .value === "-"
        ) {

            position++;

            return -parseUnary();

        }


        return parsePostfix();

    }


    /*
       FACTORIAL / PERCENTAGE
    */

    function parsePostfix() {

        let value =
            parsePrimary();


        while (
            position < tokens.length
        ) {

            const operator =
                tokens[position]
                    .value;


            /*
               Factorial.
            */

            if (
                operator === "!"
            ) {

                position++;


                value =
                    factorial(
                        value
                    );


                continue;

            }


            /*
               Percentage.
            */

            if (
                operator === "%"
            ) {

                position++;


                value =
                    value / 100;


                continue;

            }


            break;

        }


        return value;

    }


    /*
       NUMBERS / PARENTHESES / FUNCTIONS
    */

    function parsePrimary() {

        if (
            position >= tokens.length
        ) {

            throw new Error(
                "Unexpected end"
            );

        }


        const token =
            tokens[position];


        /*
           NUMBER
        */

        if (
            token.type === "number"
        ) {

            position++;

            return token.value;

        }


        /*
           PARENTHESES
        */

        if (
            token.value === "("
        ) {

            position++;


            /*
               Empty parentheses.
            */

            if (
                position < tokens.length &&
                tokens[position]
                    .value === ")"
            ) {

                throw new Error(
                    "Unexpected end"
                );

            }


            const value =
                parseExpression();


            if (
                position >=
                    tokens.length ||
                tokens[position]
                    .value !== ")"
            ) {

                throw new Error(
                    "Missing )"
                );

            }


            position++;


            return value;

        }


        /*
           SCIENTIFIC FUNCTION
        */

        if (
            token.type === "function"
        ) {

            const functionName =
                token.value;


            position++;


            /*
               Function must have (
            */

            if (
                position >=
                    tokens.length ||
                tokens[position]
                    .value !== "("
            ) {

                throw new Error(
                    "Function requires ("
                );

            }


            position++;


            /*
               Empty function.
            */

            if (
                position < tokens.length &&
                tokens[position]
                    .value === ")"
            ) {

                throw new Error(
                    "Unexpected end"
                );

            }


            const argument =
                parseExpression();


            /*
               Missing closing parenthesis.
            */

            if (
                position >=
                    tokens.length ||
                tokens[position]
                    .value !== ")"
            ) {

                throw new Error(
                    "Missing )"
                );

            }


            position++;


            return applyFunction(
                functionName,
                argument
            );

        }


        throw new Error(
            "Unexpected token"
        );

    }


    /*
       Start parsing.
    */

    const result =
        parseExpression();


    /*
       Check for unused tokens.
    */

    if (
        position !== tokens.length
    ) {

        throw new Error(
            "Invalid expression"
        );

    }


    return result;

}


/* =========================================================
   SCIENTIFIC FUNCTIONS
========================================================= */

function applyFunction(
    name,
    value
) {

    switch (name) {

        /*
           SIN
        */

        case "sin":

            return Math.sin(
                toRadians(value)
            );


        /*
           COS
        */

        case "cos":

            return Math.cos(
                toRadians(value)
            );


        /*
           TAN
        */

        case "tan":

            /*
               TAN 90° is undefined.
            */

            if (
                angleMode === "DEG"
            ) {

                const normalized =
                    ((value % 180) + 180) % 180;


                if (
                    Math.abs(
                        normalized - 90
                    ) < 1e-10
                ) {

                    throw new Error(
                        "Invalid tangent"
                    );

                }

            }


            return Math.tan(
                toRadians(value)
            );


        /*
           INVERSE SIN
        */

        case "asin":

            if (
                value < -1 ||
                value > 1
            ) {

                throw new Error(
                    "Invalid inverse sine"
                );

            }


            return fromRadians(
                Math.asin(value)
            );


        /*
           INVERSE COS
        */

        case "acos":

            if (
                value < -1 ||
                value > 1
            ) {

                throw new Error(
                    "Invalid inverse cosine"
                );

            }


            return fromRadians(
                Math.acos(value)
            );


        /*
           INVERSE TAN
        */

        case "atan":

            return fromRadians(
                Math.atan(value)
            );


        /*
           SQUARE ROOT
        */

        case "sqrt":

            if (
                value < 0
            ) {

                throw new Error(
                    "Invalid square root"
                );

            }


            return Math.sqrt(
                value
            );


        /*
           LOG BASE 10
        */

        case "log":

            if (
                value <= 0
            ) {

                throw new Error(
                    "Invalid logarithm"
                );

            }


            return Math.log10(
                value
            );


        /*
           NATURAL LOG
        */

        case "ln":

            if (
                value <= 0
            ) {

                throw new Error(
                    "Invalid logarithm"
                );

            }


            return Math.log(
                value
            );


        /*
           UNKNOWN FUNCTION
        */

        default:

            throw new Error(
                "Unknown function"
            );

    }

}


/* =========================================================
   ANGLE CONVERSION
========================================================= */

function toRadians(
    value
) {

    if (
        angleMode === "DEG"
    ) {

        return (
            value *
            Math.PI /
            180
        );

    }


    return value;

}


function fromRadians(
    value
) {

    if (
        angleMode === "DEG"
    ) {

        return (
            value *
            180 /
            Math.PI
        );

    }


    return value;

}


/* =========================================================
   FACTORIAL
========================================================= */

function factorial(
    number
) {

    /*
       Factorial requires a
       non-negative integer.
    */

    if (
        number < 0 ||
        !Number.isInteger(number)
    ) {

        throw new Error(
            "Invalid factorial"
        );

    }


    /*
       Prevent extremely large values.
    */

    if (
        number > 170
    ) {

        throw new Error(
            "Number too large"
        );

    }


    let result = 1;


    for (
        let i = 2;
        i <= number;
        i++
    ) {

        result *= i;

    }


    return result;

}


/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key;


        /*
           Numbers.
        */

        if (
            /[0-9]/.test(key)
        ) {

            addValue(key);

            return;

        }


        /*
           Decimal.
        */

        if (
            key === "."
        ) {

            addValue(".");

            return;

        }


        /*
           Operators.
        */

        if (
            [
                "+",
                "-",
                "*",
                "/",
                "^",
                "%"
            ].includes(key)
        ) {

            addValue(key);

            return;

        }


        /*
           Parentheses.
        */

        if (
            key === "(" ||
            key === ")"
        ) {

            addValue(key);

            return;

        }


        /*
           Enter.
        */

        if (
            key === "Enter" ||
            key === "="
        ) {

            calculateResult();

            return;

        }


        /*
           Backspace.
        */

        if (
            key === "Backspace"
        ) {

            backspaceButton.click();

            return;

        }


        /*
           Escape = AC.
        */

        if (
            key === "Escape"
        ) {

            clearButton.click();

            return;

        }

    }
);


/* =========================================================
   THEME BUTTON
========================================================= */

themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light-theme"
        );


        if (
            document.body.classList.contains(
                "light-theme"
            )
        ) {

            themeButton.textContent =
                "☾";

        } else {

            themeButton.textContent =
                "☼";

        }

    }
);


/* =========================================================
   STARTUP
========================================================= */

renderHistory();

updateDisplay();