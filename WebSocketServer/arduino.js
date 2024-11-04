// arduino.js
const WebSocket = require("ws");
const SERVER = "invest-in-young-talent.onrender.com";
const crypt = require("./crypt");

const ws = new WebSocket("ws://localhost:3000");

// const ws = new WebSocket("wss://" + SERVER); // Replace with Render's URL when deployed

ws.on("open", () => {
    ws.send(crypt.encrypt(JSON.stringify({ type: "arduino" })));
    console.log("Connected to WebSocket server as Arduino");
});

// Example function to send Arduino data
function sendArduinoData(data) {
    ws.send(crypt.encrypt(JSON.stringify({ payload: data })));
}

// Example usage
setInterval(() => {
    sendArduinoData("Arduino data");
}, 1000);

ws.on("message", (data) => {
    const dencryptedData = crypt.decrypt(data.toString());
    console.log("Received from server:", dencryptedData);
});
