// server.js
const { createServer } = require("http");
const WebSocket = require("ws");
const cobs = require("cobs");

const server = createServer();
const WebSocketServer = new WebSocket.Server({ server: server });

let joyStickClient = null;
let arduinoClient = null;
const PORT = process.env.PORT || 3000;
console.log("port " + process.env.PORT);

WebSocketServer.on("connection", (ws) => {
    ws.on("message", (message) => {
        const data = JSON.parse(message.toString());
        const decoded = cobs.decode(data.payload.data).toString();

        // Identify client type
        if (decoded === "joystick") {
            console.log("Joystick connected");
            joyStickClient = ws;
        } else if (decoded === "arduino") {
            console.log("Arduino connected");
            arduinoClient = ws;
        } else {
            // Forward messages
            const data = Buffer.from(decoded);
            const encoded = cobs.encode(data);
            if (ws === joyStickClient && arduinoClient) {
                arduinoClient.send(encoded);
            } else if (ws === arduinoClient && joyStickClient) {
                joyStickClient.send(encoded);
            }
        }
    });

    ws.on("close", () => {
        if (ws === joyStickClient) joyStickClient = null;
        if (ws === arduinoClient) arduinoClient = null;
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
