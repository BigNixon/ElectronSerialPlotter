const electron = require('electron')
const ipc= electron.ipcRenderer;

//okbutton=============================================
const okButton = document.getElementById('button-ok');
const cancelButton = document.getElementById('button-cancel');
const inputValue = document.getElementById('input-num-channels');
const inputMuestreo = document.getElementById('input-time-muestreo');
const inputProceso = document.getElementById('input-time-proceso');

okButton.addEventListener('click',()=>{
  let numChan = inputValue.value;
  let timeMuestreo = inputMuestreo.value;
  let timeProceso = inputProceso.value;
  console.log(numChan);
  if(numChan<1 || numChan>4){
    ipc.send('config_numchannels_not_valid')
  }else{
    ipc.send('pressed-OK-button',{
      numeroDeCanales: numChan,
      tiempoDeMuestreo: timeMuestreo,
      tiempoDeProceso: timeProceso 
    });
  }
  
  
  // ipc.send(numChan);
});

cancelButton.addEventListener('click',()=>{
  ipc.send('pressed-CANCEL-button');
});


