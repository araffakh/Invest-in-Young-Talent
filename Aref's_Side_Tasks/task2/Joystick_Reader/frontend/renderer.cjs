//router

const joystickPage = document.getElementById("joystick-page-nav");
const arduinoPage = document.getElementById("arduino-page-nav");
const logsPage = document.getElementById("logs-page-nav");

async function loadPage(page) {
    await fetch(page)
        .then((response) => response.text())
        .then((html) => {
            document.getElementById("content").innerHTML = html;
        })
        .catch((error) => {
            console.error("Error loading page:", error);
        });
}

loadPage("home.html");

joystickPage.addEventListener("click", () => {
    loadPage("joystickData.html");
});

arduinoPage.addEventListener("click", () => {
    loadPage("ArduinoStatus.html");
});

logsPage.addEventListener("click", () => {
    loadPage("logs.html");
});
