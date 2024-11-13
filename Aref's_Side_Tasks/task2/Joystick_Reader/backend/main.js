const { app, BrowserWindow, Menu } = require("electron");
const windowStateKeeper = require("electron-window-state");
const WebSocket = require("ws");
const path = require("node:path");
const Datastore = require("nedb");
const EventEmitter = require("events").EventEmitter;
const GameController = require("./models/controllers/NiavaGameController");
const { MainMenu } = require("./MainMenu.js");
const {
    checkControllerData,
    calcResult,
} = require("./functions/checkControllerData.js");
const cobs = require("cobs");

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
            nodeIntegration: false,
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

//joystick read
let controllerResultData = null;
let lastArduinoStatus = [
    {
        name: 1,
        status: 0,
    },
    {
        name: 2,
        status: 0,
    },
    {
        name: 3,
        status: 0,
    },
    {
        name: 4,
        status: 0,
    },
    {
        name: 5,
        status: 0,
        bright: 0,
    },
];
let conrolerStatus = null;

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

myEmitter.on("joystick", (data) => {
    let controlerData = "";

    if (typeof data == "string") {
        controlerData = data;
    } else {
        if (
            !(
                data["axis:JOYR:X"] == 0 &&
                data["axis:JOYR:Y"] == 0 &&
                data["axis:JOYL:X"] == 127 &&
                data["axis:JOYL:Y"] == 127
            ) &&
            !(
                data["axis:JOYR:X"] == 15 &&
                data["axis:JOYR:Y"] == 15 &&
                data["axis:JOYL:X"] == 0 &&
                data["axis:JOYL:Y"] == 0
            )
        ) {
            controlerData = checkControllerData(data);
        }
    }

    let result = calcResult(controlerData, lastArduinoStatus);
    let send = result.send;
    controllerResultData =
        result.result !== "" ? result.result : controllerResultData;
    console.log(controllerResultData);
    let toFrontend = {
        from: "joystick",
        data: controlerData,
        result: controllerResultData,
    };

    myEmitter.emit("frontend", toFrontend);

    if (send) {
        myEmitter.emit("server", controllerResultData);
    }
});

async function initController() {
    let controller = await GameController.init();

    controller.on("joystickConnected", () => {
        let toFrontend = {
            from: "joystickConnect",
            data: controller._tomain,
            connected: true,
        };

        conrolerStatus = toFrontend;

        if (frontendID) {
            myEmitter.emit("frontend", toFrontend);
        } else {
            setTimeout(() => {
                myEmitter.emit("frontend", toFrontend);
            }, 1000);
        }
    });

    controller.on("disconnect", () => {
        let toFrontend = {
            from: "joystickConnect",
            data: null,
            connected: false,
        };

        conrolerStatus = toFrontend;

        myEmitter.emit("frontend", toFrontend);
    });

    controller.on("control", function (data) {
        if (data) {
            myEmitter.emit("joystick", data);
        }
    });
}

async function runApp() {
    await initController();
    console.log("Controller initialized");
}
runApp();

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
    const data = Buffer.from("joystick");
    const encoded = cobs.encode(data);

    ws.send(JSON.stringify({ payload: encoded }));
    console.log("Connected to WebSocket server as Joystick");

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
    const decoded = cobs.decode(message);
    const fromArduinoData = decoded.toString();

    lastArduinoStatus = fromArduinoData;

    let toFrontend = {
        from: "arduino",
        data: fromArduinoData,
    };

    myEmitter.emit("frontend", toFrontend);

    insertLog({
        time: Date.now(),
        action: `recieved ${fromArduinoData} from server`,
        error: false,
    });
});

//local
let frontendID = null;

server.on("connection", (socket) => {
    console.log("frontend connected");

    socket.on("message", (message) => {
        if (frontendID == null) {
            frontendID = socket;
        } else if (message.toString() == "joystick Status") {
            myEmitter.emit("frontend", conrolerStatus);
        } else if (message.toString() == "logs") {
            getLogs();
        }
    });
});

// closing
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
