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
      "button:b1": 0,
      "button:b2": 0,
      "button:b3": 0,
      "button:b4": 0,
      "button:b5": 0,
      "button:b6": 0,
      "button:b7": 0,
      "button:b8": 0,
      "button:b9": 0,
      "button:b10": 0,
      "button:b11": 0,
      "button:b12": 0,
      "button:view": 0,
      "axis:roll": 0,
      "axis:pitch": 0,
      "axis:yaw": 0,
      "axis:throttle": 0
    },
    "prev": {
     "button:b1": 0,
      "button:b2": 0,
      "button:b3": 0,
      "button:b4": 0,
      "button:b5": 0,
      "button:b6": 0,
      "button:b7": 0,
      "button:b8": 0,
      "button:b9": 0,
      "button:b10": 0,
      "button:b11": 0,
      "button:b12": 0,
      "button:view": 0,
      "axis:roll": 0,
      "axis:pitch": 0,
      "axis:yaw": 0,
      "axis:throttle": 0
    },
    "update": function(data) {
      var state = this.state;
      state['button:b1'] = data[4] === 0x01 ? 1 : 0,
      state['button:b2'] = data[4] === 0x02 ? 1 : 0,
      state['button:b3'] = data[4] === 0x04 ? 1 : 0,
      state['button:b4'] = data[4] === 0x08 ? 1 : 0,
      state['button:b5'] = data[4] === 0x10 ? 1 : 0,
      state['button:b6'] = data[4] === 0x20 ? 1 : 0,
      state['button:b7'] = data[4] === 0x40 ? 1 : 0,
      state['button:b8'] = data[4] === 0x80 ? 1 : 0,
      state['button:b9'] = data[6] === 0x01 ? 1 : 0,
      state['button:b10'] = data[6] === 0x02 ? 1 : 0,
      state['button:b11'] = data[6] === 0x04 ? 1 : 0,
      state['button:b12'] = data[6] === 0x08 ? 1 : 0,
      state['button:view'] =(data[2] & 0xf0) >> 4,
      state['axis:roll'] = ((data[1] & 0x03) << 8) + data[0],
      state['axis:pitch'] = ((data[2] & 0x0f) << 6) +  + ((data[1] & 0xfc) >> 2),
      state['axis:yaw'] = data[3],
      state['axis:throttle'] = -data[5] + 255;      
      return state;
    },
    "setRumble": function() {
      // Implement rumble functionality here
    },
    "setLED": function(led, val) {
      // Implement LED functionality here
    }
  },
  "xbox360": {
    "vendorId": 1118,
    "productId": 654,
    "state": {
      "button:Y": 0,
      "button:A": 0,
      "button:X": 0,
      "button:B": 0,
      "button:L1": 0,
      "button:R1": 0,
      "button:L2": 0,
      "button:R2": 0,
      "axis:JOYL:X": 0,
      "axis:JOYL:Y": 0,
      "axis:JOYR:X": 5,
      "axis:JOYR:Y": 0,
      "button:Up": 0,
      "button:Right": 0,
      "button:Down": 0,
      "button:Left": 0,
      "button:Start": 0,
      "button:Select": 0
    },
    "prev": {
      "button:Y": 0,
      "button:A": 0,
      "button:X": 0,
      "button:B": 0,
      "button:L1": 0,
      "button:R1": 0,
      "button:L2": 0,
      "button:R2": 0,
      "axis:JOYL:X": 0,
      "axis:JOYL:Y": 0,
      "axis:JOYR:X": 0,
      "axis:JOYR:Y": 0,
      "button:Up": 0,
      "button:Right": 0,
      "button:Down": 0,
      "button:Left": 0,
      "button:Start": 0,
      "button:Select": 0
    },
    "update": function(data) {
      var state = this.state;

      state['button:Y'] = data[10] === 0x08 ? 1 : 0;
      state['button:A'] = data[10] === 0x01 ? 1 : 0;
      state['button:X'] = data[10] === 0x04 ? 1 : 0;
      state['button:B'] = data[10] === 0x02 ? 1 : 0;
      
      state['button:L1'] = data[10] === 0x10 ? 1 : 0;
      state['button:L2'] = data[8] === 0x80 ? 1 : 0;
      state['button:R1'] = data[10] === 0x20 ? 1 : 0;
      state['button:R2'] = data[9] === 0x80 ? 0 : 1;
     
      state['axis:JOYL:X'] = data[0] + (data[1] << 8 );
      state['axis:JOYL:Y'] = data[2] + (data[3] << 8);
      state['axis:JOYR:X'] = data[4] + (data[5] << 8);
      state['axis:JOYR:Y'] = data[6] + (data[7] << 8);

   
      state['button:Up'] = data[11] === 0x04 ? 1 : 0;
      state['button:Right'] = data[11] === 0x0c ? 1 : 0;
      state['button:Down'] = data[11] === 0x14 ? 1 : 0;
      state['button:Left'] = data[11] === 0x1c ? 1 : 0;

      state['button:Start'] = data[10] === 0x80 ? 1 : 0;
      state['button:Select'] = data[10] === 0x40 ? 1 : 0;
      
      return state;
    },
    "setRumble": function() {
      // Implement rumble functionality here
    },
    "setLED": function(led, val) {
      // Implement LED functionality here
    }
  },
  "G920": {
    "vendorId": 1133,
    "productId": 49762,
    "state": {
      "button:Y": 0,
      "button:A": 0,
      "button:X": 0,
      "button:B": 0,
      "button:LSB": 0,
      "button:RSB": 0,
      "button:GearUp": 0,
      "button:GearDown": 0,
      "button:Xbox": 0,
      "button:View": 0,
      "button:Menu": 0,
      "button:DpadUp": 0,
      "button:DpadUPRight": 0,
      "button:DpadRight": 0,
      "button:DpadDownRight": 0,
      "button:DpadDown": 0,
      "button:DpadDownleft": 0,
      "button:Dpadleft": 0,
      "steering": 0,
      "pedal:clutch": 0,
      "pedal:gas": 0,
      "pedal:break": 0,
      "shifter:gear": 0,
    },
    "prev": {
      "button:Y": 0,
      "button:A": 0,
      "button:X": 0,
      "button:B": 0,
      "button:LSB": 0,
      "button:RSB": 0,
      "button:GearUp": 0,
      "button:GearDown": 0,
      "button:Xbox": 0,
      "button:View": 0,
      "button:Menu": 0,
      "button:DpadUp": 0,
      "button:DpadUPRight": 0,
      "button:DpadRight": 0,
      "button:DpadDownRight": 0,
      "button:DpadDown": 0,
      "button:DpadDownleft": 0,
      "button:Dpadleft": 0,
      "steering": 0,
      "pedal:clutch": 0,
      "pedal:gas": 0,
      "pedal:break": 0,
      "shifter:gear": 0,

    },
    "update": function(data) {
      var state = this.state;
      state['button:Y'] = data[1] === 0x88 ? 1 : 0;
      state['button:A'] = data[1] === 0x18 ? 1 : 0;
      state['button:X'] = data[1] === 0x48 ? 1 : 0;
      state['button:B'] = data[1] === 0x28 ? 1 : 0;
      state['button:DpadUp'] = data[1] === 0x00 ? 1 : 0;
      state['button:DpadUPRight'] = data[1] === 0x01 ? 1 : 0;
      state['button:DpadRight'] = data[1] === 0x02 ? 1 : 0;
      state['button:DpadDownRight'] = data[1] === 0x03 ? 1 : 0;
      state['button:DpadDown'] = data[1] === 0x04 ? 1 : 0;
      state['button:DpadDownleft'] = data[1] === 0x05 ? 1 : 0;
      state['button:Dpadleft'] = data[1] === 0x06 ? 1 : 0;
      state['button:DpadUpLeft'] = data[1] === 0x07 ? 1 : 0;
      // state['button:DpadUpLeft'] = data[1] === 0x07 ? 1 : 0;
      state['button:GearUp'] = data[2] === 0x01 ? 1 : 0;
      state['button:GearDOWN'] = data[2] === 0x02 ? 1 : 0;
      state['button:LSB'] = data[2] === 0x020 ? 1 : 0;
      state['button:RSB'] = data[2] === 0x010 ? 1 : 0;
      state['button:Xbox'] = data[2] === 0x040 ? 1 : 0;
      state['button:View'] = data[2] === 0x08 ? 1 : 0;
      state['button:Menu'] = data[2] === 0x04 ? 1 : 0;

      state['steering'] = data.readUInt16BE(5);

      // console.log(data ,state['steering']);
      state['pedal:gas'] = data.readUInt16BE(6);
      state['pedal:break'] = data.readUInt16BE(7);
      state['pedal:clutch'] = data.readUInt16BE(8);
          //  state['pedal:gas'] = data.readUInt16BE(6);

      // state['axis:JOYL:X'] = data[0] + (data[1] << 8 );
      // state['axis:JOYL:Y'] = data[2] + (data[3] << 8);
      // state['axis:JOYR:X'] = data[4] + (data[5] << 8);
      // state['axis:JOYR:Y'] = data[6] + (data[7] << 8);

   
      // state['button:Up'] = data[11] === 0x04 ? 1 : 0;
      // state['button:Right'] = data[11] === 0x0c ? 1 : 0;
      // state['button:Down'] = data[11] === 0x14 ? 1 : 0;
      // state['button:Left'] = data[11] === 0x1c ? 1 : 0;

      // state['button:Start'] = data[10] === 0x80 ? 1 : 0;
      // state['button:Select'] = data[10] === 0x40 ? 1 : 0;
      
      return state;
    },
    "setRumble": function() {
      // Implement rumble functionality here
    },
    "setLED": function(led, val) {
      // Implement LED functionality here
    }
  },

  // You can add more controllers here in the same format as "xbox360"
  // You can add more controllers here in the same format as "xbox360"


};
