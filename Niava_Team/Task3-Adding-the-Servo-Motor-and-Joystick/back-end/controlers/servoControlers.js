const asyncwrapper = require("../middleWares/asyncwrapper");
const httpStatus = require("../utils/httpStatus");
const { port } = require("../models/ArduinoPort");

const servoDance = asyncwrapper(async (req, res) => {
    let { servo, danceAngles } = req.body;

    if (!servo || !danceAngles) {
        res.status(400).json(httpStatus.badResponse(400, "bad request"));
    }

    danceAngles = danceAngles.split(",").join("-");

    port.write(`S${servo}-${danceAngles}-\n`, () => {
        res.status(200).json(
            httpStatus.goodResponse(`Message sent: S${servo}${danceAngles}-`)
        );
    });
});

module.exports = { servoDance };
