/**
 * @license MIT
 * 
 * This file includes code from [node-gamecontroller], which is dual licensed under the MIT or GPL Version 2 licenses.
 * Original work © [ Robert Eiseley], [2017].
 * 
 * You may use this file under the terms of the MIT license.
 */
const HID = require('node-hid');
const EventEmitter = require('events').EventEmitter;
const Vendors = require('../config/vendors');
const util = require('util');
const config = require('../config/config');

const Vendor = config['Controller']['vendor'];
const buttonMap = config[config['Controller']['buttonMapping']];


let controlSignal = {
    'axis:JOYR:X': 0,
    'axis:JOYR:Y': 0,
    'axis:JOYL:X': 0,
    'axis:JOYL:Y': 0,
    'buttonCMD': 0,
};
let controlG920 = {
    'steering': 0,
    'pedal:clutch': 0,
    'pedal:gas': 0,
    'pedal:break': 0,
    'buttonCMD': 0,
};


GameController.prototype = {
    _hid: null,
    _vendor: null,
    

    connect: function (cb) {
   
        let ven = this._vendor;
        try {
            this._hid = new HID.HID(ven.vendorId, ven.productId);
        } catch (e) {
            this.emit('error', e);
            return;
        }
        let hid = this._hid;
        let self = this;
        let pass = { x: 0, y: 0 };
        
        // Listening for data
        hid.on('data', (data) => {
            let newState = ven.update(data);
            let oldState = ven.prev;
            self.emit('data', newState);
            self.emit('data:raw', getBufferData(data));

            for (let s in newState) {
                let os = oldState[s];
                let ns = newState[s];
                let sp = s.split(":");
                if (sp[0] === 'axis') {
                    let Ykey = sp[0] + ':' + sp[1] + ':Y';
                    if (sp[2] === 'X' && (ns !== os || newState[Ykey] !== oldState[Ykey])) {
                        pass.x = normalizeJoystickValue(ns);
                        pass.y = normalizeJoystickValue(newState[Ykey]);
                        self.emit(sp[1] + ':move', pass);
                        controlSignal[s] = pass.x;
                        controlSignal[Ykey] = pass.y;
                        self.emit('control', controlSignal);
                        controlSignal[s] = 0;
                        controlSignal[Ykey] = 0;
                    }
                } else if (sp[0] === 'steering') {
                    if (ns !== os) {
                        self.emit(sp[0] + ':move', ns);
                        controlG920[s] = ns;
                        self.emit('controlG920', controlG920);
                    }
                } else if (sp[0] === 'pedal') {
                    if (ns !== os) {
                        self.emit(sp[0] + ':gas', ns);
                        controlG920[s] = ns;
                        self.emit('controlG920', controlG920);
                        controlSignal[s] = 0;
                    }
                } else if (os !== ns) {
                    if (sp[0] === 'button') {
                        if (ns === 1 && os === 0) {
                            console.log(sp[0] + ':' + sp[1] + ':press', buttonMap[sp[1]]);
                            self.emit(sp[0] + ':' + sp[1] + ':press', buttonMap[sp[1]], buttonMap['DpadLeft']);
                            controlSignal['buttonCMD'] = buttonMap[sp[1]];
                            self.emit('control', controlSignal);
                            controlG920['buttonCMD'] = buttonMap[sp[1]];
                            self.emit('controlG920', controlG920);
                        } else if (ns === 0 && os === 1) {
                            self.emit(sp[0] + ':' + sp[1] + ':release', 0);
                            controlSignal['buttonCMD'] = 0;
                            controlG920['buttonCMD'] = 0;
                            self.emit('control', controlSignal);
                            self.emit('controlG920', controlG920);
                        }
                    }
                }
                oldState[s] = newState[s];
            }
        });

        // Handle disconnection or errors
        hid.on('error', (err) => {
            console.log('Error or disconnection detected:', err.message);
            self.emit('disconnect');
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

        this.emit('close');
        return this;
    },

    _attemptReconnection: function () {
        let self = this;

        console.log('Attempting to reconnect...');

        const interval = setInterval(() => {
            const availableControllers = GameController.getDevices();
            const controller = availableControllers.find((controller) => controller === Vendor);

            if (controller) {
                console.log('Controller reconnected');
                self.connect(() => {
                    console.log(Vendor + ' Controller reconnected');
                });
                clearInterval(interval); // Stop attempting to reconnect
            } else {
                console.log('Reconnection attempt failed. Retrying...');
            }
        }, this._reconnectInterval);
    }
};

GameController.getDevices = function () {
    let dev = HID.devices();
    let ret = [];

    for (let i = 0; i < dev.length; i++) {
        for (let ven in Vendors) {
            if (Vendors[ven].productId === dev[i].productId && Vendors[ven].vendorId === dev[i].vendorId && dev[i].usagePage === 1) {
                ret.push(ven);
            }
        }
    }
    return ret;
};

// GameController.init = function () {
//     console.log('Hello to Niava game controller');
//     const availableControllers = GameController.getDevices();
//     const controller = availableControllers.find((controller) => controller === Vendor);
//     console.log('Available Controllers:', availableControllers);

//     if (availableControllers.length > 0 && controller) {
//         const controller = new GameController(Vendor);
//         controller.connect(() => {
//             console.log(Vendor + ' Controller connected');
//         });
//         return controller;
//     } else {
//         console.log(Vendor + ' Controller not found or not connected');
//         return null;
//     }
// };

GameController.init = async function () {
    console.log('Hello to Niava game controller');

    function attemptConnection() {
        const availableControllers = GameController.getDevices();
        const controller = availableControllers.find((controller) => controller === Vendor);
        console.log('Available Controllers:', availableControllers);

        if (availableControllers.length > 0 && controller) {
            const controllerInstance = new GameController(Vendor);
            controllerInstance.connect(() => {
                console.log(Vendor + ' Controller connected');
            });
            // Monitor for disconnection
            controllerInstance.on('disconnect', function () {
                console.log('Controller disconnected. Attempting to reconnect...');
                reconnect();
            });
            // Monitor for reconnection
            controllerInstance.on('reconnect', function () {
                console.log('Controller reconnected');
            });
            return controllerInstance;
        } else {
            console.log(Vendor + ' Controller not found or not connected. Retrying...');
            return null;
        }
    }

    async function reconnect() {
        let controller;
        while (!controller) {
            controller = attemptConnection();
            if (!controller) {
                console.log('Reconnection attempt failed. Retrying in 5 seconds...');
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
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
function normalizeJoystickValue(rawValue) {
    const default_value = 32766;
    const limit = 0.98;
    let accuredValue = (rawValue - default_value) / default_value;
    if (accuredValue > limit) {
        return 1;
    } else if (accuredValue < -limit) {
        return -1;
    }
    return Math.round(accuredValue * 100) / 100;
}
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
    process.on('exit', this.close.bind(this));
}

util.inherits(GameController, EventEmitter);

module.exports = GameController;
