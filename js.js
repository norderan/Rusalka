

/*
LAST THING WORKED ON:
    - trying to get the div div div situation right.
*/

const HIGH_2 = 0.65;
const HIGH_1 = 0.6;
const HIGH = 0.55;
const ZERO = 0.5;
const LOW = 0.45;
const LOW_1 = 0.4;
const LOW_2 = 0.35;


const newsArray = [
    //day zero
    {
        news: "Lockheed Corporation announced the development of high altitude reconnaissance aircraft Lockheed U-2.",
        can1Trend: HIGH_1,
        can2Trend: ZERO,
        can3Trend: ZERO,
        can4Trend: LOW,
    },

    {
        news: "Test flight of the Lockheed U-2 prototype failed and crushed into the ocean. General Dynamics CEO commented: \"Duo to The U-2 failer we are stopping all collaboration with The Lockheed cooperation.\".",
        can1Trend: LOW_2,
        can2Trend: LOW,
        can3Trend: ZERO,
        can4Trend: ZERO,
    },

    {
        news: "Joseph Stalin, leader of the USSR, has orderd the manufacturing of 10,000 more UZ-10 anti-aircrafts from the Izhevsk Mechanical Plant",
        can1Trend: ZERO,
        can2Trend: ZERO,
        can3Trend: ZERO,
        can4Trend: HIGH_1,
    },

]
        
    

let dayCounter = 0;
const dayCounterElement = document.getElementById("dayCounter");
const stockCanvas1 = document.getElementById("canvas1");
const stockCanvas2 = document.getElementById("canvas2");
const stockCanvas3 = document.getElementById("canvas3");
const stockCanvas4 = document.getElementById("canvas4");

const ctxCanvas1 = stockCanvas1.getContext("2d");
const ctxCanvas2 = stockCanvas2.getContext("2d");
const ctxCanvas3 = stockCanvas3.getContext("2d");
const ctxCanvas4 = stockCanvas4.getContext("2d");

const can1StartPrice = document.getElementById("can1StartPrice");
const can2StartPrice = document.getElementById("can2StartPrice");
const can3StartPrice = document.getElementById("can3StartPrice");
const can4StartPrice = document.getElementById("can4StartPrice");

const can1EndPrice = document.getElementById("can1EndPrice");
const can2EndPrice = document.getElementById("can2EndPrice");
const can3EndPrice = document.getElementById("can3EndPrice");
const can4EndPrice = document.getElementById("can4EndPrice");

const can1Percentage = document.getElementById("can1Percentage");
const can2Percentage = document.getElementById("can2Percentage");
const can3Percentage = document.getElementById("can3Percentage");
const can4Percentage = document.getElementById("can4Percentage");

const userCreditsH1 = document.getElementById("userCredits");


const PRECENTAGE_DIVIDOR_FACTOR = 0.1;
const STOCK_TIPS = 100;
const STOCK_START_VIEW_INDEX = 10;
const CANVAS_HEIGHT = 200;
const CANVAS_WIDTH = 400;

const newsPanelHistory = document.getElementById("newsPanelHistory");
const terminalInputElement = document.getElementById("terminalInput");



let news;
let priceCanvas1 = 1000;
let priceCanvas2 = 700;
let priceCanvas3 = 800;
let priceCanvas4 = 500;

let userCredits = 1000;
let command;



let stockArrayCoords1;
let stockArrayCoords2;
let stockArrayCoords3;
let stockArrayCoords4;

let stockArrayDraw1;
let stockArrayDraw2;
let stockArrayDraw3;
let stockArrayDraw4;


dayLoop();


function dayLoop() {
    console.log("==================================")
    console.log("day: " + dayCounter);
    console.log("user credits: " + userCredits);
    console.log("canvas price: " + priceCanvas1);
    ctxCanvas1.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctxCanvas2.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctxCanvas3.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctxCanvas4.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    userCreditsH1.textContent = "Credits: " + userCredits;

    //clear end price
    can1EndPrice.textContent = "-";
    can2EndPrice.textContent = "-";
    can3EndPrice.textContent = "-";
    can4EndPrice.textContent = "-";

    can1Percentage.textContent = "-";
    can2Percentage.textContent = "-";
    can3Percentage.textContent = "-";
    can4Percentage.textContent = "-";

    //here is the day loop
    dayCounterElement.textContent = "Day " + (dayCounter + 1);
    const dayObj = newsArray[dayCounter];
    addNewsToNewsTerminal(dayObj.news);

    console.log(dayObj.news);

    stockArrayCoords1 = createStockArray(dayObj.can1Trend, 0.004);
    stockArrayCoords2 = createStockArray(dayObj.can2Trend, 0.004);
    stockArrayCoords3 = createStockArray(dayObj.can3Trend, 0.004);
    stockArrayCoords4 = createStockArray(dayObj.can4Trend, 0.004);
    
    stockArrayDraw1 = stockArrayCoords1.map(element => CANVAS_HEIGHT - Number(((element * 1000) - 900).toFixed(1)));;
    stockArrayDraw2 = stockArrayCoords2.map(element => CANVAS_HEIGHT - Number(((element * 1000) - 900).toFixed(1)));;
    stockArrayDraw3 = stockArrayCoords3.map(element => CANVAS_HEIGHT - Number(((element * 1000) - 900).toFixed(1)));;
    stockArrayDraw4 = stockArrayCoords4.map(element => CANVAS_HEIGHT - Number(((element * 1000) - 900).toFixed(1)));;


    
    drawStock(stockArrayDraw1, true, ctxCanvas1);
    drawStock(stockArrayDraw2, true, ctxCanvas2); 
    drawStock(stockArrayDraw3, true, ctxCanvas3); 
    drawStock(stockArrayDraw4, true, ctxCanvas4); 

    //put prices

    can1StartPrice.textContent = priceCanvas1;
    can2StartPrice.textContent = priceCanvas2;
    can3StartPrice.textContent = priceCanvas3;
    can4StartPrice.textContent = priceCanvas4;
}

