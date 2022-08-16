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







function createMainWindow(){
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        title: 'Serial Com App',
        center: true,
        maximizable: true,
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        }
    })

    mainWindow.maximize();
    mainWindow.once('ready-to-show',()=>{
        mainWindow.show();
      
    })

    mainWindow.on('move',()=>{
        const position = mainWindow.getPosition();
        console.log(`La posicion es: ${position}`);
        // win.webContents.executeJavaScript(`
        //   const container = document.getElementById("error")
        //   container.innerHTML = "modificado"
        // `)
    })

    mainWindow.on('closed',()=>{
        mainWindow = null;
        app.quit();
    })

    mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
    mainWindow.webContents.openDevTools();
}

function createConfigWindow(){
    configWindow = new BrowserWindow({
        alwaysOnTop:true,
        // frame:false,
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