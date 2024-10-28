// arduino.js
const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:4000"); // Replace with Render's URL when deployed

ws.on("open", () => {
    ws.send(JSON.stringify({ type: "arduino" }));
    console.log("Connected to WebSocket server as Arduino");
});

// Example function to send Arduino data
function sendArduinoData(data) {
    ws.send(JSON.stringify({ payload: data }));
}

// Example usage
setInterval(() => {
    sendArduinoData("Arduino data");
}, 1000);

ws.on("message", (data) => {
    console.log("Received from server:", data);
});
