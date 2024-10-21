const express = require("express");
const cors = require("cors");
require("./models/joyStick");
const httpStatus = require("./utils/httpStatus");
const ledRoutes = require("./routes/ledRoutes");
const servoRoutes = require("./routes/servoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/led", ledRoutes);
app.use("/api/servo", servoRoutes);

// global middle ware for not found routes
app.all("*", (req, res, next) => {
    return res.status(404).json(httpStatus.badResponse(404, "page not found"));
});

// global error handler
app.use((error, req, res, next) => {
    res.status(500).json(
        httpStatus.badResponse(500, `internal server error! ${error}`)
    );
});

app.listen(5000, () => {
    console.log("listening on port 5000");
});
