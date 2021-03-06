const TIME_INTERVAL = 0.002;
var myChart;
var sP = Number(document.getElementById("sP").value);

var labels = [0];
var priceData = [sP];
var time = 1;
var actualTime = 1;

var diff;
var startDiff;
var currentDate;

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
    
    diff = (priceData[time] - priceData[time-100]).toFixed(2);
    startDiff = (priceData[time] - sP).toFixed(2);

    return (priceData[time]);
}

const CTX = document.getElementById('myChart').getContext('2d');
const CONFIG = {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "slurpcoin",
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
    document.getElementById("genBtn").remove();
    sP = Number(document.getElementById("sP").value);
    document.getElementById("parTable").deleteRow(0);
    CONFIG.data.datasets[0].data[0] = sP;
    while(true){
        await delay(waitTime);
        eRoR = Number(document.getElementById("eRoR").value);
        eAV = Number(document.getElementById("eAV").value);
        waitTime = Number(document.getElementById("waitTime").value)
        generateChart();
        document.getElementById("price").innerHTML = "Current price: $" + CONFIG.data.datasets[0].data[CONFIG.data.datasets[0].data.length-1];
        document.getElementById("diff").innerHTML = diff;
        document.getElementById("startDiff").innerHTML = startDiff;

        var diffElement = document.getElementById("diff");
        var startDiffElement = document.getElementById("startDiff");
        var currentDateElement = document.getElementById("currentDate");

        diffElement.style.backgroundColor = 'rgba(0,0,0)';
        startDiffElement.style.backgroundColor = 'rgba(0,0,0)';

        if(diffElement.innerHTML>0){
            diffElement.style.color = 'rgba(0,255,0)';
        }else{
            diffElement.style.color = 'rgba(255,0,0)';
        }

        if(startDiffElement.innerHTML>0){
            startDiffElement.style.color = 'rgba(0,255,0)';
        }else{
            startDiffElement.style.color = 'rgba(255,0,0)';
        }

        currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + actualTime)

        currentDateElement.innerHTML = currentDate.getDate().toString() + "." + (currentDate.getMonth()+1).toString() + "." + currentDate.getFullYear().toString();
    }

}



