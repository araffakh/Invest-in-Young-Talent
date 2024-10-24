const { SerialPort, ReadlineParser } = require("serialport");
const { ipcRenderer } = require("electron");
const parser = new ReadlineParser({
    delimiter: "\r\n",
});

let StatusfromArduino;
let brightfromArduino;

let port = null;

async function connectToArduino() {
    port = await new SerialPort({
        path: "COM4",
        baudRate: 115200,
    });

    port.on("error", (err) => {
        console.log("couldn't connect to joystick, retrying...");

        setTimeout(() => {
            connectToArduino();
        }, 3000);
    });

    port.on("open", () => {
        console.log("Serial Port opened, connected to Arduino");
        port.pipe(parser);
    });

    parser.on("data", (data) => {
        brightfromArduino = data.split(",")[0];
        StatusfromArduino = data.split(",")[1].split("-").map(Number);
        sendDataToFrontend();
    });
}
connectToArduino();

function sendDataToFrontend() {
    let data = {
        bright: brightfromArduino,
        states: StatusfromArduino,
    };

    ipcRenderer.send("serailCH", data);
}

module.exports = { port };
