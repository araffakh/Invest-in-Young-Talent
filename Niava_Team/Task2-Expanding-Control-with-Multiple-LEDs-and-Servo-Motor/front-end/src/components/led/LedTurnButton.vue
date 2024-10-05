<template>
  <div class="LedTurnButton">
    <h3>led {{ data.name }}</h3>
    <label class="switch">
      <input
        type="checkbox"
        :checked="data.status"
        @click="(e) => handleSendLedStatus(e)"
      />
      <span class="slider" />
    </label>
    <div class="img">
      <img src="../../assets/led.png" class="led-img" />
      <span class="led-light" v-show="light" />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LedTurnButton",
  data: function () {
    return {
      light: "",
    };
  },
  mounted() {
    this.light = this.data.status;
  },
  methods: {
    handleSendLedStatus: function (e) {
      const status = e.target.checked ? 1 : 0;
      if (status === 1) {
        this.light = true;
      } else {
        this.light = false;
      }
      axios
        .post("http://localhost:5000/api/led", {
          led: `${this.data.name}${status}`,
        })
    },
  },
  props: ["data"],
};
</script>

<style scoped>
.LedTurnButton {
  flex-basis: 200px;
  text-align: center;
  background-color: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 0 10px 2px rgb(207, 207, 207);
}

.switch {
  position: relative;
  display: inline-block;
  width: 110px;
  height: 60px;
  margin: 0 10px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
  box-shadow: 0 0 10px 4px black inset;
}

.slider::before {
  content: "";
  position: absolute;
  width: 45px;
  height: 45px;
  left: 8px;
  bottom: 8px;
  transition: 0.4s;
  border-radius: 50px;
  box-shadow: 0 0 7px 7px black inset;
  background-color: rgb(255, 41, 41);
}

input:checked + .slider::before {
  transform: translateX(45px);
  background-color: rgb(123, 255, 47);
}

.img {
  position: relative;
}

.led-img {
  margin-top: 20px;
  width: 80%;
}

.led-light {
  position: absolute;
  top: 40px;
  right: 42px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  box-shadow: 0 0 15px 20px rgba(255, 255, 0, 0.491);
}
</style>
