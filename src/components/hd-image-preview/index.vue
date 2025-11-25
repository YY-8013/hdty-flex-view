<template>
  <div
    class="viewer-img-preview"
    :style="{width: pageWidth ? pageWidth : '100%',height: pageHeight ? pageHeight : '100%'}"
  >
    <viewer :images="[value]" style="width: 100%;height: 100%;">
      <img v-if="value" :src="value" alt :title="title" :style="{'object-fit':`${fit}!important`}" />
      <div v-else class="hdty-img-empty">
        <i v-if="emptyIcon" :class="emptyIcon"></i>
        <span v-if="emptyText">{{ emptyText }}</span>
      </div>
    </viewer>
  </div>
</template>

<script>
import { hdMethod } from '@/utils/util-framework';
export default {
  name: 'HdImagePreview',
  provide() {
    return {
      HdImagePreview: this
    };
  },
  mixins: [hdMethod],
  props: {
    prop: String,
    // 绑定值
    value: {
      type: String,
      default: '',
      required: true
    },
    // 对齐方式（fill / contain / cover / none / scale-down）
    fit: {
      type: String,
      default: 'contain'
    },
    // 宽度
    width: {
      type: [Number, String],
      default: ''
    },
    // 高度
    height: {
      type: [Number, String],
      default: ''
    },
    // 提示文本
    title: {
      type: String,
      default: '查看大图'
    },
    // 空数据时显示图标
    emptyIcon: {
      type: String,
      default: 'icon-no-image'
    },
    // 空数据时显示文本
    emptyText: {
      type: String,
      default: '暂无图片'
    }
  },
  data() {
    return {};
  },
  computed: {
    pageWidth() {
      if (
        String(this.width).indexOf('px') !== -1 ||
        String(this.width).indexOf('%') !== -1
      ) {
        return this.width;
      } else {
        return Number(this.width || 0) ? Number(this.width || 0) + 'px' : '';
      }
    },
    pageHeight() {
      if (
        String(this.height).indexOf('px') !== -1 ||
        String(this.height).indexOf('%') !== -1
      ) {
        return this.height;
      } else {
        return Number(this.height || 0) ? Number(this.height || 0) + 'px' : '';
      }
    }
  },
  watch: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.viewer-img-preview {
  width: 100%;
  height: 100%;
  overflow: hidden;
  img {
    cursor: pointer;
    width: 100%;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
    /*object-fit: contain;*/
  }
}
</style>
<style>
.viewer-container {
  z-index: 100000 !important;
}
</style>
