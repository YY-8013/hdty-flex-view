<template>
  <div class="hdty-links">
    <div v-if="$slots.title" class="hdty-links-prepend">
      <slot name="title"></slot>
    </div>
    <div class="hdty-links-inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index"
  }
</script>

<style scoped>

</style>
