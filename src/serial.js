/*====================================================================================
 *                        Serial port section
 *///==================================================================================
const { SerialPort } = require('serialport')
const serialPort = new SerialPort({
  path:'COM4',
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

var hexStr=`10`;// reads serial data and store
serialPortParser.on("data", function(data) {
  hexStr = data.toString('ascii');
  // console.log(hexStr);
});     

function updateData(){
  let nuevoString = hexStr.slice();
  return nuevoString;
}

exports.updateData = updateData;