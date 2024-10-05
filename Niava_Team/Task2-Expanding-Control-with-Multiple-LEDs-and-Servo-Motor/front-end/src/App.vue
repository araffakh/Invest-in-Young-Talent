<template>
  <div id="app">
    <ProjectHeader />
    <router-view />
  </div>
</template>

<script>
import ProjectHeader from "@/components/ProjectHeader.vue";

export default {
  name: "app",
  components: {
    ProjectHeader,
  },
};
</script>

<style>
#app {
  font-family: system-ui;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>
