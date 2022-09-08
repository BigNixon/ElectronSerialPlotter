/*====================================================================================
 *                        Serial port section
 *///==================================================================================
const { SerialPort} = require('serialport')

var hexStr=`10.1 12.2 14.6 24.2 33.3\r\n`;// reads serial data and store

// DETECCION DEL COM =================================================================================================
let COMdisponible = SerialPort.list().then(function(ports){
  last_com = ports.pop().path;
  // console.log(last_com);
  return last_com
});
let serialPort;

// PROMESA RESUELVE EN TODO EL PROCESO DE RECEPCION DE DATOS ===================================================
COMdisponible.then(function(result){
  console.log(result)
  serialPort = new SerialPort({
    path:`${result}`,
    baudRate:57600
  });


  serialPort.on('open', function() { //OPEN SERIAL PORT
    if (serialPort.isOpen)
      console.log("Serial port is open");
  });

//   const { ByteLengthParser } = require('@serialport/parser-byte-length')
//   const serialPortParser = serialPort.pipe(new ByteLengthParser({
//     length: 8 // react only on every 8 bytes
//   }));
const {ReadlineParser} = require('@serialport/parser-readline')
const serialPortParser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }))


serialPortParser.on("data", function(data) {
  hexStr = data.toString('ascii');
  // console.log(hexStr);
});     

});


function updateData(){//functions returns the characters until a \n\r
  let nuevoString = hexStr.slice(); 
  return nuevoString;
}



exports.updateData = updateData;