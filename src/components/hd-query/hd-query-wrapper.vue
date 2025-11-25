<template>
  <div class="hdty-query-wrapper">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "HdQueryWrapper",
    componentName: 'HdQueryWrapper',
    props: {
      // 模式（expand / drawer）
      mode: {
        type: String,
        default: 'expand'
      },
      // 展开/收起按钮尺寸（medium / small / mini）
      expandButtonSize: {
        type: String,
        default: ''
      }
    },
    methods: {
      handleReset(evt) {
        this.$emit('currentReset', evt);
      },
      handleEnter(evt) {
        this.$emit('currentEnter', evt);
      }
    }
  }
</script>

<style scoped>

</style>
