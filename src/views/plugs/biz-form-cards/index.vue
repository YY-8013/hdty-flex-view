<template>
  <div class="con-area">
    <div class="area-head">
      <div class="head">
        <i class="el-icon-tickets"></i>
        {{ title }}
      </div>
    </div>
    <div class="area-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BizFormCard',
  props: {
    title: {
      type: String,
      default: '基本信息'
    }
  }
};
</script>

<style lang="scss" scoped>
/* 可按需自定义样式 */
</style>