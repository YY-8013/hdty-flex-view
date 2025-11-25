<template>
  <div class="con-area">
    <div class="area-head">
      <div class="head">
        <i :class="headerIcon"></i>
        {{ title }}
      </div>
      <!-- 动态判断是否有 header 插槽内容 -->
      <slot name="header"></slot>
    </div>
    <div class="area-body">
      <el-card class="con-card box-card no-padding-bottom">
        <div v-if="$slots['card-header']" slot="header" class="clearfix">
          <span class="base">
            <slot name="card-header"></slot>
          </span>
        </div>
        <div class="body">
          <slot></slot>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "BizFormCard",
  props: {
    title: {
      type: String,
      default: "基本信息"
    },
    headerIcon: {
      type: String,
      default: "el-icon-tickets"
    }
  }
};
</script>

<style lang="scss" scoped>
/* 可按需自定义样式 */
</style>
