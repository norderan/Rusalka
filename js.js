let dayCounter = 0;
const dayCounterElement = document.getElementById("dayCounter");
const stockCanvas = document.getElementById("canvas1");
const ctx = stockCanvas.getContext("2d");

let news;
let priceCanvas1 = 1000;
let userCredits = 1000;
let command;

const PRECENTAGE_DIVIDOR_FACTOR = 0.1;
const STOCK_TIPS = 100;
const STOCK_START_VIEW_INDEX = 10;
const CANVAS_HEIGHT = 200;
const CANVAS_WIDTH = 400;


let stockArray1;
let stockArrayCoords;
let stockArray1draw;
/*
Tasks: 
    - create a news funciton
    - Add tp and sl.
    - Add other graphs.
    - Add correction for the command.
    

*/
dayLoop();


function dayLoop() {
    console.log("==================================")
    console.log("day: " + dayCounter);
    console.log("user credits: " + userCredits);
    console.log("canvas price: " + priceCanvas1);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //here is the day loop
    dayCounterElement.textContent = "Day " + (dayCounter + 1);
    news = "mig32 test fail above kazakhi lands";
    const newsHeadline = document.getElementById("newsHeadline");
    newsHeadline.textContent = news;
    stockArrayCoords = createStockArray(0.4, 0.004);

    stockArray1draw = stockArrayCoords.map(element => CANVAS_HEIGHT - Number(((element * 1000) - 900).toFixed(1)));;
    stockArray1 = stockArrayCoords.map(element => Number(((element * 1000) - 900).toFixed(1)));;

    drawThe500lines(stockArray1draw, priceCanvas1);
    drawStock(stockArray1draw, true); 

}




//terminal input:
const terminalInputElement = document.getElementById("terminalInput");
terminalInputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addMessageToTerminal(terminalInputElement.value)
        terminalInterpreter(terminalInputElement.value);
        console.log('terminal command: ' + terminalInput);
        terminalInputElement.value = '';
    }
});

//Adds a message to command history.
const commandHistory = document.getElementById("commandHistory");
function addMessageToTerminal(message) {
    let newCommand = document.createElement("p");
    newCommand.textContent = message;
    newCommand.classList.add("command");
    commandHistory.appendChild(newCommand);
    commandHistory.scrollTop = commandHistory.scrollHeight;
}


// trade LM long 500 -sl 1500 -tp 1700
// Interpretes terminal commands
function terminalInterpreter(commandString) {
    let commandArray = commandString.split(" ");
    if (commandArray[0] == "trade") {
        let longOrshort = commandArray[2];
        let amount = commandArray[3];
        let isLong;
        let stopLoss;
        let takeProfit;
        let stopLossPixels;
        let takeProfitPixels;

        if (!/^[0-9]+$/.test(amount)) {
            addMessageToTerminal("[-] Amount not valid.")
        } else if (amount > userCredits) {
            addMessageToTerminal("[-] Not enough credits.")
        } else if (amount <= 0) {
            addMessageToTerminal("[-] Amount not valid.")
        } else if (longOrshort != "long" && longOrshort != "short") {
            addMessageToTerminal("[-] Long or short not specified on a position");
        } else if (commandArray[5] && !/^[0-9]+$/.test(commandArray[5]) || commandArray[7] && !/^[0-9]+$/.test(commandArray[7])) {
            addMessageToTerminal("[-] Stop loss or take profit amount are not valid.");
        } else {

            for (let i = 4; i < commandArray.length; i++) {
                if (commandArray[i] === "-sl" && commandArray[i + 1]) {
                    stopLoss = commandArray[i + 1];
                    stopLossPixels = CANVAS_HEIGHT - (((stopLoss / priceCanvas1) * 1000) - 900);
                }
                if (commandArray[i] === "-tp" && commandArray[i + 1]) {
                    takeProfit = commandArray[i + 1];
                    takeProfitPixels = CANVAS_HEIGHT - (((takeProfit / priceCanvas1) * 1000) - 900);
                }
                }
            
            if (longOrshort == "long") {
                isLong = true;
            } else if (longOrshort == "short") {
                isLong = false;
            }

            // draw stoploss line 
            ctx.strokeStyle = "red";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, stopLossPixels);
            ctx.lineTo(CANVAS_WIDTH, stopLossPixels);
            ctx.stroke();

            // draw take profit line 
            ctx.strokeStyle = "green";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, takeProfitPixels);
            ctx.lineTo(400, takeProfitPixels);
            ctx.stroke();

            ctx.strokeStyle = "black";



            profit = trade(stockArrayCoords, isLong, amount, stopLoss, takeProfit, priceCanvas1);
            userCredits = userCredits + profit;

            drawStock(stockArray1draw, false);
            priceCanvas1 = calculateNewPrice(stockArrayCoords, priceCanvas1);
            console.log("user credits: " + userCredits);
            console.log("canvas price: " + priceCanvas1);
            console.log("==================================");

        }

    } else if (commandArray[0] == "c") {
        dayCounter++;
        dayLoop();
    } else {
        addMessageToTerminal("[-] Invalid command.")
    }
}


