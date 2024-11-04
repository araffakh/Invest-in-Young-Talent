// server.js
const { createServer } = require("http");
const WebSocket = require("ws");
const crypt = require("./crypt");

const server = createServer();
const WebSocketServer = new WebSocket.Server({ server: server });

let joyStickClient = null;
let arduinoClient = null;
// const PORT = process.env.PORT || 3000;
const PORT = 3000;
// console.log("port " + process.env.PORT);

WebSocketServer.on("connection", (ws) => {
    ws.on("message", (message) => {
        const data = JSON.parse(crypt.decrypt(message.toString()));

        // Identify client type
        if (data.type === "joystick") {
            console.log("Joystick connected");
            joyStickClient = ws;
        } else if (data.type === "arduino") {
            console.log("Arduino connected");
            arduinoClient = ws;
        } else {
            // Forward messages
            if (ws === joyStickClient && arduinoClient) {
                arduinoClient.send(crypt.encrypt(data.payload));
            } else if (ws === arduinoClient && joyStickClient) {
                joyStickClient.send(crypt.encrypt(data.payload));
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
