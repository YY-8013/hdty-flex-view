<template>
  <div class="text-preview" :class="{ 'show-expand':isClamped}" ref="textContainer">
    <div :class="{ 'clamped': !isExpanded }" ref="textContent" v-html="processedText"></div>
    <button
      class="expand-button"
      v-if="isClamped"
      @click.prevent="toggleExpand"
    >{{ isExpanded ? '收起内容' : '展开内容' }}</button>
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    maxRow: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      isExpanded: true,
      isClamped: false
    };
  },
  computed: {
    processedText() {
      return this.text.replace(/\n/g, '<br>');
    }
  },
  mounted() {
    window.addEventListener('resize', this.checkClamping);
    this.checkClamping();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkClamping);
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
      this.checkClamping();
    },
    checkClamping() {
      this.$nextTick(() => {
        const textContent = this.$refs.textContent;
        const lineHeight = parseInt(
          window.getComputedStyle(textContent).lineHeight
        );
        const maxHeight = lineHeight * this.maxRow;
        this.isClamped = textContent.scrollHeight > maxHeight;
      });
    }
  }
};
</script>

<style scoped>
.text-preview {
  position: relative;
  line-height: 1.5em;
}

.clamped {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-height: 1.5em;
  transition: max-height 0.5s ease, opacity 0.5s ease;
}

.show-expand {
  padding-bottom: 32px;
}

.expand-button {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 18px;
  line-height: 1.2;
  border: none;
  border-radius: 20px;
  background-color: #f3c099; /* 暖色调的浅棕色 */
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.expand-button:hover {
  background-color: #f3c099; /* 鼠标悬浮时稍微亮一点的色调 */
}
</style>

