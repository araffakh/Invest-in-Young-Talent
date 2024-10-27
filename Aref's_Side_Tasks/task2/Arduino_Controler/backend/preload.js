// the linker between rederer(front) and index(back)

const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
    // document IDs
    const DIDs = ["1", "2", "3", "4", "5"];

    // web socket
    socket.onopen = () => {
        console.log("Connected to the WebSocket server from frontend");
    };

    socket.onmessage = (event) => {
        let data = JSON.parse(event.data);
        if (data.from == "arduino") {
            showArduinoStatus(data.data);
        } else if (data.from == "recieved") {
            showRecieved(data.data);
        } else if (data.from == "logs") {
            showLogs(data.data);
        }
    };

    socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
    };

    socket.onclose = () => {
        console.log("Disconnected from the WebSocket server from frontend");
    };

    //Arduino State
    setInterval(() => {
        ipcRenderer.send("request-arduino-data", null);
    }, 5000);

    // frontend show functions
    function showArduinoStatus(data) {
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

    function showRecieved(data) {
        document.getElementById(`recieved`).innerText = data;
    }

    function showLogs(data) {
        const logsContainer = document.getElementById("logs-container");
        logsContainer.innerHTML = "";

        data.forEach((doc) => {
            const toDoDiv = document.createElement("div");
            toDoDiv.classList.add("log-list-item");

            const time = document.createElement("h5");
            const textDate = document.createElement("p");
            time.innerHTML = doc.time;
            textDate.innerHTML = doc.action;

            toDoDiv.appendChild(time);
            toDoDiv.appendChild(textDate);

            if (doc.error == false) {
                toDoDiv.classList.add("card card-outline card-success log");
            } else if (doc.error == true) {
                toDoDiv.classList.add("card card-outline card-danger log");
            }

            logsContainer.appendChild(toDoDiv);
        });
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
