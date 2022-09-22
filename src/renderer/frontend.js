let {updateData} = require('../serial')


const electron = require('electron')
const ipc= electron.ipcRenderer;
const fs = require('fs');

let numeroDeCanales=6;
let tiempoDeMuestreo=1;
let tiempoDeProceso=10;
let chanIngresados = false;
let start=false;

let ctxCh = [] 
let data_chan =[]
let chCharts = []
let canvas = []
canvas.push(document.getElementById('canvas-channel0'));//canvas[0]
canvas.push(document.getElementById('canvas-channel1'));//canvas[1]
canvas.push(document.getElementById('canvas-channel2'));//canvas[2]
canvas.push(document.getElementById('canvas-channel3'));//canvas[3]
canvas.push(document.getElementById('canvas-channelT'));//canvas[4]
canvas.push(document.getElementById('canvas-channelHR'));//canvas[5]
ctxCh.push(canvas[0]);
ctxCh.push(canvas[1]);
ctxCh.push(canvas[2]);
ctxCh.push(canvas[3]);
ctxCh.push(canvas[4]);
ctxCh.push(canvas[5]);


//config buton=============================================
const configButton = document.getElementById('button1');
configButton.addEventListener('click',()=>{
  // console.log("clicked config button");
  ipc.send('config-window-open');
  // chanIngresados=false;
});
// ipc.on('reply-main-ipc',function(event,arg){
//   console.log(arg);
// })
ipc.on('numChannels', function (evt, message) {
  numeroDeCanales = message.numChannels;
  console.log(numeroDeCanales); // Returns: {'SAVED': 'File Saved'}
  chanIngresados=true;
  for(let i=1;i<=4;i++){ //numero de canales va de 1 a 4 (resistencias)
    if(i>numeroDeCanales){
      canvas[i-1].style.display = "none"
      // chCharts[i].data.datasets[0].label = `H% CH${i+1}`;
      chCharts[i-1].update();
      // canvas[i].style.display = "block"
    }else{
      canvas[i-1].style.display = "block"
    }
  }
  
  // chCharts[numeroDeCanales-1].data.datasets[0].label = "CH T";
  // chCharts[numeroDeCanales-1].update();

  // myChart.data.datasets
  // console.log(myChart.data.datasets)
  
  channelsDataset = []
  
  for(let i=0;i<6;i++){//6 CANALES EN TOTAL
      if(i<4){
        channelsDataset.push({
          label: `CH${i+1} H% `,
          data: channelsData[i],
          borderWidth: 1,
          fill: false,
          borderColor: channelsColors[i],
          tension: 0.9,
          pointStyle: 'circle',
          pointRadius: 0.5,
          pointHoverRadius: 0
        });
      }else if(i==4){
        channelsDataset.push({
          label: `CHT °C`,
          data: channelsData[i],
          borderWidth: 1,
          fill: false,
          borderColor: channelsColors[i],
          tension: 0.9,
          pointStyle: 'circle',
          pointRadius: 0.5,
          pointHoverRadius: 0
        });
      }else{
        channelsDataset.push({
          label: `CH HR`,
          data: channelsData[i],
          borderWidth: 1,
          fill: false,
          borderColor: channelsColors[i],
          tension: 0.9,
          pointStyle: 'circle',
          pointRadius: 0.5,
          pointHoverRadius: 0
        });
      }
  }
  myChart.data.datasets = channelsDataset;
  myChart.update();
  console.log(myChart.data.datasets)

  startButton.disabled=false;
  // startButton.style.background="#53A785";
  // startButton.style.color="white";
  seg_totales=0;
});

ipc.on('timeMuestreo', function (evt, message) {
  tiempoDeMuestreo = message.tiempoMuestreo;
});


ipc.on('timeProceso', function (evt, message) {
  tiempoDeProceso = message.tiempoProceso;
  updateTimeProceso(tiempoDeProceso);
});

//=====================HTML SECTION ==========================

let volume_values = [];
let channelsData = [];
let channelsColors = ["#66C2A5","#FC8D62","#8DA0CB","#E78AC3","#A6D854","#FFD92F"];
let channelsDataset = [];
let dataserial = updateData();
let arrDaraSerial = [0,0,0,0,0,0];