//terminal input:
terminalInputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addMessageToTerminal(terminalInputElement.value)
        terminalInterpreter(terminalInputElement.value);
        console.log('terminal command: ' + terminalInput);
        terminalInputElement.value = '';
    }
});



//Adds a message to command history.
function addNewsToNewsTerminal(message) {
    let newNews = document.createElement("p");
    newNews.textContent = message;
    newNews.classList.add("newsItem");
    newsPanelHistory.appendChild(newNews);
    newsPanelHistory.appendChild(document.createElement("br"));
    newsPanelHistory.scrollTop = newsPanelHistory.scrollHeight;
}


//Add news item to the news terminal
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
        let priceCanvas;
        let ctxCanvas;
        let symbol = commandArray[1];
        let longOrshort = commandArray[2];
        let amount = commandArray[3];
        let isLong;
        let stopLoss;
        let takeProfit;
        let stopLossPixels;
        let takeProfitPixels;
        let stockArrayCoords;
        if (symbol.toLowerCase() !== "lk" && symbol.toLowerCase() !== "gd" && symbol.toLowerCase() !== "su" && symbol.toLowerCase() !== "imp") {
            addMessageToTerminal("[-] The trade symbol " + symbol + " is not valid.");
        } else if (!/^[0-9]+$/.test(amount)) {
            addMessageToTerminal("[-] Amount not valid.");
        } else if (amount > userCredits) {
            addMessageToTerminal("[-] Not enough credits.");
        } else if (amount <= 0) {
            addMessageToTerminal("[-] Amount not valid.");
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
            
            switch (symbol.toLowerCase()) {
                case "lk":
                    ctxCanvas = ctxCanvas1;
                    priceCanvas = priceCanvas1;
                    stockArrayCoords = stockArrayCoords1;
                    break;
                case "su":
                    ctxCanvas = ctxCanvas2;
                    priceCanvas = priceCanvas2;
                    stockArrayCoords = stockArrayCoords2;
                    break;
                case "gd":
                    ctxCanvas = ctxCanvas3;
                    priceCanvas = priceCanvas3;
                    stockArrayCoords = stockArrayCoords3;
                    break;
                case "imp":
                    ctxCanvas = ctxCanvas4;
                    priceCanvas = priceCanvas4;
                    stockArrayCoords = stockArrayCoords4;
                default:

                    break;
            }
            // draw stoploss line 
            ctxCanvas.strokeStyle = "red";
            ctxCanvas.lineWidth = 3;
            ctxCanvas.beginPath();
            ctxCanvas.moveTo(0, stopLossPixels);
            ctxCanvas.lineTo(CANVAS_WIDTH, stopLossPixels);
            ctxCanvas.stroke();

            // draw take profit line 
            ctxCanvas.strokeStyle = "green";
            ctxCanvas.lineWidth = 3;
            ctxCanvas.beginPath();
            ctxCanvas.moveTo(0, takeProfitPixels);
            ctxCanvas.lineTo(400, takeProfitPixels);
            ctxCanvas.stroke();

            ctxCanvas.strokeStyle = "black";



            profit = trade(stockArrayCoords, isLong, amount, stopLoss, takeProfit, priceCanvas);
            userCredits = userCredits + profit;
            userCreditsH1.textContent = "Credits: " + userCredits;

            can1Percentage.textContent = "%" + ((calculateNewPrice(stockArrayCoords1, priceCanvas1) - priceCanvas1) / priceCanvas1 * 100).toFixed(1);
            can2Percentage.textContent = "%" + ((calculateNewPrice(stockArrayCoords2, priceCanvas2) - priceCanvas2) / priceCanvas2 * 100).toFixed(1);
            can3Percentage.textContent = "%" + ((calculateNewPrice(stockArrayCoords3, priceCanvas3) - priceCanvas3) / priceCanvas3 * 100).toFixed(1);
            can4Percentage.textContent = "%" + ((calculateNewPrice(stockArrayCoords4, priceCanvas4) - priceCanvas4) / priceCanvas4 * 100).toFixed(1);
            
            
            priceCanvas1 = calculateNewPrice(stockArrayCoords1, priceCanvas1);
            priceCanvas2 = calculateNewPrice(stockArrayCoords2, priceCanvas2);
            priceCanvas3 = calculateNewPrice(stockArrayCoords3, priceCanvas3);
            priceCanvas4 = calculateNewPrice(stockArrayCoords4, priceCanvas4);

            can1EndPrice.textContent = priceCanvas1;
            can2EndPrice.textContent = priceCanvas2;
            can3EndPrice.textContent = priceCanvas3;
            can4EndPrice.textContent = priceCanvas4;

            drawStock(stockArrayDraw1, false, ctxCanvas1);
            drawStock(stockArrayDraw2, false, ctxCanvas2); 
            drawStock(stockArrayDraw3, false, ctxCanvas3); 
            drawStock(stockArrayDraw4, false, ctxCanvas4); 

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
    return Math.ceil(lastPrice * (stockArray[STOCK_TIPS] / stockArray[STOCK_START_VIEW_INDEX]) * 10) / 10;
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
function drawStock(coordinatesArray, isHalf, ctx) {
    let startingIndex;
    let startingPixel;
    let endingIndex;
    let gap = CANVAS_WIDTH / STOCK_TIPS;
    let gapCounter = 0
    if (isHalf) {
        startingPixel = 0;
        ctx.strokeStyle = "orangered";
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

    ctx.strokeStyle = "orangered";
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

