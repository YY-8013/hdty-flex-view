<template>
  <div v-html="processedText"></div>
</template>
 
<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    processedText() {
      // 替换换行符为 <br>，并过滤可能的 XSS 风险（可选）
      return (this.value || '').replace(/\n/g, '<br>');
    }
  }
};
</script>