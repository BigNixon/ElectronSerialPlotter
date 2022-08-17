const electron = require('electron')
const ipc= electron.ipcRenderer;

//okbutton=============================================
const okButton = document.getElementById('button-ok');
const cancelButton = document.getElementById('button-cancel');
const inputValue = document.getElementById('input-num-channels');
okButton.addEventListener('click',()=>{
  let numChan = inputValue.value;
  console.log(numChan);
  ipc.send('pressed-OK-button',{
    numeroDeCanales: numChan
  });
  // ipc.send(numChan);
});

cancelButton.addEventListener('click',()=>{
  ipc.send('pressed-CANCEL-button');
});
