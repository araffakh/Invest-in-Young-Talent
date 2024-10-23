// the linker between rederer(front) and index(back)

const { ipcRenderer } = require("electron");
const socket = new WebSocket("ws://localhost:8080");

window.addEventListener("DOMContentLoaded", () => {
    // document IDs
    const DIDs = [
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

    //connect and recieve data from server socket
    socket.onopen = () => {
        console.log("Connected to the WebSocket server from frontend");
    };

    socket.onmessage = (event) => {
        showJoystickData(JSON.parse(event.data));
    };

    socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
    };

    socket.onclose = () => {
        console.log("Disconnected from the WebSocket server from frontend");
    };

    //show joystick data
    function showJoystickData(data) {
        for (let i = 0; i < DIDs.length; i++) {
            document.getElementById(`${DIDs[i]}`).innerText = "";
        }

        for (let i = 0; i < DIDs.length; i++) {
            if (DIDs[i] == data.pressed) {
                document.getElementById(`${DIDs[i]}`).innerText = "pressed";
                break;
            }
        }

        document.getElementById(`result`).innerText = data.result;
    }

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
