<template>
  <div class="AllLedsStatus">
    <ledStatus
      v-for="(state, index) in statusData"
      :key="index"
      :data="state"
    />
  </div>
</template>

<script>
import ledStatus from "@/components/led/ledStatus.vue";
import axios from "axios";

export default {
  name: "AllLedsStatus",
  components: {
    ledStatus,
  },
  methods: {
    getData: function () {
      axios
        .get("http://localhost:5000/api/led")
        .then((data) => {
          this.statusData = data.data.data;
        })
        .catch((error) => console.log(error));
    },
  },
  mounted() {
    this.getData();
    this.interval = setInterval(() => {
      this.getData();
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  data: () => {
    return {
      statusData: "",
      interval: null,
    };
  },
};
</script>

<style scoped>
.AllLedsStatus {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 50px;
}
</style>
