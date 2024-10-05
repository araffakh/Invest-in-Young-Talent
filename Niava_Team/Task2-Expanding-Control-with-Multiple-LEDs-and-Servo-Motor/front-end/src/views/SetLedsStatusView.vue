<template>
  <div class="LedStatus">
    <LedTurnButton
      v-for="(state, index) in statusData"
      :key="index"
      :data="state"
    />
  </div>
</template>

<script>
import LedTurnButton from "@/components/led/LedTurnButton.vue";
import { getAllData } from "../data/getAllStatus";

export default {
  name: "LedStatusView",
  components: {
    LedTurnButton,
  },
  methods: {
    getData: async function () {
      this.statusData = await getAllData();
    },
  },
  mounted() {
    this.getData();
  },
  data: () => {
    return {
      statusData: "",
    };
  },
};
</script>

<style scoped>
.LedStatus {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 50px;
}
</style>
