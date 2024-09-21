const { SerialPort } = require("serialport");

const port = new SerialPort({
  path: "COM4",
  baudRate: 9600,
});

const turn = function (data) {
  try {
    port.write(data ? "1" : "0", (err) => {
      if (err) {
        return console.log("error writing! " + err.message);
      }
      console.log("Message sent: ", data ? "1" : "0");
    });
  } catch (err) {
    console.error("Error in setting up the serial port: ", err);
  }
};

module.exports = turn;
