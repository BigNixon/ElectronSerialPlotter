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
  data: arr0,
  borderWidth: 1,
  fill: false,
  borderColor: 'rgb(0, 0, 0)',
  tension: 0.9,
  pointStyle: 'circle',
  pointRadius: 0,
  pointHoverRadius: 0
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
  console.log(`Numero: ${channelsData}`);
  // document.getElementById("ports").innerHTML=`Port data: ${arr}`;
},100);

























































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
  
