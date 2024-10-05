const express = require("express");
const { turnLed, ledStatus } = require("../controlers/ledControlers");

const router = express.Router();

router.route(`/`).post(turnLed).get(ledStatus);

module.exports = router;
