<template>
    <div class="servoDance">
        <div class="error" v-show="showErrLetter">
            <h1>there is no connection, please try again later</h1>
            <button @click="showErrLetterFunc">ok</button>
        </div>
        <div class="spinSet">
            <label for="sb-input">Spin to catch the value</label>
            <b-form-spinbutton
                id="sb-input"
                v-model="value"
                wrap
            ></b-form-spinbutton>
        </div>
        <div class="manuallySet">
            <label>set it manually</label>
            <input type="number" min="0" max="180" v-model="value" />
        </div>

        <button @click="setAngle(value)" class="button">set angle</button>

        <p class="anglesShow">dance angles: {{ danceAngles }}</p>

        <button @click="cleanAngles()" class="button">clean angles</button>
        <button @click="handleSendDance()" class="button">lets dance</button>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "servoDance",
    data() {
        return {
            value: 0,
            danceAngles: [],
            showErrLetter: false,
        };
    },
    methods: {
        setAngle: function () {
            if (this.value < 0 || this.value > 180) {
                alert("angle must be between 0 and 180");
                return;
            } else {
                this.danceAngles.push(this.value);
            }
        },
        handleSendDance: function () {
            if (this.err == false) {
                axios.post("http://localhost:5000/api/servo", {
                    servo: "1",
                    danceAngles: `${this.danceAngles}`,
                });
            } else {
                this.showErrLetter = true;
            }
        },
        showErrLetterFunc: function () {
            this.showErrLetter = false;
        },
        cleanAngles: function () {
            this.danceAngles = [];
        },
    },
    props: ["err"],
};
</script>

<style scoped>
.servoDance {
    flex-basis: 800px;
    text-align: center;
    background-color: white;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 0 10px 2px rgb(207, 207, 207);
}

.spinSet {
    margin-bottom: 20px;
}

.manuallySet {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 30%;
    margin: 0 auto;
    margin-bottom: 20px;
}

.manuallySet input {
    height: 40px;
    text-align: center;
    font-size: 16px;
}

.anglesShow {
    margin-top: 10px;
}

.button {
    border-radius: 10px;
    width: 20%;
    padding: 5px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    background-color: blue;
    color: white;
}

.button:hover {
    background-color: rgb(0, 94, 255);
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
