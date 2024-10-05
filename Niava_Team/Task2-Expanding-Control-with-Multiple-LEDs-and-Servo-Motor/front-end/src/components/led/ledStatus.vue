<template>
  <div class="ledStatus">
    <h3>led {{ data.name }}</h3>
    <div>
      <h5>status</h5>
      <p>
        <b-icon
          icon="lightbulb-fill"
          :style="{ color: data.status === 1 ? 'yellow' : 'black' }"
          font-scale="4px"
        ></b-icon>
      </p>
    </div>
    <br />
    <div v-show="data.name === 5">
      <h5>brightness %:</h5>
      <b-progress
        height="2rem"
        :value="data.bright"
        show-progress
        min="0"
        max="255"
        v-show="data.bright"
      ></b-progress>
    </div>
  </div>
</template>

<script>
export default {
  name: "ledStatus",
  props: ["data"],
};
</script>

<style scoped>
.ledStatus {
  flex-basis: 400px;
  min-height: 280px;
  text-align: center;
  background-color: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 0 10px 2px rgb(207, 207, 207);
}
</style>
