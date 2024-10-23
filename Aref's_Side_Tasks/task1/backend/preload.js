// the linker between rederer(front) and index(back)

const { ipcRenderer } = require("electron");
const socket = new WebSocket("ws://localhost:8080");

window.addEventListener("DOMContentLoaded", () => {
    //connect and recieve data from server socket
    socket.onopen = () => {
        console.log("Connected to the WebSocket server from frontend");
    };

    socket.onmessage = (event) => {
        console.log(`Frontend Received Joystick Data: ${event.data}`);
    };

    socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
    };

    socket.onclose = () => {
        console.log("Disconnected from the WebSocket server from frontend");
    };

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
