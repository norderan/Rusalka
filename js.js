let dayCounter = 0;
const dayCounterElement = document.getElementById("dayCounter");
const stockCanvas = document.getElementById("canvas1");
const ctx = stockCanvas.getContext("2d");

let news;
let priceCanvas1 = 1000;
let userCredits = 1000;
let command;

const PRECENTAGE_DIVIDOR_FACTOR = 0.2;



/*



*/
dayLoop();


function dayLoop(){
    console.log("==================================")
    console.log("day: " + dayCounter);
    console.log("user credits: " + userCredits);
    console.log("canvas price: " + priceCanvas1);
    ctx.clearRect(0, 0, 400, 200);
    //here is the day loop
    dayCounterElement.textContent = "Day " + (dayCounter + 1);
    news = "mig32 test fail above kazakhi lands";
    const newsHeadline = document.getElementById("newsHeadline");
    newsHeadline.textContent = news;
    stockArray1 = createStockArray(0.7, 0.05);
    drawStock(stockArray1, true);

}




//terminal:
let terminalInput;
const commandHistory = document.getElementById("commandHistory");
const terminalInputElement = document.getElementById("terminalInput");
terminalInputElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
        terminalInput = terminalInputElement.value;
        terminalInterpreter(terminalInput);
        console.log('terminal command: '+ terminalInput);
        let newCommand = document.createElement("p");
        newCommand.textContent = terminalInput;
        newCommand.classList.add("command");
        commandHistory.appendChild(newCommand);
        terminalInputElement.value = '';
        commandHistory.scrollTop = commandHistory.scrollHeight;
    }
});

// Interpretes terminal commands
function terminalInterpreter (commandString) {
    let commandArray = commandString.split(" ");
    if(commandArray[0] == "trade"){
        let isLong;
        if (commandArray[1] == "long") {
            isLong = true;
        } else {
            isLong = false;
        }
        profit = trade(stockArray1, isLong, commandArray[2]);
        userCredits = userCredits + profit;

        drawStock(stockArray1, false);
        priceCanvas1 = calculateNewPrice(stockArray1, priceCanvas1)
        console.log("user credits: " + userCredits);
        console.log("canvas price: " + priceCanvas1);
        console.log("==================================")

    }
    if(commandArray[0] == "c") {
        dayCounter++;
        dayLoop();
    }
}


// calculates the trade profits.
function trade(stockArray, long, amount, takeProfitPixels, stopLossPixels) {
    let profit;
    let percentage
    userCredits = userCredits - amount; 
    if (takeProfitPixels === undefined && stopLossPixels === undefined) {
        if (long){

            percentage = (stockArray[25].y / stockArray[100].y) * PRECENTAGE_DIVIDOR_FACTOR;
            profit =  percentage * amount;
        } else {
            percentage = (stockArray[100].y/ stockArray[25].y) * PRECENTAGE_DIVIDOR_FACTOR;
            profit =  percentage * amount;
        }
    }else if(takeProfitPixels === undefined){
        for(let i = 26; i < 101; i++){
            if(stockArray[i].y >= stopLossPixels) {

                if (long){
                    profit = (stockArray[25].y / stockArray[i].y) * amount;
                } else {
                    profit = (stockArray[i].y/ stockArray[25].y) * amount;
                }
                break;
            }
        }
        return profit;
    } else if (stopLossPixels === undefined){
        for(let i = 26; i < 101; i++){
            if(stockArray[i].y <= takeProfitPixels ) {
                if (long){
                    profit = (stockArray[25].y / stockArray[i].y) * amount;
                } else {
                    profit = (stockArray[i].y/ stockArray[25].y) * amount;
                }
            }
        } 
    } else {
        for(let i = 26; i < 101; i++){
            if(stockArray[i].y <= takeProfitPixels || stockArray[i].y >= stopLossPixels) {
                if (long){
                    profit = (stockArray[25].y / stockArray[i].y) * amount;
                } else {
                    profit = (stockArray[i].y/ stockArray[25].y) * amount;
                }
            }
        } 
    }
    console.log("trade for day " + dayCounter + ":");
    console.log("amount: " + amount);
    console.log("profit percentage: " + percentage);
    console.log("net profit: " + Math.round(profit));
    return Math.round(profit); 
}

//This funcation returns an array of stock coordinates.
//volatility - How "hard" the graph goes up and down. 0 - 1
//trend - trend up or down. 0 - 1
function createStockArray (trend, volatility) {
    let tips = 100;
    const coordinatesArray = [];
    let firstYcoordinates = 100;
    let firstCoordinates  = {x: 0, y:firstYcoordinates}
    coordinatesArray.push(firstCoordinates);

    const tipsGap = Math.round(400 / (tips + 1));
    let tipsGapCounter = tipsGap;
    for (let i = 1; i < tips + 1; i++){
        let priceChange;
        if(Math.random() < trend){
            priceChange = (Math.random()* (volatility)) + 1 - volatility; 
        } else {
            priceChange = (Math.random()* (volatility))+ 1 + volatility;
        }
        let lastPrice = coordinatesArray[i - 1].y;
        let coordinates = {x: tipsGapCounter, y:lastPrice * priceChange}
        tipsGapCounter = tipsGapCounter + tipsGap;
        coordinatesArray.push(coordinates);
    }
    return coordinatesArray;
}

// calculates a price from the pixel change
function calculateNewPrice(stockArray, lastPrice) {
    return Math.round((lastPrice * stockArray[0].y )  / stockArray[stockArray.length - 1].y)
}


// Draws the stock price on a canvas
function drawStock(coordinatesArray, isHalf) {
    let startingCoordinates;
    let endingCoordinatesIndex;
    let startingCoordinatesIndex;
    if(isHalf) {
        startingCoordinates = coordinatesArray[0];
        endingCoordinatesIndex = 26;
        startingCoordinatesIndex = 0;
    } else {
        startingCoordinates = coordinatesArray[25];
        endingCoordinatesIndex = 101;
        startingCoordinatesIndex = 25;
    }

    ctx.moveTo(startingCoordinates.x, startingCoordinates.y);
    ctx.beginPath();  

    const delay = 30;  // 100 ms = 0.1 seconds
    for (let i = startingCoordinatesIndex; i < endingCoordinatesIndex; i++) {
        // Use a closure to preserve the current value of i and delay the drawing of each line
        setTimeout(function() {
            const coordinates = coordinatesArray[i];
            ctx.lineTo(coordinates.x, coordinates.y);
            ctx.lineWidth = 5;
            ctx.stroke();
        }, delay * i); // Multiply delay by 'i' to create increasing delay between lines
    }
}


