const { SerialPort, ReadlineParser } = require("serialport");
const parser = new ReadlineParser({
  delimiter: "\r\n",
});

let StatusfromArduino;
let brightfromArduino;

const port = new SerialPort({
  path: "COM4",
  baudRate: 115200,
});

port.on("open", () => {
  console.log("Serial Port opened, connected to Arduino");
});

port.on("error", (err) => {
  console.log("error opening the Serial Port" + err);
});

port.pipe(parser);

parser.on("data", (data) => {
  brightfromArduino = data.split(",")[0];
  StatusfromArduino = data.split(",")[1].split("-").map(Number);
});

function sendDataToControler() {
  if (brightfromArduino && StatusfromArduino) {
    return {
      bright: brightfromArduino,
      states: StatusfromArduino,
    };
  } else {
    setTimeout(() => {
      return {
        bright: brightfromArduino,
        states: StatusfromArduino,
      };
    }, 5000);
  }
}

module.exports = { port, sendDataToControler };
