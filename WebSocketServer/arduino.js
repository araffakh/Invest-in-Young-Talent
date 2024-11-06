// arduino.js
const WebSocket = require("ws");
const SERVER = "invest-in-young-talent.onrender.com";
const cobs = require("cobs");

const ws = new WebSocket("wss://" + SERVER); // Replace with Render's URL when deployed

ws.on("open", () => {
    const data = Buffer.from("arduino");
    const encoded = cobs.encode(data);

    ws.send(JSON.stringify({ payload: encoded }));

    console.log("Connected to WebSocket server as Arduino");
});

// Example function to send Arduino data
function sendArduinoData(data) {
    data = Buffer.from(data);
    const encoded = cobs.encode(data);
    ws.send(JSON.stringify({ payload: encoded }));
}

// Example usage
setInterval(() => {
    sendArduinoData("Arduino data");
}, 1000);

ws.on("message", (data) => {
    const decoded = cobs.decode(data);

    console.log("Received from server:", decoded.toString());
});
