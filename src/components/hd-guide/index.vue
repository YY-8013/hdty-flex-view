<template>
  <div class="hdty-guide" :class="enableHover && 'has-hover'">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "index",
    componentName: 'HdGuide',
    provide() {
      return {
        hdGuide: this
      };
    },
    props: {
      active: Number,
      enableHover: Boolean
    },
    data() {
      return {
        nodes: [],
      }
    },
    watch: {
      active: {
        handler(newVal, oldVal) {
          this.$emit('change', newVal, oldVal);
        },
        immediate: false
      },
      nodes: {
        handler(val) {
          val.forEach((child, index) => {
            child.index = index;
          });
        },
        immediate: false
      }
    },
    methods: {
      emitChildClick(i) {
        this.$emit('click', i, this.nodes[i]);
      }
    }
  }
</script>

<style scoped>

</style>
