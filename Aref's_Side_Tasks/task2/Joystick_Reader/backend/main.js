const { app, BrowserWindow, Menu, Tray } = require("electron");
const WebSocket = require("ws");
require("./models/joystickReader.js");
const { encrypt, decrypt } = require("./functions/crypt.js");
const { ipcMain } = require("electron");

server = new WebSocket.Server({ port: 8080 });

const path = require("node:path");
const windowStateKeeper = require("electron-window-state");
const { MainMenu } = require("./MainMenu.js");

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

let joystickData = null;
let fromArduinoData = null;

// Web Socket
server.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("message", (message) => {
        const dencryptedMessage = decrypt(message);
        fromArduinoData = JSON.parse(dencryptedMessage);
    });

    // joystick IPC
    ipcMain.on("joystickCH", (event, data) => {
        joystickData = data;
        let sendToWebSocket = data.result;
        socket.sender.send(encrypt(sendToWebSocket));
    });
});

// IPC
ipcMain.on("request-joystick-data", (event, data) => {
    event.sender.send("get-joystick-data", joystickData);
});

ipcMain.on("request-arduino-data", (event, data) => {
    event.sender.send("get-arduino-data", fromArduinoData);
});

// closing
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
