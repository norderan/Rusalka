const stockCanvas = document.getElementById("stockCanvas");
const ctx = stockCanvas.getContext("2d");


let trend = 0.69;
let volatility = 0.05;
console.log(createStockGraph(trend, volatility));
drawStock(createStockGraph(trend, volatility));



//This funcation returns an array of stock coordinates.
//volatility - How "hard" the graph goes up and down. 1 --- 10.
//trend - is and how many does the graph goes up or down. 0 - 1



function createStockGraph (trend, volatility) {
    let tips = Math.floor(Math.random() * 50) + 100;
    const coordinatesArray = [];
    let firstYcoordinates = Math.floor(Math.random() * 100) + 200;
    let firstCoordinates  = {x: 0, y:firstYcoordinates}
    coordinatesArray.push(firstCoordinates);

    const tipsGap = Math.round(1000 / (tips + 1 ));
    let tipsGapCounter = tipsGap;
    for (let i = 1; i < tips+ 1; i++){
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
        if(i + 1 === tips + 1) {
        coordinatesArray.push({x: 1000, y: lastPrice * priceChange});
        }
    }
    return coordinatesArray;
}


function drawStock(coordinatesArray) {
    ctx.beginPath();  
    const startingCoordinates = coordinatesArray[0];
    ctx.moveTo(startingCoordinates.x, startingCoordinates.y);

    for (let i = 1; i < coordinatesArray.length; i++) {
        const coordinates = coordinatesArray[i];
        ctx.lineTo(coordinates.x, coordinates.y);
    }
    ctx.lineWidth = 5;
    ctx.stroke();
}