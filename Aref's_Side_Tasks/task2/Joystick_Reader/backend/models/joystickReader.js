const HID = require("node-hid");
const { ipcRenderer } = require("electron");
// const WebSocket = require("ws");

// let socket;

// const connectWebSocket = () => {
//     socket = new WebSocket("ws://localhost:8080");

//     socket.onopen = () => {
//         console.log("Connected to WebSocket server from joystick");
//     };

//     socket.onclose = () => {
//         console.log("Disconnected from WebSocket server from joystick");

//         setTimeout(connectWebSocket, 1000);
//     };
// };

let joystick = null;

async function connectToJoystick() {
    const devices = HID.devices();
    for (let i = 0; i < devices.length; i++) {
        if (
            devices[i].product.includes("USB Joystick") &&
            devices[i].vendorId == 121 &&
            devices[i].productId == 6
        ) {
            console.log("port to joystick opened");
            joystick = await new HID.HID(121, 6);
            connectWebSocket();
            if (joystick != null) {
                joystick.on("data", (data) => {
                    control(JSON.stringify(data));
                });
            } else if (joystick == null) {
                console.log("error opening joystick port");
            }
            break;
        }
    }
    if (joystick == null) {
        console.log("couldn't connect to joystick, retrying...");

        setTimeout(() => {
            connectToJoystick();
        }, 3000);
    }
}
connectToJoystick();

let joyStickData = "";
let lastLeft;
let lastRight;
let lastButtons;
let dataToArduino = "";

function control(data) {
    joyStickData = data.split('"').slice(6)[0].slice(2, -2);
    let left = joyStickData.split(",")[0] + "-" + joyStickData.split(",")[1];
    let right = joyStickData.split(",")[5];
    let buttons = joyStickData.split(",")[6];

    //movment side
    if (lastLeft !== left) {
        if (left == "127-0") {
            //forward
            if (
                dataToArduino == "L" ||
                dataToArduino == "B" ||
                dataToArduino == "S"
            ) {
                dataToArduino += "1";
            } else if (dataToArduino.length == 2 && dataToArduino[0] == "B") {
                dataToArduino += "0";
            } else if (dataToArduino[0] == "S") {
                dataToArduino += "0";
            }
            sendToServer("forward");
        } else if (left == "127-255") {
            //backward
            if (
                dataToArduino == "L" ||
                dataToArduino == "B" ||
                dataToArduino == "S"
            ) {
                dataToArduino += "2";
            } else if (dataToArduino.length == 2 && dataToArduino[0] == "B") {
                dataToArduino += "40";
            } else if (dataToArduino[0] == "S") {
                dataToArduino += "25";
            }
            sendToServer("backward");
        } else if (left == "255-127") {
            //right
            if (
                dataToArduino == "L" ||
                dataToArduino == "B" ||
                dataToArduino == "S"
            ) {
                dataToArduino += "3";
            } else if (dataToArduino.length == 2 && dataToArduino[0] == "B") {
                dataToArduino += "80";
            } else if (dataToArduino[0] == "S") {
                dataToArduino += "50";
            }
            sendToServer("rightward");
        } else if (left == "0-127") {
            //left
            if (
                dataToArduino == "L" ||
                dataToArduino == "B" ||
                dataToArduino == "S"
            ) {
                dataToArduino += "4";
            } else if (dataToArduino.length == 2 && dataToArduino[0] == "B") {
                dataToArduino += "120";
            } else if (dataToArduino[0] == "S") {
                dataToArduino += "75";
            }
            sendToServer("leftward");
        }
        lastLeft = left;
    }

    //looking side
    if (lastRight !== right) {
        if (right == 31) {
            //top
            if (
                dataToArduino == "L" ||
                dataToArduino == "B" ||
                dataToArduino == "S"
            ) {
                dataToArduino += "5";
            } else if (dataToArduino.length == 2 && dataToArduino[0] == "B") {
                dataToArduino += "160";
            } else if (dataToArduino[0] == "S") {
                dataToArduino += "100";
            }
            sendToServer("top");
        } else if (right == 79) {
            //bottom
            if (dataToArduino.length == 2 && dataToArduino[0] == "B") {
                dataToArduino += "200";
            } else if (dataToArduino[0] == "S") {
                dataToArduino += "125";
            }
            sendToServer("bottom");
        } else if (right == 47) {
            //right
            if (dataToArduino.length == 2 && dataToArduino[0] == "B") {
                dataToArduino += "225";
            } else if (dataToArduino[0] == "S") {
                dataToArduino += "150";
            }
            sendToServer("look right");
        } else if (right == 143) {
            //left
            if (dataToArduino.length == 2 && dataToArduino[0] == "B") {
                dataToArduino += "255";
            } else if (dataToArduino[0] == "S") {
                dataToArduino += "180";
            }
            sendToServer("look left");
        }

        lastRight = right;
    }

    //buttons
    if (lastButtons !== buttons) {
        if (buttons == 1) {
            //L1
            dataToArduino = "L";
            sendToServer("L1");
        } else if (buttons == 2) {
            //R1
            dataToArduino = "S";
            sendToServer("R1");
        } else if (buttons == 4) {
            //L2
            dataToArduino = "B";
            sendToServer("L2");
        } else if (buttons == 8) {
            //R2
            console.log(`message: ${dataToArduino}`);
            sendToServer("R2");
        } else if (buttons == 16) {
            //select
            sendToServer();
            // port.write(`${dataToArduino}\n`, (err) => {
            //     console.log(`Message sent to Arduino: ${dataToArduino}`);
            // });
        } else if (buttons == 32) {
            //start
            dataToArduino = "";
            sendToServer();
        } else if (buttons == 64) {
            //left drag button
            if (dataToArduino[0] == "L" && dataToArduino.length == 2) {
                if (
                    dataToArduino[1] == "1" ||
                    dataToArduino[1] == "2" ||
                    dataToArduino[1] == "3" ||
                    dataToArduino[1] == "4" ||
                    dataToArduino[1] == "5"
                ) {
                    dataToArduino += "1";
                }
            } else if (dataToArduino[0] == "S") {
                dataToArduino += "-";
            }
            sendToServer("left drag button");
        } else if (buttons == 128) {
            //right drag button
            if (dataToArduino[0] == "L" && dataToArduino.length == 2) {
                if (
                    dataToArduino[1] == "1" ||
                    dataToArduino[1] == "2" ||
                    dataToArduino[1] == "3" ||
                    dataToArduino[1] == "4" ||
                    dataToArduino[1] == "5"
                ) {
                    dataToArduino += "0";
                }
            }
            sendToServer("right drag button");
        }
        lastButtons = buttons;
    }
}

function sendToServer(dataFromController) {
    let data = {
        pressed: dataFromController ? dataFromController : "",
        result: dataToArduino,
    };

    ipcRenderer.send("joystickCH", data);
}
