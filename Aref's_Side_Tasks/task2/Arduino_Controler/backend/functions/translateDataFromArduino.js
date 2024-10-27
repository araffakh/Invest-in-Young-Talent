function translate(fromArduino) {
    let StatusfromArduino = fromArduino.split(",")[1].split("-").map(Number);
    let brightfromArduino = fromArduino.split(",")[0];

    let data = {
        bright: brightfromArduino,
        states: StatusfromArduino,
    };

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

    return ledsData;
}

module.exports = { translate };
