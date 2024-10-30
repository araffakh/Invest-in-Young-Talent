function checkControllerData(data) {
    let translated = "";
    if (data["axis:JOYR:X"] == 143) {
        translated = "look left";
    } else if (data["axis:JOYR:X"] == 47) {
        translated = "look right";
    } else if (data["axis:JOYR:Y"] == 31) {
        translated = "top";
    } else if (data["axis:JOYR:Y"] == 79) {
        translated = "bottom";
    } else if (data["axis:JOYL:X"] == 0) {
        translated = "leftward";
    } else if (data["axis:JOYL:X"] == 255) {
        translated = "rightward";
    } else if (data["axis:JOYL:Y"] == 0) {
        translated = "forward";
    } else if (data["axis:JOYL:Y"] == 255) {
        translated = "backward";
    }
    return translated;
}

function calcResult(data, arduinoStatus) {
    let result = "";
    let send = false;

    if (data == "L1") {
        if (arduinoStatus[0].status == 0) {
            result = "L11";
        } else if (arduinoStatus[0].status == 1) {
            result = "L10";
        }
    } else if (data == "L2") {
        if (arduinoStatus[1].status == 0) {
            result = "L21";
        } else if (arduinoStatus[1].status == 1) {
            result = "L20";
        }
    } else if (data == "R1") {
        if (arduinoStatus[2].status == 0) {
            result = "L31";
        } else if (arduinoStatus[2].status == 1) {
            result = "L30";
        }
    } else if (data == "R2") {
        if (arduinoStatus[3].status == 0) {
            result = "L41";
        } else if (arduinoStatus[3].status == 1) {
            result = "L40";
        }
    } else if (data == "forward") {
        result = "B50";
    } else if (data == "leftward") {
        result = "B590";
    } else if (data == "backward") {
        result = "B5180";
    } else if (data == "rightward") {
        result = "B5255";
    } else if (data == "top") {
        result = "S1-0-";
    } else if (data == "look left") {
        result = "S1-60-";
    } else if (data == "bottom") {
        result = "S1-120-";
    } else if (data == "look right") {
        result = "S1-180-";
    } else if (data == "start") {
        result = "";
    } else if (data == "select") {
        send = true;
    }
    return { result: result, send: send };
}

module.exports = { checkControllerData, calcResult };