// calculates the trade profits.
function trade(stockArray, long, amount, stopLoss, takeProfit, price) {
    let profit;
    let percentage
    userCredits = userCredits - amount;

    if(long) {
        if (takeProfit === undefined && stopLoss === undefined) {
            percentage = stockArray[STOCK_TIPS] / stockArray[STOCK_START_VIEW_INDEX];
            profit = percentage * amount;
            
        } 
        else if (takeProfit === undefined) {
            for (let i = STOCK_START_VIEW_INDEX; i <= STOCK_TIPS; i++) {
                if ((stockArray[i] / stockArray[STOCK_START_VIEW_INDEX]) * price <= stopLoss) {
                    console.log("Stop loss triggerd.")
                    percentage = stockArray[i] / stockArray[STOCK_START_VIEW_INDEX];
                    profit = percentage * amount;
                    break;
                }
                else if (i == STOCK_TIPS) {
                    percentage = stockArray[STOCK_TIPS] / stockArray[STOCK_START_VIEW_INDEX];
                    profit = percentage * amount;

                }
            }
        } 
        else if (stopLoss === undefined) {
            for (let i = STOCK_START_VIEW_INDEX; i <= STOCK_TIPS; i++) {
                if ((stockArray[i] / stockArray[STOCK_START_VIEW_INDEX]) * price >= takeProfit) {
                    console.log("take profit triggerd.")
                    percentage = stockArray[i] / stockArray[STOCK_START_VIEW_INDEX];
                    profit = percentage * amount;
                    break;
                } else if (i == STOCK_TIPS) {
                    percentage = stockArray[STOCK_TIPS] / stockArray[STOCK_START_VIEW_INDEX];
                    profit = percentage * amount;
                }
            }
        } else {
            for (let i = STOCK_START_VIEW_INDEX; i <= STOCK_TIPS; i++) {
                if ((stockArray[i] / stockArray[STOCK_START_VIEW_INDEX]) * price >= takeProfit || (stockArray[i] / stockArray[STOCK_START_VIEW_INDEX]) * price <= stopLoss) {
                    console.log("take profit / stop loss triggerd.")
                    percentage = stockArray[i] / stockArray[STOCK_START_VIEW_INDEX];
                    profit = percentage * amount;
                    break;
                } else if (i == STOCK_TIPS) {
                    percentage = stockArray[STOCK_TIPS] / stockArray[STOCK_START_VIEW_INDEX];
                    profit = percentage * amount;
                }
            }
        }
    } else {
        if (takeProfit === undefined && stopLoss === undefined) {
            percentage = stockArray[STOCK_START_VIEW_INDEX] / stockArray[STOCK_TIPS];
            profit = percentage * amount;
            
        } 
        else if (takeProfit === undefined) {
            for (let i = STOCK_START_VIEW_INDEX; i <= STOCK_TIPS; i++) {
                if ((stockArray[STOCK_START_VIEW_INDEX]) / stockArray[i] * price >= stopLoss) {
                    console.log("Stop loss triggerd.")
                    percentage = stockArray[STOCK_START_VIEW_INDEX] / stockArray[i];
                    profit = percentage * amount;
                    break;
                }
                else if (i == STOCK_TIPS) {
                    percentage = stockArray[STOCK_START_VIEW_INDEX] / stockArray[STOCK_TIPS];
                    profit = percentage * amount;
                } 
            }
        }else if (stopLoss === undefined) {
            for (let i = STOCK_START_VIEW_INDEX; i <= STOCK_TIPS; i++) {
                if ((stockArray[i] / stockArray[STOCK_START_VIEW_INDEX]) * price <= takeProfit) {
                    console.log("take profit triggerd.")
                    percentage = stockArray[STOCK_START_VIEW_INDEX] / stockArray[i];
                    profit = percentage * amount;
                    break;
                } else if (i == STOCK_TIPS) {
                    percentage = stockArray[STOCK_START_VIEW_INDEX] / stockArray[STOCK_TIPS];
                    profit = percentage * amount;
                }
            }
        } else {
            for (let i = STOCK_START_VIEW_INDEX; i <= STOCK_TIPS; i++) {
                if ((stockArray[i] / stockArray[STOCK_START_VIEW_INDEX]) * price <= takeProfit || (stockArray[i] / stockArray[STOCK_START_VIEW_INDEX]) * price >= stopLoss) {
                    console.log("take profit / stop loss triggerd.")
                    percentage = stockArray[STOCK_START_VIEW_INDEX] / stockArray[i];
                    profit = percentage * amount;
                    break;
                } else if (i == STOCK_TIPS) {
                    percentage = stockArray[STOCK_START_VIEW_INDEX] / stockArray[STOCK_TIPS];
                    profit = percentage * amount;
                }
            }
        }
    }



    console.log("trade for day " + dayCounter + ":");
    console.log("amount: " + amount);
    console.log("profit percentage: " + percentage);
    console.log("net profit: " + (Math.round(profit) - amount));
    console.log("stopLoss: " + stopLoss)
    console.log("take profit: " + takeProfit)
    return Math.round(profit);
}

