// the linker between rederer(front) and index(back)

const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
    // document IDs
    const JDIDs = [
        "forward",
        "backward",
        "rightward",
        "leftward",
        "top",
        "bottom",
        "look right",
        "look left",
        "L1",
        "L2",
        "R1",
        "R2",
        "left drag button",
        "right drag button",
    ];

    const ADIDs = ["1", "2", "3", "4", "5"];

    // IPC
    setInterval(() => {
        ipcRenderer.send("request-joystick-data", null);
    }, 100);

    setInterval(() => {
        ipcRenderer.send("request-arduino-data", null);
    }, 5000);

    ipcRenderer.on("get-joystick-data", (event, data) => {
        if (data != null) {
            showJoystickData(data);
        }
    });

    ipcRenderer.on("get-arduino-data", (event, data) => {
        if (data != null) {
            showArduinoData(data);
        }
    });

    function showJoystickData(data) {
        for (let i = 0; i < DIDs.length; i++) {
            document.getElementById(`${JDIDs[i]}`).innerText = "";
        }

        for (let i = 0; i < DIDs.length; i++) {
            if (JDIDs[i] == data.pressed) {
                document.getElementById(`${JDIDs[i]}`).innerText = "pressed";
                break;
            }
        }

        document.getElementById(`result`).innerText = data.result;
    }

    ipcRenderer.on("get-arduino-data", (event, data) => {
        if (data != null) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].name !== 5) {
                    document.getElementById(`${ADIDs[i]}`).innerText =
                        data[i].status == 1 ? "ON" : "OFF";
                } else if (data[i].name == 5) {
                    document.getElementById(`${ADIDs[i]}`).innerTex =
                        data[i].status == 1 ? "ON" : "OFF";
                    document.getElementById(`bright`).innerTex = data[i].bright;
                }
            }
        }
    });

    // internet status
    function setStatus(status) {
        const statusNode = document.getElementById("status");
        statusNode.innerHTML = status
            ? "connected to internet"
            : "disconnected from internet";

        statusNode.style.color = status ? "green" : red;
    }

    setStatus(navigator.onLine);

    window.addEventListener("Online", () => {
        setStatus(true);
    });

    window.addEventListener("Offline", () => {
        setStatus(false);
    });
});
