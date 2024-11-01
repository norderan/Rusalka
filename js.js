let dayCounter = 0;
const dayCounterElement = document.getElementById("dayCounter");
const stockCanvas = document.getElementById("canvas1");
const ctx = stockCanvas.getContext("2d");

let news;
let priceCanvas1 = 1000;
let userCredits = 1000;
let command;

const PRECENTAGE_DIVIDOR_FACTOR = 0.1;

let stockArray1;
let stockArray1Correct;
/*
Tasks: 
    - create a news funciton
    - Add tp and sl.
    - Add other graphs.
    - Add correction for the command.
    

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
    let stockObject = createStockArray(0.70, 0.07);
    stockArray1 = stockObject.coordinatesArray
    stockArray1Correct = stockObject.coordinatesArrayCorrect;
    drawThe500lines(stockArray1, priceCanvas1);
    drawStock(stockArray1Correct, true);

}




//terminal input:
const terminalInputElement = document.getElementById("terminalInput");
terminalInputElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
        addMessageToTerminal(terminalInputElement.value)
        terminalInterpreter(terminalInputElement.value);
        console.log('terminal command: '+ terminalInput);
        terminalInputElement.value = '';
    }
});

//Adds a message to command history.
const commandHistory = document.getElementById("commandHistory");
function addMessageToTerminal(message){
    let newCommand = document.createElement("p");
    newCommand.textContent = message;
    newCommand.classList.add("command");
    commandHistory.appendChild(newCommand);
    commandHistory.scrollTop = commandHistory.scrollHeight;
}


// trade LM long 500 -sl 1500 -tp 1700
// Interpretes terminal commands
function terminalInterpreter (commandString) {
    let commandArray = commandString.split(" ");
    if(commandArray[0] == "trade"){
        let longOrshort = commandArray[2];
        let amount = commandArray[3];
        let isLong;
        let stopLoss;
        let takeProfit;
        let stopLossPixels;
        if(!/^[0-9]+$/.test(amount)){
            addMessageToTerminal("[-] Amount not valid.")
        } else if (amount > userCredits){
            addMessageToTerminal("[-] Not enough credits.")
        } else if (amount <= 0){
            addMessageToTerminal("[-] Amount not valid.")
        } else if (longOrshort != "long" && longOrshort != "short") {
            addMessageToTerminal("[-] Long or short not specified on a position");
        } else if (commandArray[5] && !/^[0-9]+$/.test(commandArray[5]) || commandArray[7] && !/^[0-9]+$/.test(commandArray[7])){
            addMessageToTerminal("[-] Stop loss or take profit amount are not valid.");
        } else {

            for (let i = 4; i < commandArray.length; i++) {
                if (commandArray[i] === "-sl" && commandArray[i + 1]) {
                    stopLoss = commandArray[i + 1];



                    //stopLossPixelsOld = Math.round((stockArray1[25].y * stopLoss) / priceCanvas1);
                    stopLossPixels = Math.round(stockArray1[25].y * ((((stopLoss / priceCanvas1) -1 ) / PRECENTAGE_DIVIDOR_FACTOR ) + 1));
                    
                } 
                if (commandArray[i] === "-tp" && commandArray[i + 1]) {
                    takeProfit = commandArray[i + 1];
                }
            }
            if (longOrshort == "long") {
                isLong = true;
            } else if(longOrshort == "short") {
                isLong = false;
            } 

            
            ctx.strokeStyle = "red";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, 200 - stopLossPixels); // Starting point (x, y)
            ctx.lineTo(400, 200 - stopLossPixels); // Ending point (x, y)
            ctx.stroke();
            ctx.strokeStyle = "black";



            let takeProfitPixels;
            profit = trade(stockArray1, isLong, amount, stopLossPixels,takeProfitPixels);
            userCredits = userCredits + profit;
    
            drawStock(stockArray1Correct, false);
            priceCanvas1 = calculateNewPrice(stockArray1, priceCanvas1)
            console.log("user credits: " + userCredits);
            console.log("canvas price: " + priceCanvas1);
            console.log("==================================")
        
        }

    } else if(commandArray[0] == "c") {
        dayCounter++;
        dayLoop();
    } else {
        addMessageToTerminal("[-] Invalid command.")
    }
}


// calculates the trade profits.
function trade(stockArray, long, amount, stopLossPixels, takeProfitPixels) {
    let profit;
    let percentage
    userCredits = userCredits - amount; 
    if (takeProfitPixels === undefined && stopLossPixels === undefined) {
        if (long){
            percentage = (((stockArray[100].y / stockArray[25].y) -1) * PRECENTAGE_DIVIDOR_FACTOR) + 1;
            profit =  percentage * amount;
        } else {
            percentage = (stockArray[25].y / stockArray[100].y);
            profit =  percentage * amount;
        }

    }else if(takeProfitPixels === undefined){
        for(let i = 26; i < 101; i++){
            if(stockArray[i].y <= stopLossPixels) {
                console.log("stopLost trigger at:" + stockArray[i].x);
                if (long){
                    percentage = (((stockArray[i].y / stockArray[25].y) -1) * PRECENTAGE_DIVIDOR_FACTOR) + 1;
                    profit =  percentage * amount;
                } else {
                    percentage = stockArray[25].y / stockArray[i].y;
                    profit =  percentage * amount;
                }
                break;
            } else if (i == 100){
                if (long){
                    percentage = (((stockArray[100].y / stockArray[25].y) -1) * PRECENTAGE_DIVIDOR_FACTOR) + 1;
                    profit =  percentage * amount;
                } else {
                    percentage = (stockArray[25].y / stockArray[100].y);
                    profit =  percentage * amount;
                }
            }
        } 

    } else if (stopLossPixels === undefined){
        for(let i = 26; i < 101; i++){
            if(stockArray[i].y <= takeProfitPixels ) {
                if (long){
                    percentage = (((stockArray[25].y / stockArray[i].y) -1 ) * PRECENTAGE_DIVIDOR_FACTOR) + 1;
                    profit =  percentage * amount;
                } else {
                    percentage = (((stockArray[i].y / stockArray[25].y) -1 ) * PRECENTAGE_DIVIDOR_FACTOR) + 1;
                    profit =  percentage * amount;
                }
                break;

            }
        } 
    } else {
        for(let i = 26; i < 101; i++){
            if(stockArray[i].y <= takeProfitPixels || stockArray[i].y >= stopLossPixels) {
                if (long){
                    percentage = (stockArray[25].y / stockArray[i].y);
                    profit =  percentage * amount;
                } else {
                    percentage = (stockArray[i].y / stockArray[25].y);
                    profit =  percentage * amount;
                }
                break;
            }
        } 
    }

    console.log("trade for day " + dayCounter + ":");
    console.log("amount: " + amount);
    console.log("profit percentage: " + percentage);
    console.log("net profit: " + (Math.round(profit) - amount));
    console.log("stopLoss: " + stopLossPixels)
    console.log("take profit: " + takeProfitPixels)

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
        let coordinates = {x: tipsGapCounter, y:lastPrice + 100*(1 - priceChange)}
        tipsGapCounter = tipsGapCounter + tipsGap;
        coordinatesArray.push(coordinates);
    }
    let coordinatesArrayCorrect = coordinatesArray.map(element => ({ ...element, y: 200 - element.y }));
    return {coordinatesArrayCorrect: coordinatesArrayCorrect, coordinatesArray: coordinatesArray};
}

// calculates a price from the pixel change
function calculateNewPrice(stockArray, lastPrice) {
    //console.log("realPrice: " + (lastPrice * (stockArray[stockArray.length - 1].y  / stockArray[25].y )) );
    return lastPrice * ((((stockArray[stockArray.length - 1].y  / stockArray[25].y ) -1 ) * PRECENTAGE_DIVIDOR_FACTOR)+ 1);
}
function drawThe500lines(stockArray, price) {

    for (let  i = 0; i < 3000;i+= 10) {
        stopLossPixels =  200 - Math.round(stockArray1[25].y * ((((i / priceCanvas1) -1 ) / PRECENTAGE_DIVIDOR_FACTOR ) + 1));
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
    let startingCoordinates;
    let endingCoordinatesIndex;
    let startingCoordinatesIndex;
    if(isHalf) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(100, 0); // Starting point (x, y)
        ctx.lineTo(100, 200); // Ending point (x, y)
        ctx.stroke();
        startingCoordinates = coordinatesArray[0];
        endingCoordinatesIndex = 26;
        startingCoordinatesIndex = 0;
    } else {
        startingCoordinates = coordinatesArray[25];
        endingCoordinatesIndex = 101;
        startingCoordinatesIndex = 25;
    }
    ctx.strokeStyle = "black";

    ctx.beginPath();  
    ctx.moveTo(startingCoordinates.x, startingCoordinates.y);

    const delay = 30;  
    for (let i = startingCoordinatesIndex; i < endingCoordinatesIndex; i++) {
        setTimeout(function() {
            const coordinates = coordinatesArray[i];
            ctx.lineTo(coordinates.x, coordinates.y);
            ctx.lineWidth = 5;
            ctx.stroke();
        }, delay * i);
    }


}


