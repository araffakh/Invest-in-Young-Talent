/**
 * @license MIT
 * 
 * This file includes code from [node-gamecontroller], which is dual licensed under the MIT or GPL Version 2 licenses.
 * Original work © [ Robert Eiseley], [2017].
 *  * You may use this file under the terms of the MIT license.
 */
module.exports = {  
  "xtreme3dpro": {
    "vendorId": 121,
    "productId": 6,
    "state": {
      "button:L1": 0,
      "button:L2": 0,
      "button:R1": 0,
      "button:R2": 0,
      "button:select": 0,
      "button:start": 0,
      "button:JOYBL": 0,
      "button:JOYBR": 0,
      "axis:JOYL:X": 0,
      "axis:JOYL:Y": 0,
      "axis:JOYR:X": 0,
      "axis:JOYR:Y": 0,
      "axis:roll": 0,
      "axis:pitch": 0,
      "axis:yaw": 0,
      "axis:throttle": 0
    },
    "prev": {
      "button:L1": 0,
      "button:L2": 0,
      "button:R1": 0,
      "button:R2": 0,
      "button:select": 0,
      "button:start": 0,
      "button:JOYBL": 0,
      "button:JOYBR": 0,
      "axis:JOYL:X": 0,
      "axis:JOYL:Y": 0,
      "axis:JOYR:X": 0,
      "axis:JOYR:Y": 0,
      "axis:roll": 0,
      "axis:pitch": 0,
      "axis:yaw": 0,
      "axis:throttle": 0
    },
    "update": function(data) {
      var state = this.state;
      state['button:L1'] = data[6] === 1 ? 1 : 0,
      state['button:L2'] = data[6] === 4 ? 1 : 0,
      state['button:R1'] = data[6] === 2 ? 1 : 0,
      state['button:R2'] = data[6] === 8 ? 1 : 0,
      state['button:select'] = data[6] === 16 ? 1 : 0,
      state['button:start'] = data[6] === 32 ? 1 : 0,
      state['button:JOYBL'] = data[6] === 64 ? 1 : 0,
      state['button:JOYBR'] = data[6] === 128 ? 1 : 0,
      state['axis:JOYL:X'] = data[0];
      state['axis:JOYL:Y'] = data[1];
      state['axis:JOYR:X'] = data[5];
      state['axis:JOYR:Y'] = data[5];  
      state['axis:roll'] = ((data[1] & 0x03) << 8) + data[0],
      state['axis:pitch'] = ((data[2] & 0x0f) << 6) +  + ((data[1] & 0xfc) >> 2),
      state['axis:yaw'] = data[3],
      state['axis:throttle'] = -data[5] + 255; 
      return state;
    },
  },
};
