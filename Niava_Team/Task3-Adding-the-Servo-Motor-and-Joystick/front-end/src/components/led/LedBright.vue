<template>
    <div class="ledBrightBar" v-show="data.name === 5">
        <div class="error" v-show="showErrLetter">
            <h1>there is no connection, please try again later</h1>
            <button @click="showErrLetterFunc">ok</button>
        </div>
        <h3>led {{ data.name }}</h3>
        <div>
            <b-form-input
                class="range"
                v-model="value"
                type="range"
                min="0"
                max="255"
                @change="handleSendLedBright"
            ></b-form-input>
            <div class="mt-2">Value: {{ value }}</div>
        </div>
        <div class="img">
            <img src="../../assets/led.png" class="led-img" />
            <span class="led-light" :style="{ opacity: value / 100 }" />
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "LedBrightButton",
    data: () => {
        return {
            value: "",
            showErrLetter: false,
        };
    },
    methods: {
        handleSendLedBright: function () {
            if (this.err == false) {
                axios
                    .post("http://localhost:5000/api/led", {
                        brightLed: `${this.data.name}`,
                        bright: `${this.value}`,
                    })
                    .then((data) => console.log(data.data.data));
            } else {
                this.showErrLetter = true;
            }
        },
        showErrLetterFunc: function () {
            this.showErrLetter = false;
        },
    },
    mounted() {
        this.value = this.data.bright;
    },
    props: ["data", "err"],
};
</script>

<style scoped>
.ledBrightBar {
    flex-basis: 800px;
    text-align: center;
    background-color: white;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 0 10px 2px rgb(207, 207, 207);
}

.range {
    width: 80%;
}

.img {
    position: relative;
}

.led-img {
    margin-top: 20px;
    width: 20%;
}

.led-light {
    position: absolute;
    top: 40px;
    right: 330px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    box-shadow: 0 0 20px 25px rgba(255, 255, 0, 0.687);
}

.error {
    background-color: rgba(128, 128, 128, 0.749);
    padding: 10px;
}

.error h1 {
    color: red;
}

.error button {
    border-radius: 10px;
    padding: 10px;
    color: blue;
    cursor: pointer;
    width: 20%;
}
</style>
