// server.js
const { createServer } = require("http");
const WebSocket = require("ws");


const PORT = process.env.PORT || 3000;
console.log('port ' + process.env.PORT);
const server = http.createServer(app);
const WebSocketServer = new WebSocket.Server({ server: server });

let joyStickClient = null;
let arduinoClient = null;

WebSocketServer.on("connection", (ws) => {
    ws.on("message", (message) => {
        const data = JSON.parse(message);

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
                arduinoClient.send(data.payload);
            } else if (ws === arduinoClient && joyStickClient) {
                joyStickClient.send(data.payload);
            }
        }
    });

    ws.on("close", () => {
        if (ws === joyStickClient) joyStickClient = null;
        if (ws === arduinoClient) arduinoClient = null;
    });
});

server.listen(4000, () => console.log("WebSocket Server running on port 4000"));
