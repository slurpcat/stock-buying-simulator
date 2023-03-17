var currentBudgetField = document.getElementById("budget");
var currentStocksField = document.getElementById("stocks");
var waitTime = Number(document.getElementById("waitTime").value);

var startingBudget = 100;
var currentStocks = 0;
var currentBudget = startingBudget;

function getPrice(){
    var rawPrice = document.getElementById("price").innerHTML;
    var currentPrice = Number(rawPrice.replace("Current price: $", ""));
    return currentPrice;
}

function buy(){
    if(currentBudget >= getPrice()){
        currentBudget -= getPrice();
        currentStocks += 1;
    }
}

function sell(){
    if(currentStocks > 0){
        currentStocks -= 1;
        currentBudget += getPrice();
    }
}

async function main2(){
    currentBudgetField.innerHTML = startingBudget + "$";
    while (true){
        await delay(waitTime);
        waitTime = Number(document.getElementById("waitTime").value);
        currentBudgetField.innerHTML = "Current budget: " + currentBudget.toFixed(2) + "$";
        currentStocksField.innerHTML = "Owned stocks: " + currentStocks;
    }
}

