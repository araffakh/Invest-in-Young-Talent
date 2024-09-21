const turn = require("../models/ArduinoPort");

const turnLed = (req, res) => {
  const ledStatus = req.body.led;
  turn(ledStatus);
  res.end();
};

module.exports = turnLed;
