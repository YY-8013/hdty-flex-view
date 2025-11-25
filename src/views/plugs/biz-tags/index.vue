<template>
  <div class="biz-tags">
    <el-tag
      v-for="(item, index) in tagList"
      :key="index"
      :type="getTagType(index)"
      :size="size"
      :effect="effect"
      class="biz-tag-item"
    >
      {{ getTagContent(item) }}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: "BizTags",
  props: {
    // 标签数据数组
    value: {
      type: Array,
      default: () => []
    },
    // 标签大小 medium / small / mini
    size: {
      type: String,
      default: "small"
    },
    // 标签主题 dark / light / plain
    effect: {
      type: String,
      default: "light"
    },
    // 标签类型循环（可选值：primary/success/info/warning/danger）
    tagTypes: {
      type: Array,
      default: () => ["primary"]
    }
  },
  computed: {
    tagList() {
      return this.value || [];
    }
  },
  methods: {
    // 获取标签内容
    getTagContent(item) {
      if (typeof item === "object" && item.label) {
        return item.label;
      }
      return item;
    },
    // 循环标签类型
    getTagType(index) {
      const types = this.tagTypes || [
        "primary",
        "success",
        "info",
        "warning",
        "danger"
      ];
      return types[index % types.length];
    }
  }
};
</script>

<style scoped>
.biz-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}
.biz-tag-item {
  margin-right: 2px;
}
</style>
