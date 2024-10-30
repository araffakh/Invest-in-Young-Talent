// the linker between rederer(front) and index(back)

const socket = new WebSocket("ws://localhost:8080");

window.addEventListener("DOMContentLoaded", () => {
    // document IDs
    const DIDs = ["1", "2", "3", "4", "5"];

    // web socket
    socket.onopen = () => {
        socket.send("frontend");
    };

    setTimeout(() => {
        socket.send("frontend");
    }, 2000);

    socket.onmessage = (event) => {
        console.log(JSON.parse(event.data));
        let data = JSON.parse(event.data);
        if (data.from == "arduino") {
            showArduinoLedsStatus(data.data);
        } else if (data.from == "arduinoConnect") {
            showArduinoStatus(data.data, data.connected);
        } else if (data.from == "recieved") {
            showRecieved(data.data);
        } else if (data.from == "logs") {
            showLogs(data.data);
        } else if (data.from == "serverStatus") {
            setStatus(navigator.onLine, data.data);
        }
    };

    socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
    };

    socket.onclose = () => {
        console.log("Disconnected from the WebSocket server from frontend");
    };

    const homePage = document.getElementById("home-page-nav");

    homePage.addEventListener("click", () => {
        socket.send("arduino Status");
        showArduino = showArduino && !showArduino;
    });

    // frontend show functions

    function showArduinoStatus(data, status) {
        const arduinoType = document.getElementById("arduinoType");
        arduinoType.innerText = data.port;

        const arduinoStatus = document.getElementById("arduinoStatus");
        arduinoStatus.innerText = status ? "connected" : "disconnected";

        const arduinoBaud = document.getElementById("arduinobaud");
        arduinoBaud.innerText = data.baud;

        if (status == true) {
            arduinoStatus.classList.remove("bg-danger");
            arduinoStatus.classList.add("bg-success");
        } else {
            arduinoStatus.classList.remove("bg-success");
            arduinoStatus.classList.add("bg-danger");
        }
    }

    const arduinoPage = document.getElementById("arduino-status-page-nav");
    let showArduino = false;

    arduinoPage.addEventListener("click", () => {
        showArduino = !showArduino;
    });

    function showArduinoLedsStatus(data) {
        if (showArduino) {
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
    }

    function showRecieved(data) {
        document.getElementById(`recieved`).innerText = data;
    }

    const logsPage = document.getElementById("logs-page-nav");

    logsPage.addEventListener("click", () => {
        socket.send("logs");
        showArduino = showArduino && !showArduino;
    });

    function showLogs(data) {
        const logsContainer = document.getElementById("logs-container");
        if (!logsContainer) {
            return;
        }
        logsContainer.innerHTML = "";

        data.forEach((doc) => {
            const toDoDiv = document.createElement("div");
            toDoDiv.classList.add("log-list-item");
            toDoDiv.classList.add("card");
            toDoDiv.classList.add("card-outline");
            toDoDiv.classList.add("log");

            const time = document.createElement("h5");
            const textDate = document.createElement("p");
            time.innerHTML = doc.time;
            textDate.innerHTML = doc.action;

            toDoDiv.appendChild(time);
            toDoDiv.appendChild(textDate);

            if (doc.error == false) {
                toDoDiv.classList.add("bg-success");
            } else if (doc.error == true) {
                toDoDiv.classList.add("bg-danger");
            }

            logsContainer.appendChild(toDoDiv);
        });
    }

    // internet status
    function setStatus(status, serverStatus) {
        const statusNode = document.getElementById("status");
        statusNode.innerHTML = status
            ? "connected to internet"
            : "disconnected from internet";

        statusNode.style.color = status ? "green" : "red";

        const serverStatusNode = document.getElementById("WSstatus");
        serverStatusNode.innerHTML = serverStatus
            ? "connected to server"
            : "disconnected from server";

        serverStatusNode.style.color = serverStatus ? "green" : "red";
    }

    setStatus(navigator.onLine, false);

    window.addEventListener("Online", () => {
        setStatus(true);
    });

    window.addEventListener("Offline", () => {
        setStatus(false);
    });
});
