// 'use strict';
//=========================ELECTRON SECTION ======================
const electron = require('electron')
const app = electron.app;
const BrowserWindow=electron.BrowserWindow;
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const devtools = require('./devtools')
if (process.env.NODE_ENV === 'development') {
    devtools.run_dev_tools();
    // com4.openSerialCOM4();
}

let mainWindow;
let configWindow;

app.on('before-quit', ()=>{
    console.log("saliendo")
})

//executes orders when app is ready
app.on('ready', ()=>{ 
    createMainWindow();
    createConfigWindow();
})

let numChannels = -1;

ipc.on('config-window-open',function(event){
    // dialog.showMessageBox('example of a message');
    console.log("opened config window from main process")
    configWindow.show();
    event.returnValue = numChannels;
    console.log(numChannels);
});



ipc.on('pressed-OK-button',function(event,data){
    // console.log(event);
    console.log("OK button pressed from config window");
    
    numChannels = data.numeroDeCanales;
    console.log(numChannels);
    configWindow.hide();
    event.sender.send('reply-main-ipc',String(numChannels));
    mainWindow.webContents.send('numChannels', {numChannels});
})


ipc.on('pressed-CANCEL-button',function(event,data){
    // console.log(event);
    console.log("CANCEL button pressed from config window");
    configWindow.hide();
    
})




function createMainWindow(){
    mainWindow = new BrowserWindow({
        width: 850,
        height:478,
        title: 'Serial Com App',
        center: true,
        maximizable: true,
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
        minWidth: 850,
    })

    // mainWindow.maximize();
    mainWindow.once('ready-to-show',()=>{
        mainWindow.show();
      
    })
    mainWindow.on('resize', function () {
        setTimeout(function () {
          var size = mainWindow.getSize();
          mainWindow.setSize(size[0], parseInt(size[0] * 10 / 15));
        }, 0);
      });

    mainWindow.on('closed',()=>{
        mainWindow = null;
        app.quit();
    })

    mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
    // mainWindow.webContents.openDevTools();
}

function createConfigWindow(){
    configWindow = new BrowserWindow({
        alwaysOnTop:true,
        frame:false,
        resizable:false,
        show:false,
        // transparent:true,
        webPreferences:{
            nodeIntegration: true,
          contextIsolation: false,
        },
        width: 600,
        height: 200,
    })

    configWindow.loadURL(`file://${__dirname}/renderer2/index.html`);

    configWindow.on('closed',()=>{
        configWindow = null;
    })
}