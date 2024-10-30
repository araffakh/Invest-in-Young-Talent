// the linker between rederer(front) and index(back)

const socket = new WebSocket("ws://localhost:8080");

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

    // web socket

    socket.onopen = () => {
        socket.send("hello");

        console.log("Connected to the WebSocket server from frontend");
    };

    setTimeout(() => {
        socket.send("");
    }, 2000);

    socket.onmessage = (event) => {
        console.log(JSON.parse(event.data));
        let data = JSON.parse(event.data);
        if (data.from == "joystick") {
            showJoystickData(data.data, data.result);
        } else if (data.from == "joystickConnect") {
            showJoystickStatus(data.data, data.connected);
        } else if (data.from == "arduino") {
            showArduinoData(data.data);
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
        socket.send("joystick Status");
        showJoystick = showJoystick && !showJoystick;
        showArduino = showArduino && !showArduino;
    });

    function showJoystickStatus(data, status) {
        const joystickType = document.getElementById("joystickType");
        joystickType.innerText = data;

        const joystickStatus = document.getElementById("joystickStatus");
        joystickStatus.innerText = status ? "connected" : "disconnected";

        if (status == true) {
            joystickStatus.classList.remove("bg-danger");
            joystickStatus.classList.add("bg-success");
        } else {
            joystickStatus.classList.remove("bg-success");
            joystickStatus.classList.add("bg-danger");
        }
    }

    const joystickPage = document.getElementById("joystick-page-nav");
    let showJoystick = false;

    joystickPage.addEventListener("click", () => {
        showJoystick = !showJoystick;
        showArduino = showArduino && !showArduino;
    });

    function showJoystickData(data, result) {
        if (showJoystick) {
            for (let i = 0; i < JDIDs.length; i++) {
                document.getElementById(`${JDIDs[i]}`).innerText = "";
            }

            for (let i = 0; i < JDIDs.length; i++) {
                if (JDIDs[i] == data) {
                    document.getElementById(`${JDIDs[i]}`).innerText =
                        "pressed";
                    break;
                }
            }

            document.getElementById(`result`).innerText = result;
        }
    }

    const arduinoPage = document.getElementById("arduino-page-nav");
    let showArduino = false;

    arduinoPage.addEventListener("click", () => {
        showJoystick = showJoystick && !showJoystick;
        showArduino = !showArduino;
    });

    function showArduinoData(data) {
        if (showArduino) {
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
    }

    const logsPage = document.getElementById("logs-page-nav");

    logsPage.addEventListener("click", () => {
        socket.send("logs");
        showJoystick = showJoystick && !showJoystick;
        showArduino = showArduino && !showArduino;
    });

    function showLogs(data) {
        const logsContainer = document.getElementById("logsContainer");
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
        setStatus(true, true);
    });

    window.addEventListener("Offline", () => {
        setStatus(false, false);
    });
});
