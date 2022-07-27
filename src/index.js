'use strict'

const {SerialPort} = require('serialport')
const {ReadlineParser} = require('@serialport/parser-readline')
const {app,BrowserWindow} = require('electron')

const port = new SerialPort({
    path:'COM4',
    baudRate:9600
  });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))


var data = []
parser.on('data',(line)=>{
      line = line.toString()
      var state = 0;
      if(line == "0.00 -0.0"){
        state=0;
        data = [{
            "x":-1,
            "y":-1
        }]
        // console.log("renovando")
      }else{
        state=1;
        var arr = line.split(" ");
        var dato = {
            "x":arr[0],
            "y":arr[1]
        }
        data.push(dato)
      }
      if(data.length==33){
        console.log(data)
      }
  })
  

app.on('before-quit', ()=>{
    console.log("saliendo")
})


//executes orders when app is ready
app.on('ready', ()=>{ 

    let win = new BrowserWindow({
        // width: 800,
        // height: 400,
        title: 'Serial Com',
        center: true,
        maximizable: true
    })

    win.on('move',()=>{
        // const position = win.getPosition();
        // console.log(`La posicion es: ${position}`);
        win.webContents.executeJavaScript(`
        const container = document.getElementById("error")
        container.innerHTML = "modificado"
        
    `)
    })

    win.once('ready-to-show',()=>{
        win.show();
    })

    win.on('closed',()=>{
        
        win = null;
        app.quit();
    })

    win.loadURL(`file://${__dirname}/renderer/index.html`);
    
})
