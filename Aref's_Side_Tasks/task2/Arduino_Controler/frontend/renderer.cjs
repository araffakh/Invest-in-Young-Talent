//router

const ArduinoStatusPage = document.getElementById("arduino-status-page-nav");

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

ArduinoStatusPage.addEventListener("click", () => {
    loadPage("ArduinoStatusPage.html");
});
