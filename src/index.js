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

ipc.on('START-button-clicked',function(e,data){
    let estado = data.configState;
    if(estado==0){
        const alerta_ingresar_config = {
            type: 'info',
            buttons: ['Ok'],
            // defaultId: 0,
            title: 'Notificacion',
            message: 'Debe ingresar la configuracion'
          };
        
          dialog.showMessageBox(null, alerta_ingresar_config, (response) => {
            console.log(response);
          });
    }
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
    // console.log("clicked screenshot");
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
                    buttonLabel: "Guardar",
                
                    // Restricting the user to only Image Files.
                    filters: [
                        {
                            name: "Documents",
                            extensions: ["png", "jpeg", "jpg", "pdf"],
                        },
                    ],
                    properties: [],
                })
                .then((file) => {
                    // Stating whether dialog operation was 
                    // cancelled or not.
                    // console.log(file.canceled);
                    if (!file.canceled) {
                        // console.log(file.filePath.toString());
                        // path_img = file.filePath.toString();
                        // Creating and Writing to the image.png file
                        // Can save the File as a jpeg file as well,
                        // by simply using img.toJPEG(100);
                        fs.writeFile(file.filePath.toString(), 
                                     img.toPNG(), "base64", function (err) {
                            if (err) throw err;
                            // console.log("Saved!");
                            
                            // let file_name = img_name.split(".")[0];
                            // console.log(img_name);
                                        // GENERATE PDF
                            let img_name = file.filePath.split(".")[0]; //KEEPING ALL BUT NOT EXTENSION
                            const doc = new PDFDocument
                            doc.pipe(fs.createWriteStream(`${img_name}.pdf`))
                            if (process.env.NODE_ENV === 'development') {
                                devtools.run_dev_tools();
                                // com4.openSerialCOM4();
                            }
                            // console.log("/".concat(upath.toUnix(path.relative('.',path_img))));
                            doc.fontSize(20);
                            doc.text("Reporte Humedad-Temperatura", 150,20,{
                                width: 300,
                                align: 'center',
                                valign: 'top',
                                underline: true,
                            });
                            doc.fontSize(10);
                            doc.text("Inicio del proceso:", 60,55);
                            doc.text("Tiempo programado:", 400,55);
                            doc.text("Fin del proceso:", 60,75);
                            doc.text("Canales de Control:", 60,95);
                            doc.image("./".concat(upath.toUnix(path.relative('.',path_img))),70,120, {
                                fit:[450,250],
                                align: 'center',
                                valign: 'center'
                                })
                                .rect(70, 120, 450, 250)
                                .stroke()
                            doc.moveDown();
                            doc.fontSize(18);
                            doc.text("Tabla de tiempos",70,400,{
                                width: 450,
                                align: 'center',
                                valign: 'top',
                                underline: true
                            });
                            let tableTop = 440
                            const hora = 80
                            const canal1 = 160
                            const canal2 = 240
                            const canal3 = 320
                            const canal4 = 400
                            const canalT = 480

                            doc
                                .fontSize(10)
                                .text('Hora', hora, tableTop, {bold: true})
                                .text('Canal 1', canal1, tableTop, {bold: true})
                                .text('Canal 2', canal2, tableTop, {bold: true})
                                .text('Canal 3', canal3, tableTop, {bold: true})
                                .text('Canal 4', canal4, tableTop, {bold: true})
                                .text('Canal T', canalT, tableTop, {bold: true})
                            doc.rect(hora, tableTop+10, 440, 0)
                                .stroke()
                            let offset_row=0;
                            for(let i=0;i<125;i++){
                                if(tableTop+(offset_row+1)*15>680){
                                    doc.addPage();
                                    tableTop=15;
                                    offset_row=0;
                                }
                                offset_row+=1;
                                doc
                                .fontSize(10)
                                .text('12:10:00', hora, tableTop+(offset_row)*15, {bold: true})
                                .text('20%', canal1, tableTop+(offset_row)*15, {bold: true})
                                .text('12%', canal2, tableTop+(offset_row)*15, {bold: true})
                                .text('-', canal3, tableTop+(offset_row)*15, {bold: true})
                                .text('-', canal4, tableTop+(offset_row)*15, {bold: true})
                                .text(`${i}°C`, canalT, tableTop+(offset_row)*15, {bold: true})
                            }
                            doc.end(); //file saved
                            const options_reporte_message = {
                                type: 'info',
                                buttons: ['Ok'],
                                // defaultId: 0,
                                title: 'Notificacion',
                                message: 'Reporte guardado correctamente'
                              };
                            
                              dialog.showMessageBox(null, options_reporte_message, (response) => {
                                console.log(response);
                              });
                            //deleting screenshot
                            console.log("Removing screenshot:", file.filePath);
                            fs.unlinkSync(file.filePath);
                            

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
        width: 761,
        height:462,
        title: 'Serial Com App',
        center: true,
        maximizable: true,
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
        minWidth: 850,
        // maxHeight: 910,
    })

    // mainWindow.maximize();
    mainWindow.once('ready-to-show',()=>{
        mainWindow.show();
        
    })
    mainWindow.on('resize', function () {
        setTimeout(function () {
          var size = mainWindow.getSize();
          mainWindow.setSize(size[0], parseInt(size[0] * 9 / 15));
        }, 0);
      });

    mainWindow.on('closed',()=>{
        mainWindow = null;
        app.quit();
    })

    mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
    // mainWindow.webContents.openDevTools();
    mainWindow.on('close', function (e) {
        let response_close = dialog.showMessageBoxSync(this, {
            type: 'question',
            buttons: ['Yes', 'No'],
            title: 'Confirm',
            message: 'Are you sure you want to quit?'
        });
    
        if(response_close == 1) e.preventDefault();
    });
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


