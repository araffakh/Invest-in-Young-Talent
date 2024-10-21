const asyncwrapper = require("../middleWares/asyncwrapper");
const httpStatus = require("../utils/httpStatus");
const { port, sendDataToControler } = require("../models/ArduinoPort");

const turnLed = asyncwrapper(async (req, res) => {
    const ledStatus = req.body;

    if (!ledStatus) {
        res.status(400).json(httpStatus.badResponse("100", "bad request"));
    }

    if (ledStatus.led) {
        const led = ledStatus.led;
        const status = ledStatus.status;
        await port.write(`L${led}${status}\n`, () => {
            res.status(200).json(
                httpStatus.goodResponse(`Message sent: L${led}${status}`)
            );
        });
    } else if (ledStatus.brightLed) {
        const brightLed = ledStatus.brightLed;
        const bright = ledStatus.bright;
        await port.write(`B${brightLed}${bright}\n`, () => {
            res.status(200).json(
                httpStatus.goodResponse(`Message sent: B${brightLed}${bright}`)
            );
        });
    } else {
        res.status(400).json(httpStatus.badResponse(400, "bad request"));
    }
});

const ledStatus = (req, res) => {
    let data = sendDataToControler();

    if (!data) {
        return res.json(
            httpStatus.badResponse(500, "couldn't get data from Arduino")
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
