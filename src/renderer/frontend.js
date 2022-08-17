let {updateData} = require('../serial')


const electron = require('electron')
const ipc= electron.ipcRenderer;


let numeroDeCanales=5;
let chanIngresados = false;
let start=false;

let ctxCh = [] 
let data_chan =[]
let chCharts = []
let canvas = []
canvas.push(document.getElementById('canvas-channel0'));
canvas.push(document.getElementById('canvas-channel1'));
canvas.push(document.getElementById('canvas-channel2'));
canvas.push(document.getElementById('canvas-channel3'));
canvas.push(document.getElementById('canvas-channel4'));
ctxCh.push(canvas[0]);
ctxCh.push(canvas[1]);
ctxCh.push(canvas[2]);
ctxCh.push(canvas[3]);
ctxCh.push(canvas[4]);
//config buton=============================================
const configButton = document.getElementById('button1');
configButton.addEventListener('click',()=>{
  console.log("clicked config button");
  ipc.send('config-window-open');
  chanIngresados=false;
});
ipc.on('reply-main-ipc',function(event,arg){
  console.log(arg);
})
ipc.on('numChannels', function (evt, message) {
  numeroDeCanales = message.numChannels;
  console.log(numeroDeCanales); // Returns: {'SAVED': 'File Saved'}
  chanIngresados=true;
  for(let i=0;i<canvas.length;i++){
    if(i<numeroDeCanales){
      canvas[i].style.display = "block"
    }else{
      canvas[i].style.display = "none"
    }
  }
});

//=====================HTML SECTION ==========================

let volume_values = [];
let channelsData = [];
let channelsColors = ["#fc0362","#0384fc","#03fc28","#fcd303","#8c03fc"];
let channelsDataset = [];
let dataserial = updateData();
let arrDaraSerial = [0,0,0,0,0];

for(let i=0;i<numeroDeCanales;i++){
  channelsData.push([]);
}
// GENERAL CHART ====================================================
const ctx = document.getElementById('myChart'); //chart general

for(let i=0;i<numeroDeCanales;i++){
  channelsDataset.push({
    label: `Humedad canal ${i}`,
    data: channelsData[i],
    borderWidth: 1,
    fill: false,
    borderColor: channelsColors[i],
    tension: 0.9,
    pointStyle: 'circle',
    pointRadius: 0,
    pointHoverRadius: 0
  });
}

const generalChartData = {
    labels: volume_values,
    datasets: channelsDataset
}

const myChart = new Chart(ctx, {
    type: 'line',
    data: generalChartData,
    options: {
      scales: {
        y: {
            beginAtZero: true
        }
      }
    }
});




for(let i=0;i<numeroDeCanales;i++){
  data_chan.push({
    labels: volume_values,
    datasets: [channelsDataset[i]]
  });
  chCharts.push(new Chart(ctxCh[i], {
      type: 'line',
      data: data_chan[i],
      options: {
        scales: {
          y: {
              beginAtZero: true
          }
        }
      }
  }));
  let widthn = 100/numeroDeCanales;
  chCharts[i].canvas.parentNode.style.height = '10%';
  chCharts[i].canvas.parentNode.style.width = `${widthn}%`;
}







//UPDATE CHARTS=====================================================

  setInterval(()=>{
    //arrDaraSerial: [CH0,CH1,CH2,CH3,T]
    //channels that dont send real data=> FF
    if(chanIngresados && start){
      dataserial = updateData();
      arrDaraSerial = dataserial.split(" "); //returns an array of each channel data
      while(channelsData[0].length>255){
        for(let i=0;i<numeroDeCanales;i++){
          channelsData[i].shift();
        }
        volume_values.shift();
      }
      volume_values.push(0);
      for(let i=0;i<numeroDeCanales;i++){
        channelsData[i].push(arrDaraSerial[i]);
      }
    
      myChart.update();
      for(let i=0;i<numeroDeCanales;i++){
        chCharts[i].update();
      }
      console.log(channelsData);
      // document.getElementById("ports").innerHTML=`Port data: ${arr}`;

      channel0.innerHTML = `${arrDaraSerial[0]}`
      channel1.innerHTML = `${arrDaraSerial[1]}`
      channel2.innerHTML = `${arrDaraSerial[2]}`
      channel3.innerHTML = `${arrDaraSerial[3]}`
      channel4.innerHTML = `${arrDaraSerial[4]}`
    }
  },100);





// TIMER =========================================================
const timer = document.getElementById('time-info')
timer.innerHTML = "00:00:00";
let seg_totales=0;

setInterval(()=>{
  if(start){
    
    seg_totales=seg_totales+1;
    let aux=parseInt(seg_totales);

    let horas=parseInt(aux/3600);
    aux=aux-parseInt(horas*3600);

    let minutos=parseInt(aux/60);
    aux=aux-parseInt(minutos*60);

    let segundos=parseInt(aux);
    // console.log(segundos);
    // console.log(minutos);
    // console.log(horas);
    // console.log(seg_totales);

    let stringHoras = `${horas}`;
    let stringMinutos = `${minutos}`;
    let stringSegundos = `${segundos}`;

    if(horas<10){
      stringHoras = `0${horas}`
    }
    if(minutos<10){
      stringMinutos = `0${minutos}`
    }
    if(segundos<10){
      stringSegundos = `0${segundos}`
    }
    
    timer.innerHTML = `${stringHoras}:${stringMinutos}:${stringSegundos}`;
  }
},1000);




// START BUTTON HANDLER ==================================
const startButton = document.getElementById('start-button');
startButton.addEventListener('click',()=>{
  // console.log(channelsData);
  start = !start;
  // console.log(start);
  if(start){
    while(channelsData[0].length!=0){
      for(let i=0;i<numeroDeCanales;i++){
        channelsData[i].pop();
      }
      volume_values.pop();
    }
  }
  if(!start){
    startButton.style.background="#f53b5d";
    startButton.style.color="white";
  }else{
    startButton.style.background="#00c247";
    startButton.style.color="black";
  }
});

if(!start){
  startButton.style.background="#f53b5d";
  startButton.style.color="white";
}else{
  startButton.style.background="#00c247";
  startButton.style.color="black";
  seg_totales=0;
}

// INFO SERIAL DISPLAYING ===================================
const channel0 = document.getElementById('channel0');
const channel1 = document.getElementById('channel1');
const channel2 = document.getElementById('channel2');
const channel3 = document.getElementById('channel3');
const channel4 = document.getElementById('channel4');




















// document.getElementById('error').innerHTML = "Texto desde javascript";
// console.log("consola del frontend")


// parser.on('data',(line)=>{
//   const container = document.getElementById("error")
//   container.innerHTML = "Error modificado"
//     data = line.toString()
//     console.log(data)
// })


// async function listSerialPorts() {
//   await SerialPort.list().then((ports, err) => {
//     if(err) {
//       document.getElementById('error').textContent = err.message
//       return
//     } else {
//       document.getElementById('error').textContent = ''
//     }
//     console.log('ports', ports);

//     if (ports.length === 0) {
//       document.getElementById('error').textContent = 'No ports discovered'
//     }

//     tableHTML = tableify(ports)
//     document.getElementById('ports').innerHTML = tableHTML
//   })
// }
// function listPorts() {
//     listSerialPorts();
//     setTimeout(listPorts, 2000);
//   }
  
//   // Set a timeout that will check for new serialPorts every 2 seconds.
//   // This timeout reschedules itself.
//   setTimeout(listPorts, 2000);
  
