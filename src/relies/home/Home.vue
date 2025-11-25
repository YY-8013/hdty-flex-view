<template>
  <Main></Main>
  <!-- <WorkBench></WorkBench> -->
</template>

<script>
import Main from "@/views/Main";
import WorkBench from "@/views/workbench/index.vue";
export default {
  name: "Home",
  components: {
    Main,
    WorkBench
  }
};
</script>

<style scoped></style>
