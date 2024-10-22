const stockCanvas = document.getElementById("stockCanvas");
const ctx = stockCanvas.getContext("2d");


let trend = 0.8;
let volatility = 0.05;
drawStock(createStockGraph(trend, volatility));



//This funcation returns an array of stock coordinates.
//volatility - How "hard" the graph goes up and down. 1 --- 10.
//trend - is and how many does the graph goes up or down. 0 - 1
function createStockGraph (trend, volatility) {
    let tips = 100;
    const coordinatesArray = [];
    let firstYcoordinates = Math.floor(Math.random() * 100) + 200;
    let firstCoordinates  = {x: 0, y:firstYcoordinates}
    coordinatesArray.push(firstCoordinates);

    const tipsGap = Math.round(1000 / (tips + 1));
    let tipsGapCounter = tipsGap;
    for (let i = 1; i < tips + 1; i++){
        let priceChange;
        if(Math.random() < trend){
            priceChange = (Math.random()* (volatility)) + 1 - volatility; 
        } else {
            priceChange = (Math.random()* (volatility))+ 1 + volatility;
        }
        let lastPrice = coordinatesArray[i - 1].y;
        let coordinates = {x: tipsGapCounter, y:Math.floor(lastPrice * priceChange)}
        tipsGapCounter = tipsGapCounter + tipsGap;
        coordinatesArray.push(coordinates);
    }
    console.log(coordinatesArray);
    return coordinatesArray;
}


function drawStock(coordinatesArray) {
    ctx.beginPath();  
    const startingCoordinates = coordinatesArray[0];
    ctx.moveTo(startingCoordinates.x, startingCoordinates.y);

    const delay = 30;  // 100 ms = 0.1 seconds

    for (let i = 1; i < coordinatesArray.length; i++) {
        // Use a closure to preserve the current value of i and delay the drawing of each line
        setTimeout(function() {
            const coordinates = coordinatesArray[i];
            ctx.lineTo(coordinates.x, coordinates.y);
            ctx.lineWidth = 5;
            ctx.stroke();
        }, delay * i); // Multiply delay by 'i' to create increasing delay between lines
    }
}


//terminal:

let terminalInput;
const commandHistory = document.getElementById("commandHistory");
const terminalInputElement = document.getElementById("terminalInput");
terminalInputElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
        terminalInput = terminalInputElement.value;
        console.log('terminal command: '+ terminalInput);
        let newCommand = document.createElement("p");
        newCommand.textContent = terminalInput;
        newCommand.classList.add("command");
        commandHistory.appendChild(newCommand);
        terminalInputElement.value = '';
        commandHistory.scrollTop = commandHistory.scrollHeight;
    }
});