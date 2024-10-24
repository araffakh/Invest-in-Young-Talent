const { app, BrowserWindow, Menu, Tray } = require("electron");
const WebSocket = require("ws");
const { encrypt, decrypt } = require("./function/crypt.js");
const { port, sendDataToFrontend } = require("./models/serialPortConnector.js");
const { ipcMain } = require("electron");

const ws = new WebSocket("ws://localhost:8080");

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

// Web Socket
ws.on("open", function open() {
    console.log("webSocket opened");
});

let toArduinoData = null;
let fromArduinoData = null;

ws.on("message", (event) => {
    toArduinoData = decrypt(event.data);
    if (port != null) {
        port.write(`${toArduinoData}`);
    }
});

// IPC
ipcMain.on("request-arduino-data", (event, data) => {
    event.sender.send("get-arduino-data", fromArduinoData);
});

ipcMain.on("request-recieved-data", (event, data) => {
    event.sender.send("get-recieved-data", toArduinoData);
});

ipcMain.on("serailCH", (event, data) => {
    let ledsData = data.states.map((item, index) => {
        return {
            name: index + 1,
            status: item,
        };
    });

    ledsData.push({
        name: 5,
        status: data.bright > 0 ? 1 : 0,
        bright: data.bright,
    });

    fromArduinoData = ledsData;

    ws.send(encrypt(JSON.stringify(ledsData)));
});

// closing
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
