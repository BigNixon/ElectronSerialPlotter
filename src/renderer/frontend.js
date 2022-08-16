let {updateData} = require('../serial')

//=====================HTML SECTION ==========================
var volume_values = [];
var arr0 = [];
var arr1 = [];
var arr2 = [];
var i=0;


const ctx = document.getElementById('myChart');

const exp_dataset = {
    label: 'Flujo Expiracion vs Volumen',
    data: arr1,
    borderWidth: 1,
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.9,
    pointStyle: 'circle',
    pointRadius: 0,
    pointHoverRadius: 0
}

const ins_dataset = {
  label: 'Flujo Inspiracion vs Volumen',
  data: arr2,
  borderWidth: 1,
  fill: false,
  borderColor: 'rgb(192, 75, 75)',
  tension: 0.9,
  pointStyle: 'circle',
  pointRadius: 0,
  pointHoverRadius: 0
}

const zero_line = {
  label: '',
  data: arr0,
  borderWidth: 1,
  fill: false,
  borderColor: 'rgb(255,255,255)',
  tension: 0.9,
  pointStyle: 'circle',
  pointRadius: 0,
  pointHoverRadius: 0,
}

const data_exp = {
    labels: volume_values,
    datasets: [exp_dataset,ins_dataset,zero_line]
}


const myChart = new Chart(ctx, {
    type: 'line',
    data: data_exp,
    options: {
      scales: {
        y: {
            beginAtZero: true
        }
      }
    }
});

setInterval(()=>{
  i=i+1;
  let dataserial = updateData();
  let channelsData = dataserial.split(" ");
  while(arr0.length>255){
    
      
      arr0.shift();
      arr1.shift();
      arr2.shift();
      volume_values.shift();
    
  }
    volume_values.push(i);
    arr0.push(0);
    arr1.push(channelsData[0]);
    arr2.push(channelsData[1]);
  
  myChart.update();
  myChart0.update();
  myChart1.update();
  console.log(`Numero: ${channelsData}`);
  // document.getElementById("ports").innerHTML=`Port data: ${arr}`;
},100);


module.exports = {arr0,arr1,arr2};



const ctx0 = document.getElementById('canvas-channel0');
const channel0_dataset = {
    label: 'Channel 0',
    data: arr1,
    borderWidth: 1,
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.9,
    pointStyle: 'circle',
    pointRadius: 0,
    pointHoverRadius: 0
}

const data_chan0 = {
    labels: volume_values,
    datasets: [channel0_dataset,zero_line]
}


const myChart0 = new Chart(ctx0, {
    type: 'line',
    data: data_chan0,
    options: {
      scales: {
        y: {
            beginAtZero: true
        }
      }
    }
});

myChart0.canvas.parentNode.style.height = '10%';
myChart0.canvas.parentNode.style.width = '30%';



const ctx1 = document.getElementById('canvas-channel1');
const channel1_dataset = {
    label: 'Channel 1',
    data: arr2,
    borderWidth: 1,
    fill: false,
    borderColor: 'rgb(192, 75, 75)',
    tension: 0.9,
    pointStyle: 'circle',
    pointRadius: 0,
    pointHoverRadius: 0
}

const data_chan1 = {
    labels: volume_values,
    datasets: [channel1_dataset,zero_line]
}


const myChart1 = new Chart(ctx1, {
    type: 'line',
    data: data_chan1,
    options: {
      scales: {
        y: {
            beginAtZero: true
        }
      }
    }
});



myChart1.canvas.parentNode.style.height = '10%';
myChart1.canvas.parentNode.style.width = '30%';



















































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
  