for(let i=0;i<6;i++){
  channelsData.push([]);
}
// GENERAL CHART ====================================================
const ctx = document.getElementById('myChart'); //chart general

for(let i=0;i<6;i++){//6 CANALES EN TOTAL
  if(i<4){
    channelsDataset.push({
      label: `CH${i+1} H% `,
      data: channelsData[i],
      borderWidth: 1,
      fill: false,
      borderColor: channelsColors[i],
      tension: 0.9,
      pointStyle: 'circle',
      pointRadius: 0.5,
      pointHoverRadius: 0
    });
  }else if(i==4){
    channelsDataset.push({
      label: `CH T`,
      data: channelsData[i],
      borderWidth: 1,
      fill: false,
      borderColor: channelsColors[i],
      tension: 0.9,
      pointStyle: 'circle',
      pointRadius: 0.5,
      pointHoverRadius: 0
    });
  }else{
    channelsDataset.push({
      label: `CH HR`,
      data: channelsData[i],
      borderWidth: 1,
      fill: false,
      borderColor: channelsColors[i],
      tension: 0.9,
      pointStyle: 'circle',
      pointRadius: 0.5,
      pointHoverRadius: 0
    });
  }
}

const generalChartData = {
    labels: volume_values,
    datasets: channelsDataset
}

const myChart = new Chart(ctx, {
    type: 'line',
    responsive: true,
    data: generalChartData,
    options: {
      animation: {
        duration: 0
      },
      scales: {
        y: {
            beginAtZero: true
        }
      }
    }
});



let widthn = 100/numeroDeCanales;
for(let i=0;i<numeroDeCanales;i++){
  data_chan.push({
    labels: volume_values,
    datasets: [channelsDataset[i]]
  });
  chCharts.push(new Chart(ctxCh[i], {
      type: 'line',
      data: data_chan[i],
      options: {
        plugins: {
          legend: {
            display:true,
            labels: {
              // usePointStyle: true,
              fontSize:1.0,
              boxWidth: 4,
            }
          } // Hide legend 
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
              beginAtZero: true
          },
          yAxes: [{
            ticks: {
                fontSize: 0
            }
        }]
        }
        
      }
  }));
  // chCharts[i].options.legend.display = false;
}

for(let i=0;i<numeroDeCanales;i++){
  chCharts[i].canvas.parentNode.style.width = `${widthn}%`;
  chCharts[i].canvas.parentNode.style.height = '20vh';
}






//UPDATE CHARTS=====================================================
var print_data = "";
var intervalCharts=setInterval(updateCharts,tiempoDeMuestreo*1000);


function updateCharts(){
  //arrDaraSerial: [CH0 CH1 CH2 CH3 CHT CHHR]
  //channels that dont send real data=> FF
  clearInterval(intervalCharts)
  if(chanIngresados && start){
    dataserial = updateData();
    // console.log(dataserial);
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = time+' ';
    print_data = dateTime+dataserial
    fs.writeFileSync(`./data_${report_time}.txt`,print_data,{ flag: 'a+' });
    
    // let texto = fs.readFileSync(`./data_${report_time}.txt`,{encoding:'utf8', flag:'r'});
    // texto.split(/\r?\n/).forEach(line =>  {
    //   console.log(`Line from file: ${line}`);
    // });

    // let texto = fs.readFileSync(`./data_${report_time}.txt`,{encoding:'utf8', flag:'r'});
    // let arr_lines= texto.split(/\r?\n/)
    
    //   console.log(`last line: ${arr_lines.slice(-2)}`);

    // console.log("sada:",texto)
    arrDaraSerial = dataserial.split(" "); //returns an array of each channel data
    while(channelsData[0].length>150){//un canal solo puede tener 255 puntos en la grafica
      for(let i=0;i<6;i++){
        channelsData[i].shift();
      }
      volume_values.shift();
    }
    volume_values.push(String(seg_totales)+" s");
    for(let i=0;i<6;i++){
      if(i+1<=4){
        if(i+1<=numeroDeCanales){
          channelsData[i].push(arrDaraSerial[i]);
        }
      }else{
        channelsData[i].push(arrDaraSerial[i]);
      }
      
    }
  
    myChart.update();
    for(let i=0;i<6;i++){
      chCharts[i].update();
    }
    // console.log(channelsData);
    // document.getElementById("ports").innerHTML=`Port data: ${arr}`;

    // channel0.innerHTML = `${arrDaraSerial[0]}`
    channel1.innerHTML = `${arrDaraSerial[0]}`
    channel2.innerHTML = `${arrDaraSerial[1]}`
    channel3.innerHTML = `${arrDaraSerial[2]}`
    channel4.innerHTML = `${arrDaraSerial[3]}`
    channelT.innerHTML = `${arrDaraSerial[4]}`
    channelHR.innerHTML = `${arrDaraSerial[5]}`

  }
  intervalCharts=setInterval(updateCharts,tiempoDeMuestreo*1000);
}






