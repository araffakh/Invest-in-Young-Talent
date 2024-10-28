// joystick.js
const WebSocket = require("ws");

const SERVER = "invest-in-young-talent.onrender.com";

const ws = new WebSocket("wss://" + SERVER); // Replace with Render's URL when deployed

ws.on("open", () => {
    ws.send(JSON.stringify({ type: "joystick" }));
    console.log("Connected to WebSocket server as Joystick");
});

// Example function to send joystick data
function sendJoystickData(data) {
    ws.send(JSON.stringify({ payload: data }));
}

// Example usage
setInterval(() => {
    sendJoystickData("Joystick data");
}, 1000);

ws.on("message", (data) => {
    console.log("Received from server:", data);
});
