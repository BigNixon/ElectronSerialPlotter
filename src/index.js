'use strict';
//=========================ELECTRON SECTION ======================
const {app,BrowserWindow} = require('electron')
// const {serialCom} = require('./serial')
// const com4=new serialCom();
const devtools = require('./devtools')
if (process.env.NODE_ENV === 'development') {
    devtools.run_dev_tools();
    // com4.openSerialCOM4();
}

app.on('before-quit', ()=>{
    console.log("saliendo")
})

//executes orders when app is ready
app.on('ready', ()=>{ 

    let win = new BrowserWindow({
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

    win.maximize();
    win.once('ready-to-show',()=>{
      win.show();
      
    })

    win.on('move',()=>{
        const position = win.getPosition();
        console.log(`La posicion es: ${position}`);
        // win.webContents.executeJavaScript(`
        //   const container = document.getElementById("error")
        //   container.innerHTML = "modificado"
        // `)
    })

    win.on('closed',()=>{
        win = null;
        app.quit();
    })

    win.loadURL(`file://${__dirname}/renderer/index.html`);
    win.webContents.openDevTools();
})
