const electron = require('electron')
const ipc= electron.ipcRenderer;

//okbutton=============================================
const okButton = document.getElementById('button-ok');
const inputValue = document.getElementById('input-num-channels');
okButton.addEventListener('click',()=>{
  let numChan = inputValue.value;
  console.log(numChan);
  ipc.send('pressed-OK-button',{
    numeroDeCanales: numChan
  });
  // ipc.send(numChan);
});
