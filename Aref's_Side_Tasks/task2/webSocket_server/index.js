const { createServer } = require("http");
const WebSocket = require("ws");
const crypt = require("./functions/crypt");

const server = createServer();

const WebSocketServer = new WebSocket.Server({ server: server });
let joyStickID = null;
let arduinoID = null;

WebSocketServer.on("connection", (ws, req) => {
    ws.on("message", (message) => {
        const decryptedMessage = crypt.decrypt(message);
        if (decryptedMessage == "joystick") {
            console.log("joystick connected");
            joyStickID = req.socket.remoteAddress;
        } else if (decryptedMessage == "arduino") {
            console.log("arduino connected");
            arduinoID = req.socket.remoteAddress;
        } else {
            if (req.socket.remoteAddress == joyStickID) {
                sendToArduino(message);
            } else if (req.socket.remoteAddress == arduinoID) {
                sendToJoystick(message);
            }
        }
    });
});

function sendToArduino(data) {
    if (arduinoID != null) {
        WebSocketServer.clients.forEach((client) => {
            if (client.remoteAddress == arduinoID) {
                client.send(data);
            }
        });
    } else {
        console.log("arduino not connected");
    }
}

function sendToJoystick(data) {
    if (joyStickID != null) {
        WebSocketServer.clients.forEach((client) => {
            if (client.remoteAddress == joyStickID) {
                client.send(data);
            }
        });
    } else {
        console.log("joystick not connected");
    }
}

server.listen(4000, () => console.log("listening on port 4000"));
