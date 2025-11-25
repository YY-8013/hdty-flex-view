<template>
  <div
    :id="textId"
    class="auto-size-text-container"
    ref="textContainer"
    :title="description"
  >
    <div v-if="isHtml" v-html="formattedText"></div>
    <div v-else>{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: "AutoSizeText",
  props: {
    isHtml: {
      type: Boolean,
      default: false
    },
    // 文本内容
    text: {
      type: String,
      default: ""
    },
    // 初始字体大小（单位：mm）
    initialFontSize: {
      type: Number,
      default: 4
    },
    // 文本描述（用于title提示）
    description: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      textId: this.$utilStr.uuid(32),
      computedFontSize: this.initialFontSize
    };
  },
  computed: {
    formattedText() {
      return (this.text || "").replace(/\n/g, "<br>");
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.text) {
        this.adjustFontSize();
      }
    });
  },
  methods: {
    adjustFontSize() {
      let _this = this;
      const container = _this.$refs.textContainer;
      if (!container) return;

      let fontSize = _this.initialFontSize;

      while (
        container.scrollHeight > container.clientHeight ||
        container.scrollWidth > container.clientWidth
      ) {
        fontSize -= 0.2;

        container.style.fontSize = `${fontSize}mm`;

        // 防止字体缩小到无法阅读的情况
        if (fontSize < 1.2) break;
      }
    }
  }
};
</script>

<style scoped>
.auto-size-text-container {
  width: 100%;
  max-height: 100%;
  overflow: hidden;
  line-height: 1.2;
}
</style>
