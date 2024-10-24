// the linker between rederer(front) and index(back)

const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
    // document IDs
    const DIDs = ["1", "2", "3", "4", "5"];

    //Arduino State
    setInterval(() => {
        ipcRenderer.send("request-arduino-data", null);
    }, 5000);

    ipcRenderer.on("get-arduino-data", (event, data) => {
        if (data != null) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].name !== 5) {
                    document.getElementById(`${DIDs[i]}`).innerText =
                        data[i].status == 1 ? "ON" : "OFF";
                } else if (data[i].name == 5) {
                    document.getElementById(`${DIDs[i]}`).innerTex =
                        data[i].status == 1 ? "ON" : "OFF";
                    document.getElementById(`bright`).innerTex = data[i].bright;
                }
            }
        }
    });

    //recieved from WS
    setInterval(() => {
        ipcRenderer.send("request-recieved-data", null);
    }, 100);

    ipcRenderer.on("get-recieved-data", (event, data) => {
        if (data != null) {
            document.getElementById(`recieved`).innerText = data;
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