// TIMER =========================================================
const timer = document.getElementById('time-info')
timer.innerHTML = "00:00:00";
let seg_totales=0;

const timeProc = document.getElementById("time-proceso-info")
function updateTimeProceso(tiempoDeProceso){
  
  let horas = Math.round(parseInt(tiempoDeProceso)/60);
  let minutos = parseInt(tiempoDeProceso)%60;
  // console.log("horas: ",horas);
  let subStringHoras = `${horas}`;
  let subStringMinutos = `${minutos}`;
  if(horas<10){
    subStringHoras = `0${horas}`;
  }
  if(minutos<10){
    subStringMinutos = `0${minutos}`;
  }
   timeProc.innerHTML = `${subStringHoras}:${subStringMinutos}:00`;
}


function timeUpdate(){
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
}

setInterval(timeUpdate,1000);

// START BUTTON HANDLER ==================================
  
let report_time="";

const startButton = document.getElementById('start-button');
// startButton.disabled = true;

startButton.addEventListener('click',()=>{
  // console.log(channelsData);
  ipc.send('START-button-clicked',{
    configState: chanIngresados
  });
  if(chanIngresados){
    start = !start;
  }
  // console.log(start);
  if(start){
    while(channelsData[0].length!=0){
      for(let i=0;i<6;i++){
        channelsData[i].pop();
      }
      volume_values.pop();
    }
    seg_totales=0;
     
    //CREATION OF THE REGISTRY FILE
    report_time = new Date().toISOString().slice(-24).replace(/\D/g,'').slice(0, 14);
     console.log(`Inicio del proceso: ${report_time}`);
    //  try {
    //      fs.writeFileSync(`./data_${report_time}.txt`,"CH1\tCH2\tCH3\tCH4\tCHT\tCH HR\n\r");
    //      // file written successfully
    //    } catch (err) {
    //      console.error(err);
    //    }
       startButton.style.background="#53a785";
       startButton.style.color="white";
  }else{
    startButton.style.background="rgb(240,240,240)";
    startButton.style.color="black";

  }


  // if(!start){
  //   startButton.style.background="#f53b5d";
  //   startButton.style.color="white";
  //   // clearInterval(intervalCharts);
  // }else{
  //   startButton.style.background="#00c247";
  //   startButton.style.color="black";
    
  // }
});

// if(!start){
//   startButton.style.background="#f53b5d";
//   startButton.style.color="white";
// }else{
//   startButton.style.background="#00c247";
//   startButton.style.color="black";
//   seg_totales=0;
// }

// INFO SERIAL DISPLAYING ===================================

const channel1 = document.getElementById('channel1');
const channel2 = document.getElementById('channel2');
const channel3 = document.getElementById('channel3');
const channel4 = document.getElementById('channel4');
const channelT = document.getElementById('channelT');
const channelHR = document.getElementById('channelHR');




// PDF button ===================================================
const PDFbutton = document.getElementById("PDF-button");
PDFbutton.addEventListener("click",()=>{
  console.log("clicked PDF");
  ipc.send('PDF-button-clicked',{name_report: `./data_${report_time}.txt`});
});

//=========================================================


    













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
  
