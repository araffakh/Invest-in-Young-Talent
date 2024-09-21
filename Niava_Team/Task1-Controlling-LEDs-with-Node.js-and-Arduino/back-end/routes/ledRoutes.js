const express = require("express");
const turnLed = require("../controlers/ledControlers");

const router = express.Router();

router.route(`/`).post(turnLed);

module.exports = router;
