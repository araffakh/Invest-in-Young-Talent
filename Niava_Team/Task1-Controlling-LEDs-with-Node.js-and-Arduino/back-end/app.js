const express = require("express");
const cors = require("cors");
const led = require("./routes/ledRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/led", led);

app.listen(5000, () => {
  console.log("listening on port 5000");
});
