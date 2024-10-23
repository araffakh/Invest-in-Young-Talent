class MainMenu {
    constructor() {
        const { Menu } = require("electron");
        let template = [
            {
                label: "File",
                subMenu: [
                    {
                        label: "Close",
                        role: "quit",
                    },
                ],
            },
            {
                label: "Help",
                click: () => {
                    const { shell } = require("electron");
                    shell.openExternal("https://electronjs.org");
                },
            },
            {
                label: "About",
                click: () => {
                    const { dialog } = require("electron");
                    dialog.showMessageBox({
                        type: "info",
                        buttons: ["ok"],
                        title: "About",
                        message: "hello from About window",
                    });
                },
            },
        ];
        let menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }
}

module.exports = { MainMenu };
