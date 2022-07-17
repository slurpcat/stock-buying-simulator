const TIME_INTERVAL = 0.002;
var myChart;
var sP = Number(document.getElementById("sP").value);
var eRoR = Number(document.getElementById("eRoR").value);
var eAV = Number(document.getElementById("eAV").value);
var waitTime = Number(document.getElementById("waitTime").value);

var labels = [0];
var priceData = [sP];
var time = 1;
var actualTime = 1;

function delay(miliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, miliseconds)
    })
}

function resizeCanvas(){ //resize the canvas based on window size
    var canvas = document.getElementById("myChart");
    canvas.width = window.innerWidth * 0.65;
    canvas.height = window.innerHeight * 0.9;
}

function generateRandom(min = -1, max = 1){ //generate a random decimal between -1 and 1
    let difference = max - min;
    let rand = Math.random();
    rand = rand * difference;
    rand = rand + min;
    return rand;
}

function normalRandom(){ //generate a random decimal from a normal distribution of size x. its not perfect
    x = 10;
    res = 0;
    for(let i=0;i<x;i++){
        res += generateRandom(-1,1);
    }
    return(res/x)
}

function generateData(sP,eRoR,eAV){
    priceData[time] = priceData[time-1] * Math.exp((eRoR - eAV**2 / 2) * TIME_INTERVAL + eAV * normalRandom() * Math.sqrt(TIME_INTERVAL));
    priceData[time] = priceData[time].toFixed(2);
  
    return (priceData[time]);
}

const CTX = document.getElementById('myChart').getContext('2d');
const CONFIG = {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "da stock",
            data: priceData,
            fill: false,
            borderColor: 'rgba(0,0,0)',
            tension: 0.1
        }]
    },
    options: {
        maintainAspectRatio: true,
        responsive: false,
        tension: 0,
        parsing: false,
        normalized: true,
        spanGaps: true,
        animation: false,
        elements: {
            point: {
                radius: 0
            }
        }
    }       
}

function onLoadGenerateChart(){
    resizeCanvas();
    
    myChart = new Chart(CTX, CONFIG);
}

function generateChart(){

    resizeCanvas();

    CONFIG.data.labels[time] = actualTime;

    CONFIG.data.datasets[0].data[time] = generateData(sP,eRoR,eAV);

    time += 1;
    actualTime += 1;

    if(time == 200){
        CONFIG.data.labels.shift();
        CONFIG.data.datasets[0].data.shift();
        time = 199;
    }
   // var priceData = generateData(sP,eRoR,eAV)

    
    myChart.update();
}

async function main(){
    sP = Number(document.getElementById("sP").value);
    CONFIG.data.datasets[0].data[0] = sP;
    while(true){
        await delay(waitTime);
        eRoR = Number(document.getElementById("eRoR").value);
        eAV = Number(document.getElementById("eAV").value);
        waitTime = Number(document.getElementById("waitTime").value)
        generateChart();
        document.getElementById("price").innerHTML = "Current price: $" + CONFIG.data.datasets[0].data[CONFIG.data.datasets[0].data.length-1];
    }

}



