// joystick.js
const WebSocket = require("ws");
const cobs = require("cobs");

const SERVER = "invest-in-young-talent.onrender.com";

const ws = new WebSocket("wss://" + SERVER); // Replace with Render's URL when deployed

ws.on("open", () => {
    const data = Buffer.from("joystick");
    const encoded = cobs.encode(data);

    ws.send(JSON.stringify({ payload: encoded }));

    console.log("Connected to WebSocket server as Joystick");
});

// Example function to send joystick data
function sendJoystickData(data) {
    data = Buffer.from(data);
    const encoded = cobs.encode(data);
    ws.send(JSON.stringify({ payload: encoded }));
}

// Example usage
setInterval(() => {
    sendJoystickData("Joystick data");
}, 1000);

ws.on("message", (data) => {
    const decoded = cobs.decode(data);
    console.log("Received from server:", decoded.toString());
});
