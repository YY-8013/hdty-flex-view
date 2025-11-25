<template>
  <div class="hdty-image" :style="activeWrapperStyle">
    <el-image
      ref="imageRef"
      :src="currentImage"
      :large="large"
      :fit="fit"
      :title="tooltipText"
      :preview="preview"
      :preview-text="previewText"
      @load="load"
      @error="error"
    >
      <div slot="error" class="hdty-img-empty">
        <i v-if="emptyIcon" :class="emptyIcon"></i>
        <span v-if="emptyText">{{ emptyText }}</span>
      </div>
    </el-image>
    <slot></slot>
  </div>
</template>

<script>
import { hdComponent, hdMethod } from '@/utils/util-framework';
export default {
  name: 'index',
  provide() {
    return {
      hdImage: this
    };
  },
  mixins: [hdComponent, hdMethod],
  props: {
    prop: String,
    // 绑定值
    value: {
      type: String,
      default: ''
    },
    // 预览图地址
    src: {
      type: String,
      default: ''
    },
    // 大图地址
    large: {
      type: String,
      default: ''
    },
    // 对齐方式（fill / contain / cover / none / scale-down）
    fit: {
      type: String,
      default: 'contain'
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
    },
    // 鼠标移入元素显示提示文本
    tooltipText: {
      type: String,
      default: '查看大图'
    },
    // 预览分组
    preview: {
      type: String,
      default() {
        return this.$utilStr.uuid();
      }
    },
    // 预览描述
    previewText: {
      type: String,
      default: ''
    },
    // 宽度
    width: {
      type: [Number, String],
      default: null
    },
    // 高度
    height: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      currentImage: '', // 当前图片
      parentFormItemEl: null, // 元素的父级表单项元素
      parentColEl: null, // 元素的父级栅格列元素
      parentRowEl: null, // 元素的父级栅格行元素
      parentColSiblingEl: null, // 元素的父级栅格列兄弟元素
      originHeight: null, // 元素的原始高度
      layoutHeight: null, // 元素的布局高度
      maxHeight: null // 元素的最大高度
    };
  },
  watch: {
    activeImageValueAndSrc: {
      handler(val) {
        this.currentImage = val.ImageSrc || val.ImageValue;
        if (this.currentImage) {
          this.$nextTick(() => {
            if (this.$utilElem.getStyle(this.$el, 'visibility') === 'hidden') {
              this.currentImage = '';
            }
          });
        }
      },
      immediate: true
    }
  },
  computed: {
    activeImageValueAndSrc() {
      return {
        ImageValue: this.value,
        ImageSrc: this.src
      };
    },
    activeWrapperStyle() {
      let style = {
        width: this.$utilElem.pixelsFtt(this.width),
        height: this.$utilStr.isNum(this.maxHeight)
          ? this.$utilStr.isPercent(this.height)
            ? this.$utilElem.pixelsFtt(
                this.maxHeight * this.$utilStr.percentToDecimal(this.height)
              )
            : this.$utilStr.isEmpty(this.height)
            ? this.$utilElem.pixelsFtt(this.maxHeight)
            : this.$utilElem.pixelsFtt(this.height)
          : this.$utilElem.pixelsFtt(this.height),
        maxHeight: this.$utilElem.pixelsFtt(this.maxHeight)
      };
      return this.$utilStr.clearObjUndef(style);
    }
  },
  mounted() {
    let parentFormItem = this.queryComponentParent('ElFormItem');
    if (parentFormItem) {
      this.parentFormItemEl = parentFormItem.$el;
      let parentCol = this.queryComponentParent('ElCol', parentFormItem);
      if (parentCol) {
        this.parentColEl = parentCol.$el;
        let parentRow = this.queryComponentParent('ElRow', parentCol);
        if (parentRow) {
          this.parentRowEl = parentRow.$el;
          let parentColPT = parseFloat(
            this.$utilElem.getStyle(this.parentColEl, 'paddingTop')
          );
          let parentColPB = parseFloat(
            this.$utilElem.getStyle(this.parentColEl, 'paddingBottom')
          );
          let parentColBT = parseFloat(
            this.$utilElem.getStyle(this.parentColEl, 'borderTop')
          );
          let parentColBB = parseFloat(
            this.$utilElem.getStyle(this.parentColEl, 'borderBottom')
          );
          let parentColChildren = this.parentColEl.children;
          let parentColChildrenTH = 0;
          Array.from(parentColChildren).forEach((e) => {
            if (
              ['absolute', 'fixed'].indexOf(
                this.$utilElem.getStyle(e, 'position')
              ) === -1
            ) {
              let currentMT = parseInt(this.$utilElem.getStyle(e, 'marginTop'));
              let currentMB = parseInt(
                this.$utilElem.getStyle(e, 'marginBottom')
              );
              parentColChildrenTH += e.offsetHeight + currentMT + currentMB;
            }
          });
          this.originHeight = this.$el.offsetHeight;
          this.layoutHeight =
            parentColChildrenTH -
            this.originHeight +
            parentColPT +
            parentColPB +
            parentColBT +
            parentColBB;
          this.parentColSiblingEl =
            this.parentColEl.previousElementSibling ||
            this.parentColEl.nextElementSibling;
          if (this.parentColSiblingEl) {
            this.$erd.listenTo(this.parentColSiblingEl, this.setMaxHeight);
          } else {
            this.$erd.listenTo(
              this.parentRowEl,
              this.addParentColSiblingResizeListener
            );
          }
        }
      }
    }
    this.setPreviewTopBar();
  },
  destroyed() {
    if (this.parentRowEl) {
      this.$erd.removeListener(
        this.parentRowEl,
        this.addParentColSiblingResizeListener
      );
    }
    if (this.parentColSiblingEl) {
      this.$erd.removeListener(this.parentColSiblingEl, this.setMaxHeight);
    }
  },
  methods: {
    // 添加元素的父级栅格列兄弟元素大小变化监听
    addParentColSiblingResizeListener() {
      this.parentColSiblingEl =
        this.parentColEl.previousElementSibling ||
        this.parentColEl.nextElementSibling;
      if (this.parentColSiblingEl) {
        this.$erd.removeListener(
          this.parentRowEl,
          this.addParentColSiblingResizeListener
        );
        this.$erd.listenTo(this.parentColSiblingEl, this.setMaxHeight);
      }
    },
    // 设置最大高度
    setMaxHeight() {
      if (this.parentColSiblingEl.clientHeight > 0) {
        if (
          this.parentColSiblingEl.offsetHeight !== this.parentColEl.offsetHeight
        ) {
          let maxHeight =
            this.parentColSiblingEl.offsetHeight - this.layoutHeight;
          if (this.originHeight <= maxHeight) {
            this.maxHeight = maxHeight;
          }
        }
      } else {
        this.maxHeight = null;
      }
    },
    load(evt) {
      this.$emit('currentLoaded', true, evt);
      this.$previewRefresh();
      this.$refs.imageRef.$el.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    },
    error(err) {
      this.$emit('currentLoaded', false, err);
    },
    setPreviewTopBar() {
      this.$preview.on('imageLoadComplete', (i, item) => {
        let scrollWrapEl = this.$preview.self.scrollWrap;
        let topBarEl = scrollWrapEl.querySelector('.pswp__top-bar');
        let rotateBtnEl = topBarEl.querySelector('.pswp__button--rotate');
        if (rotateBtnEl) {
          rotateBtnEl.remove();
        }
        let targetEl = topBarEl.querySelector('.pswp__button--zoom');
        rotateBtnEl = document.createElement('button');
        rotateBtnEl.title = '向右旋转';
        rotateBtnEl.className = 'pswp__button pswp__button--rotate';
        rotateBtnEl.onclick = () => {
          let containerEl = scrollWrapEl.querySelector('.pswp__container');
          let containerElOffsetX = this.$utilElem
            .getStyle(containerEl, 'transform')
            .match(/[^\(\)]+(?=\))/g)[0]
            .split(',')[4];
          let activeItemElOffsetX = this.$utilElem
            .getStyle(activeItemEl, 'transform')
            .match(/[^\(\)]+(?=\))/g)[0]
            .split(',')[4];
          if (
            parseInt(containerElOffsetX) + parseInt(activeItemElOffsetX) !==
            0
          ) {
            try {
              [].forEach.call(
                scrollWrapEl.querySelectorAll('.pswp__item'),
                (e) => {
                  let itemElOffsetX = this.$utilElem
                    .getStyle(e, 'transform')
                    .match(/[^\(\)]+(?=\))/g)[0]
                    .split(',')[4];
                  if (
                    parseInt(containerElOffsetX) + parseInt(itemElOffsetX) ===
                    0
                  ) {
                    activeItemEl = e;
                    throw Error();
                  }
                }
              );
            } catch (e) {}
          }
          let activeImgEl = activeItemEl.querySelector('img.pswp__img');
          if (!activeImgEl.getAttribute('data-rotate')) {
            activeImgEl.setAttribute('data-rotate', '0');
          }
          let dataRotate =
            parseInt(activeImgEl.getAttribute('data-rotate')) + 90;
          activeImgEl.style.transform = 'rotate(' + dataRotate + 'deg)';
          activeImgEl.setAttribute('data-rotate', dataRotate.toString());
        };
        let activeItemEl = item.container.parentNode;
        topBarEl.insertBefore(rotateBtnEl, targetEl);
        topBarEl
          .querySelector('.pswp__button--zoom')
          .setAttribute('title', '放大/缩小');
        topBarEl
          .querySelector('.pswp__button--fs')
          .setAttribute('title', '切换全屏');
        topBarEl
          .querySelector('.pswp__button--close')
          .setAttribute('title', '关闭窗口');
        scrollWrapEl
          .querySelector('.pswp__button--arrow--left')
          .setAttribute('title', '上一张');
        scrollWrapEl
          .querySelector('.pswp__button--arrow--right')
          .setAttribute('title', '下一张');
      });
    }
  }
};
</script>

<style scoped>
</style>
