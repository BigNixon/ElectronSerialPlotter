// 'use strict';
//=========================ELECTRON SECTION ======================
const electron = require('electron')
const app = electron.app;
var screenshot = require('electron-screenshot-app');
const BrowserWindow=electron.BrowserWindow;
const path = require("path");
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const fs = require('fs');
const devtools = require('./devtools')
const PDFDocument = require('pdfkit');
const upath = require('upath');

let mainWindow;
let configWindow;

//executes orders when app is ready
app.on('ready', ()=>{ 
    createMainWindow();
    createConfigWindow();
})

let numChannels = 5;
let tiempoProceso = 10;
let tiempoMuestreo = 5;

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
    tiempoProceso = data.tiempoDeProceso;
    tiempoMuestreo = data.tiempoDeMuestreo;
    console.log(numChannels);
    console.log(tiempoProceso);
    console.log(tiempoMuestreo);
    configWindow.hide();
    // event.sender.send('reply-main-ipc',String(numChannels));
    mainWindow.webContents.send('numChannels', {numChannels});
    mainWindow.webContents.send('timeMuestreo', {tiempoMuestreo});
    mainWindow.webContents.send('timeProceso', {tiempoProceso});

})


ipc.on('pressed-CANCEL-button',function(event,data){
    // console.log(event);
    console.log("CANCEL button pressed from config window");
    configWindow.hide();
    
})

ipc.on('PDF-button-clicked',()=>{
    console.log("clicked screenshot");
    let path_img="";
    mainWindow.webContents
        .capturePage({
            x: 0,
            y: 0,
            width: mainWindow.getSize()[0],
            height: mainWindow.getSize()[1],
        })
        .then((img) => {
            dialog
                .showSaveDialog({
                    title: "Select the File Path to save",
                
                    // Default path to assets folder
                    defaultPath: path.join(__dirname, 
                                           ""),
                
                    // defaultPath: path.join(__dirname, 
                    // '../assets/image.jpeg'),
                    buttonLabel: "Save",
                
                    // Restricting the user to only Image Files.
                    filters: [
                        {
                            name: "Image Files",
                            extensions: ["png", "jpeg", "jpg"],
                        },
                    ],
                    properties: [],
                })
                .then((file) => {
                    // Stating whether dialog operation was 
                    // cancelled or not.
                    console.log(file.canceled);
                    if (!file.canceled) {
                        console.log(file.filePath.toString());
                        // path_img = file.filePath.toString();
                        // Creating and Writing to the image.png file
                        // Can save the File as a jpeg file as well,
                        // by simply using img.toJPEG(100);
                        fs.writeFile(file.filePath.toString(), 
                                     img.toPNG(), "base64", function (err) {
                            if (err) throw err;
                            console.log("Saved!");
                            let img_name = file.filePath.split(".")[0];
                            // let file_name = img_name.split(".")[0];
                            console.log(img_name);
                            doc = new PDFDocument
                            
                            doc.pipe(fs.createWriteStream(`${img_name}.pdf`))
                            if (process.env.NODE_ENV === 'development') {
                                devtools.run_dev_tools();
                                // com4.openSerialCOM4();
                            }
                            console.log("/".concat(upath.toUnix(path.relative('.',path_img))))
                            doc.image("./".concat(upath.toUnix(path.relative('.',path_img))), {
                                fit: [300, 300],
                                align: 'center',
                                valign: 'center'
                                });
                            doc.end()
                        });
                        path_img = file.filePath.toString();
                        
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            
        })
        .catch((err) => {
            console.log(err);
        });
})



function createMainWindow(){
    mainWindow = new BrowserWindow({
        width: 950,
        height:600,
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
        width: 500,
        height: 400,
    })

    configWindow.loadURL(`file://${__dirname}/renderer2/index.html`);

    configWindow.on('closed',()=>{
        configWindow = null;
    })
}


