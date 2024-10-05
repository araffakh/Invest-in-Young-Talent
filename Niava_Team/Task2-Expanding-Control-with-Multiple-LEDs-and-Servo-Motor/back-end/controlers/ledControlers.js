const asyncwrapper = require("../middleWares/asyncwrapper");
const httpStatus = require("../utils/httpStatus");
const { port, sendDataToControler } = require("../models/ArduinoPort");

const turnLed = asyncwrapper(async (req, res) => {
  const ledStatus = req.body;

  if (ledStatus.led) {
    await port.write(`${ledStatus.led}\n`, () => {
      res
        .status(200)
        .json(httpStatus.goodResponse(`Message sent: ${ledStatus.led}`));
    });
  } else if (ledStatus.bright) {
    await port.write(`${ledStatus.bright}\n`, () => {
      res
        .status(200)
        .json(httpStatus.goodResponse(`Message sent: ${ledStatus.bright}`));
    });
  } else {
    res.status(100).json(httpStatus.badResponse("100", "bad request"));
  }
});

const ledStatus = (req, res) => {
  let data = sendDataToControler();

  if (!data) {
    return res.json(
      httpStatus.badResponse("500", "couldn't get data from Arduino")
    );
  }

  let ledsData = data.states.map((item, index) => {
    return {
      name: index + 1,
      status: item,
    };
  });
  ledsData.push({
    name: 5,
    status: data.bright > 0 ? 1 : 0,
    bright: data.bright,
  });

  res.json(httpStatus.goodResponse(ledsData));
};

module.exports = { turnLed, ledStatus };
