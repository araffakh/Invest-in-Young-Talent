const { app, BrowserWindow, Menu } = require("electron");
const windowStateKeeper = require("electron-window-state");
const WebSocket = require("ws");
const path = require("node:path");
const Datastore = require("nedb");
const SerialManager = require("./models/serialManagerOnePort");
const { MainMenu } = require("./MainMenu.js");
const { translate } = require("./functions/translateDataFromArduino.js");
const cobs = require("cobs");
const EventEmitter = require("events").EventEmitter;

const myEmitter = new EventEmitter();
const SERVER = "invest-in-young-talent.onrender.com";
const ws = new WebSocket("wss://" + SERVER);
const server = new WebSocket.Server({ port: 8080 });
const db = new Datastore({ filename: "data.db", autoload: true });

//right click manu
const ContextMenu = Menu.buildFromTemplate([
    {
        label: "item 1",
    },
    {
        role: "editMenu",
    },
]);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    app.quit();
}

//create app windows
const createWindow = () => {
    //main top menu
    new MainMenu();

    //window state manager
    let winState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600,
    });

    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: winState.width,
        height: winState.height,
        x: winState.x,
        y: winState.y,
        minWidth: 800,
        minHeight: 650,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    //popup the right click menu
    mainWindow.webContents.on("context-menu", (e) => {
        ContextMenu.popup();
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "../frontend/index.html"));

    winState.manage(mainWindow);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

//---serial---
let toArduinoData = null;
let fromArduinoData = null;

myEmitter.on("frontend", (data) => {
    if (frontendID && frontendID.readyState === WebSocket.OPEN) {
        frontendID.send(JSON.stringify(data));
    } else {
        setTimeout(() => {
            if (frontendID && frontendID.readyState === WebSocket.OPEN) {
                frontendID.send(JSON.stringify(data));
            }
        }, 2000);
    }
});

myEmitter.on("server", (data) => {
    data = Buffer.from(data);
    const encoded = cobs.encode(data);
    ws.send(JSON.stringify({ payload: encoded }));

    insertLog({
        time: Date.now(),
        action: `sent ${data} to server`,
        error: false,
    });
});

// Initialize the port
let serialManager;

myEmitter.on("arduino", async (data) => {
    try {
        const success = await serialManager.send(data);
        if (success) console.log("Data Sent on port");
        else console.log("Failed to Send Data on port");
    } catch (error) {
        console.error("Error sending data:", error);
    }
});

// Open the connection
async function connectToArduino() {
    const connectionInterval = setInterval(async () => {
        try {
            await serialManager.openConnection();

            if (serialManager.isOpen) {
                let toFrontend = {
                    from: "arduinoConnect",
                    data: {
                        port: serialManager._tomain.serialport,
                        baud: serialManager._tomain.serialbaud,
                    },
                    connected: true,
                };

                setTimeout(() => {
                    myEmitter.emit("frontend", toFrontend);
                }, 1000);
                recieveFromArduino();

                clearInterval(connectionInterval);
            }
        } catch (err) {
            console.log("error connecting to Arduino: ", err, "\n");
            console.log("retrying connection ...\n\n");
        }
    }, 3000);
}

// Receive data
async function recieveFromArduino() {
    console.log("Listening for incoming data on port...", serialManager.isOpen);
    while (serialManager.isOpen) {
        try {
            const receivedData = await serialManager.receive();

            if (receivedData) {
                console.log("Received Data:", receivedData);
                fromArduinoData = translate(receivedData);

                let toFrontend = {
                    from: "arduino",
                    data: fromArduinoData,
                };

                myEmitter.emit("frontend", toFrontend);

                myEmitter.emit("server", fromArduinoData);

                insertLog({
                    time: Date.now(),
                    action: `sent ${fromArduinoData} to server`,
                    error: false,
                });
            }
        } catch (error) {
            console.error("Error receiving data:", error);

            insertLog({
                time: Date.now(),
                action: `sent ${fromArduinoData} to server`,
                error: true,
            });
        }
    }
}

// logs
function insertLog(data) {
    db.insert(data, (err, newDoc) => {
        if (err) {
            console.error(err);
            return;
        }

        getLogs();
    });
}

function getLogs() {
    db.find({}, (err, docs) => {
        if (err) {
            console.error(err);
            return null;
        }

        let toFrontend = {
            from: "logs",
            data: docs,
        };

        myEmitter.emit("frontend", toFrontend);
    });
}

// Web Socket
//server
ws.on("open", function open() {
    const data = Buffer.from("arduino");
    const encoded = cobs.encode(data);

    ws.send(JSON.stringify({ payload: encoded }));
    console.log("Connected to WebSocket server as Arduino");

    let toFrontend = {
        from: "serverStatus",
        data: true,
    };

    myEmitter.emit("frontend", toFrontend);

    insertLog({
        time: Date.now(),
        action: `connected to server server`,
        error: false,
    });
});

ws.on("message", (message) => {
    const data = cobs.decode(message);
    toArduinoData = data.toString();

    insertLog({
        time: Date.now(),
        action: `recieved ${toArduinoData} from server`,
        error: false,
    });

    myEmitter.emit("arduino", toArduinoData);

    let toFrontend = {
        from: "recieved",
        data: toArduinoData,
    };
    myEmitter.emit("frontend", toFrontend);
});

//local
let frontendID = null;
server.on("connection", (socket) => {
    socket.on("message", async (message) => {
        const stringedmessage = message.toString();

        if (stringedmessage == "frontend" && frontendID == null) {
            console.log("frontend connected");
            frontendID = socket;
        } else if (stringedmessage == "logs") {
            getLogs();
        } else if (stringedmessage == "arduino Status") {
            let toFrontend = {
                from: "arduino",
                data: fromArduinoData,
            };
            myEmitter.emit("frontend", toFrontend);

            let toFrontend2 = {
                from: "recieved",
                data: toArduinoData,
            };
            myEmitter.emit("frontend", toFrontend2);
        } else if (stringedmessage == "arduino connection") {
            if (serialManager.isOpen) {
                let toFrontend = {
                    from: "arduinoConnect",
                    data: {
                        port: serialManager._tomain.serialport,
                        baud: serialManager._tomain.serialbaud,
                    },
                    connected: true,
                };

                myEmitter.emit("frontend", toFrontend);
            } else {
                let toFrontend = {
                    from: "arduinoConnect",
                    connected: false,
                };

                myEmitter.emit("frontend", toFrontend);
            }
        } else {
            serialManager = await SerialManager.initializePort(stringedmessage);
            connectToArduino();
        }
    });
});

// closing
app.on("window-all-closed", async () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
