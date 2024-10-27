const { SerialPort } = require("serialport");
const config = require("./config/config");

class SerialManager {
    constructor(portConfig) {
        if (portConfig.enabled) {
            this.port = new SerialPort({
                path: portConfig.serialport,
                baudRate: portConfig.serialbaud,
                dataBits: portConfig.databits,
                parity: portConfig.parity,
                stopBits: portConfig.stopbits,
                autoOpen: false,
            });

            this.isOpen = false; // Track if the port is open or not
        }
    }

    async openConnection() {
        if (!this.isOpen) {
            return new Promise((resolve, reject) => {
                this.port.open((err) => {
                    if (err) {
                        console.error(
                            `Failed to open serial port: ${this.port.path}. Error: ${err.message}`
                        );
                        return reject(err);
                    }
                    console.log("Serial port opened:", this.port.path);
                    this.isOpen = true;
                    resolve();
                });
            });
        }
    }

    async closeConnection() {
        if (this.isOpen) {
            return new Promise((resolve, reject) => {
                this.port.close((err) => {
                    if (err) {
                        console.error(
                            `Failed to close serial port: ${this.port.path}. Error: ${err.message}`
                        );
                        return reject(err);
                    }
                    console.log("Serial port closed:", this.port.path);
                    this.isOpen = false;
                    resolve();
                });
            });
        }
    }

    async send(data) {
        try {
            // console.log('Data to send:', data);
            await this.openConnection(); // Ensure the connection is open before sending
            await new Promise((resolve, reject) => {
                this.port.write(data, (err) => {
                    if (err) {
                        console.error("Error writing data:", err);
                        return reject(err);
                    }
                    // console.log('Data written, draining...');
                    this.port.drain((err) => {
                        if (err) {
                            console.error("Error draining data:", err);
                            return reject(err);
                        }
                        // console.log('Data sent successfully on port:', this.port.path);
                        resolve();
                    });
                });
            });
            return true; // Indicate success
        } catch (error) {
            console.error(
                "Failed to send data on port:",
                this.port.path,
                error
            );
            return false; // Indicate failure
        }
    }

    async receive() {
        try {
            await this.openConnection(); // Ensure the connection is open before receiving
            const data = await new Promise((resolve, reject) => {
                this.port.once("data", (data) => {
                    console.log("Received data:", data.toString());
                    resolve(data.toString());
                });

                this.port.on("error", (err) => {
                    console.error("Error receiving data:", err);
                    reject(err);
                });
            });
            console.log("Data received on port:", this.port.path, data);
            return data;
        } catch (error) {
            console.error(
                "Failed to receive data on port:",
                this.port.path,
                error
            );
            return null; // Indicate no data received
        }
    }

    static initializePort() {
        const portConfig = config[config["Niava-Serial-Ports"].sendingPort];
        return new SerialManager(portConfig);
    }
}

module.exports = SerialManager;