//This funcation returns an array of stock coordinates.
//volatility - How "hard" the graph goes up and down. 0 - 1
//trend - trend up or down. 0 - 1
function createStockArray(trend, volatility) {
    const coordinatesArray = [STOCK_TIPS];
    let priceChange = 0;
    coordinatesArray[0] = 1;
    for (let i = 1; i < STOCK_TIPS + 1; i++) {
        if (Math.random() < trend) {
            priceChange = (Math.random() * volatility) + 1;
        } else {
            priceChange = 1 - (Math.random() * volatility);
        }
        let lastPrice = coordinatesArray[i - 1];
        coordinatesArray[i] = Number((lastPrice * priceChange).toFixed(4));
    }
    return coordinatesArray;
}

// calculates a price from the pixel change
function calculateNewPrice(stockArray, lastPrice) {
    return lastPrice * (stockArray[STOCK_TIPS] / stockArray[STOCK_START_VIEW_INDEX]);
}
function drawThe500lines(stockArray, price) {

    for (let i = 0; i < 3000; i += 10) {
        stopLossPixels = 200 - Math.round(stockArray1[25].y * ((((i / priceCanvas1) - 1) / PRECENTAGE_DIVIDOR_FACTOR) + 1));
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 200 - stopLossPixels); // Starting point (x, y)
        ctx.lineTo(400, 200 - stopLossPixels); // Ending point (x, y)
        ctx.stroke();
        ctx.strokeStyle = "black";
    }

}

// Draws the stock price on a canvas
function drawStock(coordinatesArray, isHalf) {
    let startingIndex;
    let startingPixel;
    let endingIndex;
    let gap = CANVAS_WIDTH / STOCK_TIPS;
    let gapCounter = 0
    if (isHalf) {
        startingPixel = 0;
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH / STOCK_START_VIEW_INDEX, 0); // Starting point (x, y)
        ctx.lineTo(CANVAS_WIDTH / STOCK_START_VIEW_INDEX, CANVAS_HEIGHT); // Ending point (x, y)
        ctx.stroke();
        startingIndex = 0;
        endingIndex = STOCK_START_VIEW_INDEX;
    } else {
        startingIndex = STOCK_START_VIEW_INDEX;
        endingIndex = STOCK_TIPS;
        startingPixel = CANVAS_WIDTH / STOCK_START_VIEW_INDEX;
        gapCounter = gap * STOCK_START_VIEW_INDEX;
    }

    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(startingPixel, coordinatesArray[startingIndex]);


    const delay = 30;
    for (let i = startingIndex; i <= endingIndex; i++) {
        setTimeout(function () {
            let coordinates = coordinatesArray[i];
            ctx.lineTo(gapCounter, coordinates);
            ctx.lineWidth = 2;
            ctx.stroke();
            gapCounter += gap;
        }, delay * i);
    }


}


