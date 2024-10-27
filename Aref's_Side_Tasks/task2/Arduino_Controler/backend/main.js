const { app, BrowserWindow, Menu, Tray } = require("electron");
const WebSocket = require("ws");
const { encrypt, decrypt } = require("./functions/crypt.js");
const SerialManager = require("./models/serialManagerOnePort");
const { ipcMain } = require("electron");
const ws = new WebSocket("http://localhost:4000");
const server = new WebSocket.Server({ port: 8080 });
const path = require("node:path");
const windowStateKeeper = require("electron-window-state");
const { MainMenu } = require("./MainMenu.js");
const { translate } = require("./functions/translateDataFromArduino.js");
const Datastore = require("nedb");
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

//programs bar app icon
let tray;
let trayMenu = Menu.buildFromTemplate([
    {
        label: "item 1",
    },
    {
        role: "quit",
    },
]);

function createTray() {
    tray = new Tray("icon/niava.jpg");
    tray.setToolTip("task1");
    tray.setContextMenu(trayMenu);
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    app.quit();
}

//create app windows
let mainWindow;
const createWindow = () => {
    createTray();
    //main top menu
    new MainMenu();

    //window state manager
    let winState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600,
    });

    // Create the browser window.
    mainWindow = new BrowserWindow({
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
        show: false,
    });

    //popup the right click menu
    mainWindow.webContents.on("context-menu", (e) => {
        ContextMenu.popup();
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "../frontend/index.html"));

    winState.manage(mainWindow);

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

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
// Initialize the port
const serialManager = SerialManager.initializePort();

// Open the connection
async function connectToArduino() {
    await serialManager.openConnection();
}
connectToArduino();

// send data
async function sendToArduino(data) {
    try {
        const success = await serialManager.send(data);
        if (success) console.log("Data Sent on port");
        else console.log("Failed to Send Data on port");
    } catch (error) {
        console.error("Error sending data:", error);
    }
}

// Receive data
async function recieveFromArduino() {
    console.log("Listening for incoming data on port...", serialManager.isOpen);
    while (serialManager.isOpen) {
        console.log(serialManager.isOpen);

        try {
            const receivedData = await serialManager.receive();

            if (receivedData) {
                console.log("Received Data:", receivedData);
                fromArduinoData = translate(receivedData);

                let toFrontend = {
                    from: "arduino",
                    data: fromArduinoData,
                };
                sendToFrontend(toFrontend);

                ws.send(encrypt(JSON.stringify(fromArduinoData)));

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
recieveFromArduino();

// logs
async function insertLog(data) {
    await db.insert(data, (err, newDoc) => {
        if (err) {
            console.error(err);
            e.sender.send("toDoCH2", "Error inserting");
            return;
        }

        getLogs();
    });
}

async function getLogs() {
    await db.find({}, (err, docs) => {
        if (err) {
            console.error(err);
            return null;
        }

        let toFrontend = {
            from: "logs",
            data: docs,
        };
        sendToFrontend(toFrontend);
    });
}

// Web Socket
//server
ws.on("open", function open() {
    console.log("webSocket opened");
    ws.send(encrypt("arduino"));
});

ws.on("message", (event) => {
    toArduinoData = decrypt(event.data);
    sendToArduino(toArduinoData);

    insertLog({
        time: Date.now(),
        action: `recieved ${toArduinoData} from server`,
        error: false,
    });

    let toFrontend = {
        from: "recieved",
        data: toArduinoData,
    };
    sendToFrontend(toFrontend);
});

//local
let frontendID = null;
server.on("connection", (socket, req) => {
    frontendID = req.socket.remoteAddress;
    socket.on("message", () => {
        getLogs();
    });
});

function sendToFrontend(data) {
    server.clients.forEach((client) => {
        if (
            client.readyState === WebSocket.OPEN &&
            client.remoteAddress == frontendID
        ) {
            client.send(JSON.stringify(data));
        }
    });
}

// IPC
ipcMain.on("request-arduino-data", (event, data) => {
    event.sender.send("get-arduino-data", fromArduinoData);
});

ipcMain.on("request-recieved-data", (event, data) => {
    event.sender.send("get-recieved-data", toArduinoData);
});

// closing
app.on("window-all-closed", async () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
