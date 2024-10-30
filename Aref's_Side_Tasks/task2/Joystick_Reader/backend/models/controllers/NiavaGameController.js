/**
 * @license MIT
 *
 * This file includes code from [node-gamecontroller], which is dual licensed under the MIT or GPL Version 2 licenses.
 * Original work © [ Robert Eiseley], [2017].
 *
 * You may use this file under the terms of the MIT license.
 */
const HID = require("node-hid");
const EventEmitter = require("events").EventEmitter;
const Vendors = require("../config/vendors");
const util = require("util");
const config = require("../config/config");

const Vendor = config["Controller"]["vendor"];

let controlSignal = {
    "axis:JOYR:X": 0,
    "axis:JOYR:Y": 0,
    "axis:JOYL:X": 0,
    "axis:JOYL:Y": 0,
};

GameController.prototype = {
    _hid: null,
    _vendor: null,
    _tomain: null,
    _connected: false,

    connect: function (cb) {
        let ven = this._vendor;
        try {
            this._hid = new HID.HID(ven.vendorId, ven.productId);
            this._tomain = Vendor;
        } catch (e) {
            this.emit("error", e);
            return;
        }
        let hid = this._hid;
        let self = this;
        let pass = { x: 0, y: 0 };

        // Listening for data
        hid.on("data", (data) => {
            let newState = ven.update(data);
            let oldState = ven.prev;
            self.emit("data", newState);
            self.emit("data:raw", getBufferData(data));

            if (this._connected == false) {
                this._connected = true;
                self.emit("joystickConnected");
            }

            for (let s in newState) {
                let os = oldState[s];
                let ns = newState[s];
                let sp = s.split(":");
                if (sp[0] === "axis") {
                    let Ykey = sp[0] + ":" + sp[1] + ":Y";
                    if (
                        sp[2] === "X" &&
                        (ns !== os || newState[Ykey] !== oldState[Ykey])
                    ) {
                        pass.x =
                            sp[1] == "JOYR"
                                ? ns == 47 || ns == 143
                                    ? ns
                                    : 15
                                : ns;
                        pass.y =
                            sp[1] == "JOYR"
                                ? newState[Ykey] == 31 || newState[Ykey] == 79
                                    ? newState[Ykey]
                                    : 15
                                : newState[Ykey];

                        controlSignal[s] = pass.x;
                        controlSignal[Ykey] = pass.y;

                        if (
                            !(controlSignal[s] == 0 && controlSignal[Ykey] == 0)
                        ) {
                            self.emit("control", controlSignal);
                        }
                        controlSignal[s] = 0;
                        controlSignal[Ykey] = 0;
                    }
                } else if (os !== ns) {
                    if (sp[0] === "button") {
                        self.emit(sp[1]);
                        self.emit("control", sp[1]);
                    }
                }
                oldState[s] = newState[s];
            }
        });

        // Handle disconnection or errors
        hid.on("error", (err) => {
            console.log("Error or disconnection detected:", err.message);
            this._connected = false;
            self.emit("disconnect");
            self.close();
            self._attemptReconnection(); // Trigger reconnection
        });

        if (cb instanceof Function) {
            cb();
        }

        return this;
    },

    close: function () {
        if (this._hid) {
            this._hid.close();
            this._hid = null;
        }

        this.emit("close");
        return this;
    },

    _attemptReconnection: function () {
        let self = this;

        console.log("Attempting to reconnect...");

        const interval = setInterval(() => {
            const availableControllers = GameController.getDevices();
            const controller = availableControllers.find(
                (controller) => controller === Vendor
            );

            if (controller) {
                console.log("Controller reconnected");
                self.connect(() => {
                    console.log(Vendor + " Controller reconnected");
                });
                clearInterval(interval); // Stop attempting to reconnect
            } else {
                console.log("Reconnection attempt failed. Retrying...");
            }
        }, this._reconnectInterval);
    },
};

GameController.getDevices = function () {
    let dev = HID.devices();
    let ret = [];

    for (let i = 0; i < dev.length; i++) {
        for (let ven in Vendors) {
            if (
                Vendors[ven].productId === dev[i].productId &&
                Vendors[ven].vendorId === dev[i].vendorId &&
                dev[i].usagePage === 1
            ) {
                ret.push(ven);
            }
        }
    }
    return ret;
};

GameController.init = async function () {
    console.log("Hello to Niava game controller");

    function attemptConnection() {
        const availableControllers = GameController.getDevices();
        const controller = availableControllers.find(
            (controller) => controller === Vendor
        );
        console.log("Available Controllers:", availableControllers);

        if (availableControllers.length > 0 && controller) {
            const controllerInstance = new GameController(Vendor);
            controllerInstance.connect(() => {
                console.log(Vendor + " Controller connected");
            });
            // Monitor for disconnection
            controllerInstance.on("disconnect", function () {
                console.log(
                    "Controller disconnected. Attempting to reconnect..."
                );
                reconnect();
            });
            // Monitor for reconnection
            controllerInstance.on("reconnect", function () {
                console.log("Controller reconnected");
            });
            return controllerInstance;
        } else {
            console.log(
                Vendor + " Controller not found or not connected. Retrying..."
            );
            return null;
        }
    }

    async function reconnect() {
        let controller;
        while (!controller) {
            controller = attemptConnection();
            if (!controller) {
                console.log(
                    "Reconnection attempt failed. Retrying in 5 seconds..."
                );
                await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
                // return null;
            }
        }
        return controller;
    }

    const controller = await reconnect();
    return controller || false;
};

/**
 * Normalizes the raw value of a joystick.
 *
 * @param {number} rawValue - The raw value of the joystick.
 * @returns {number} - The normalized value of the joystick.
 */

function getBufferData(data) {
    return data;
}

function GameController(type) {
    if (!(this instanceof GameController)) {
        return new GameController(type);
    }

    this._vendor = Vendors[type];
    this._reconnectInterval = 5000; // 5 seconds between reconnect attempts
    EventEmitter.call(this);
    process.on("exit", this.close.bind(this));
}

util.inherits(GameController, EventEmitter);

module.exports = GameController;
