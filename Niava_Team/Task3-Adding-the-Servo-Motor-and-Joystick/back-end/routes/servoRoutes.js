const express = require("express");
const { servoDance } = require("../controlers/servoControlers");

const router = express.Router();

router.route(`/`).post(servoDance);

module.exports = router;
