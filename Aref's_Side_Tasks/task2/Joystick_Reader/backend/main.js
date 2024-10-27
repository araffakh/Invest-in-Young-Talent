const { app, BrowserWindow, Menu, Tray } = require("electron");
const WebSocket = require("ws");
const { encrypt, decrypt } = require("./functions/crypt.js");
const GameController = require("./models/controllers/NiavaGameController");
const ws = new WebSocket("http://localhost:4000");
const server = new WebSocket.Server({ port: 8080 });
const path = require("node:path");
const windowStateKeeper = require("electron-window-state");
const { MainMenu } = require("./MainMenu.js");
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
            nodeIntegration: false,
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
    mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

//joystick read
let fromArduinoData = null;
let controllerData = null;
const FREQUENCY = 100;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function initController() {
    let controller = await GameController.init();

    console.log("Controller connected");

    controller.on("data:raw", function (data) {
        if (data) {
            controllerData = data;
        }
    });
}

async function runApp() {
    await initController();
    console.log("Controller initialized");
    while (true) {
        if (controllerData) {
            ws.send(encrypt(controllerData));
            let toFrontend = {
                from: "joystick",
                data: controllerData,
            };
            sendToFrontend(toFrontend);

            insertLog({
                time: Date.now(),
                action: `sent ${controllerData} to server`,
                error: false,
            });
        }
        await sleep(1000 / FREQUENCY);
    }
}
runApp();

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
    ws.send(encrypt("joystick"));
});

ws.on("message", (event) => {
    const dencryptedMessage = decrypt(message);
    fromArduinoData = JSON.parse(dencryptedMessage);
    let toFrontend = {
        from: "arduino",
        data: fromArduinoData,
    };
    sendToFrontend(toFrontend);

    insertLog({
        time: Date.now(),
        action: `recieved ${fromArduinoData} from server`,
        error: false,
    });
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

// closing
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
