<template>
  <transition name="fadeInOut">
    <div
      v-show="activeShow"
      class="hdty-drawer-wrapper"
      :class="[
        showExpandButton && 'hdty-drawer-expand',
        direction && 'is-' + direction,
        showModal && 'is-modal',
        visible && 'is-open'
      ]"
      :style="positionOffset"
      :append-to-body="appendToBody"
      @click.self="handleModalClick">
      <div
        class="hdty-drawer"
        :class="showExpandButton && !rendered && !visible && 'animation-out-stop'"
        :style="activeDrawerStyle">
        <div v-if="showHeader" class="hdty-drawer-header">
          <span v-if="showTitle" class="hdty-drawer-title">
            {{ title }}
          </span>
          <div v-if="showCloseButton" class="hdty-drawer-close" @click="handleClose">
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div v-if="rendered" class="hdty-drawer-body">
          <slot></slot>
        </div>
        <div v-if="$slots.footer" class="hdty-drawer-footer">
          <slot name="footer"></slot>
        </div>
        <div
          v-if="showExpandButton"
          :title="!visible ? '点击展开' : '点击收起'"
          class="hdty-drawer-expand-button"
          @click.stop="handleExpandClick">
          <i
            class="hdty-drawer-expand-icon"
            :class="[
              direction === 'btt' || direction === 'ttb' ? 'icon-thin-arrow-down' : 'icon-thin-arrow-right',
              visible && 'is-reverse'
            ]">
          </i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "index",
    provide() {
      return {
        hdDrawer: this
      };
    },
    props: {
      // 抽屉是否显示
      visible: {
        type: Boolean,
        default: false
      },
      // 抽屉标题
      title: {
        type: String,
        default: ''
      },
      // 打开方向（从右往左rtl / 从左往右ltr / 从下往上btt / 从上往下ttb）
      direction: {
        type: String,
        default: 'rtl'
      },
      // 宽度
      width: {
        type: [Number, String],
        default() {
          if(this.direction === 'rtl') {
            return 350;
          } else if(this.direction === 'ltr') {
            return 350;
          } else if(this.direction === 'btt') {
            return null;
          } else if(this.direction === 'ttb') {
            return null;
          } else {
            return 350;
          }
        }
      },
      // 高度
      height: {
        type: [Number, String],
        default() {
          if(this.direction === 'rtl') {
            return null;
          } else if(this.direction === 'ltr') {
            return null;
          } else if(this.direction === 'btt') {
            return 230;
          } else if(this.direction === 'ttb') {
            return 230;
          } else {
            return 350;
          }
        }
      },
      // 是否显示标题栏
      showHeader: {
        type: Boolean,
        default: true
      },
      // 是否显示标题
      showTitle: {
        type: Boolean,
        default: true
      },
      // 是否显示遮罩层
      showModal: {
        type: Boolean,
        default: true
      },
      // 是否允许点击遮罩层关闭抽屉
      closeOnModal: {
        type: Boolean,
        default: true
      },
      // 是否显示关闭按钮
      showCloseButton: {
        type: Boolean,
        default: true
      },
      // 是否显示展开/收起按钮
      showExpandButton: {
        type: Boolean,
        default: false
      },
      // 抽屉是否插入在body上（支持CSS选择器）
      appendToBody: {
        type: [Boolean, String],
        default: false
      }
    },
    data() {
      return {
        rendered: false,
        positionOffset: null,
        maskEl: null
      }
    },
    computed: {
      activeShow() {
        return !this.showExpandButton ? this.visible : true;
      },
      activeDrawerStyle() {
        let style = {
          width: this.$utilElem.pixelsFtt(this.width),
          height: this.$utilElem.pixelsFtt(this.height)
        };
        return this.$utilStr.clearObjUndef(style);
      }
    },
    watch: {
      visible: {
        handler(val) {
          if(val) {
            this.open();
          } else {
            this.hideMask();
          }
        },
        immediate: false
      }
    },
    mounted() {
      if(this.visible) {
        this.open();
        if(this.appendToBody) {
          this.insertToBody();
        }
      }
    },
    destroyed() {
      if (this.appendToBody && this.$el) {
        this.$el.remove();
      }
      this.removeMask();
    },
    methods: {
      // 打开
      open() {
        this.$emit('currentOpen');
        if(!this.rendered) {
          this.changePosition();
          this.rendered = true;
          this.$nextTick(() => {
            this.changePosition();
          });
          if(this.appendToBody) {
            this.insertToBody();
          }
        }
        if(this.showModal) {
          this.createMask();
        }
      },
      // 关闭
      handleClose() {
        this.$emit('update:visible', false);
        this.$emit('currentClose');
        this.hideMask();
      },
      // 遮罩层点击
      handleModalClick() {
        if(this.showModal && this.closeOnModal) {
          this.handleClose();
        }
      },
      // 展开按钮点击
      handleExpandClick() {
        if(!this.visible) {
          this.$emit('update:visible', true);
        } else {
          this.handleClose();
        }
      },
      // 改变定位
      changePosition() {
        if(!this.appendToBody) {
          let parentEl = this.$el.parentNode;
          if(parentEl) {
            let parentWidth = parentEl.clientWidth;
            let parentHeight = parentEl.clientHeight;
            let absoluteParentEl = this.$utilElem.queryAbsoluteOffsetParent(parentEl);
            if(absoluteParentEl) {
              let absoluteParentWidth = absoluteParentEl.clientWidth;
              let absoluteParentHeight = absoluteParentEl.clientHeight;
              let absoluteParentOffset = this.$utilElem.getOffsetOfAbsolute(parentEl);
              let currentOffsetLeft = absoluteParentOffset.left;
              let currentOffsetRight = absoluteParentWidth - parentWidth - absoluteParentOffset.left;
              let currentOffsetTop = absoluteParentOffset.top;
              let currentOffsetBottom = absoluteParentHeight - parentHeight - absoluteParentOffset.top;
              this.positionOffset = {
                ...this.positionOffset,
                left: currentOffsetLeft && -currentOffsetLeft + 'px',
                right: currentOffsetRight && -currentOffsetRight + 'px',
                top: currentOffsetTop && -currentOffsetTop + 'px',
                bottom: currentOffsetBottom && -currentOffsetBottom + 'px',
              };
            }
          }
        }
        if(!this.showModal) {
          let drawerEl = this.$el.querySelector('.hdty-drawer');
          let drawerOffsetWidth = drawerEl.offsetWidth;
          let drawerOffsetHeight = drawerEl.offsetHeight;
          let drawerMarginLeft = parseFloat(this.$utilElem.getStyle(drawerEl, 'marginLeft'));
          let drawerMarginRight = parseFloat(this.$utilElem.getStyle(drawerEl, 'marginRight'));
          let drawerMarginTop = parseFloat(this.$utilElem.getStyle(drawerEl, 'marginTop'));
          let drawerMarginBottom = parseFloat(this.$utilElem.getStyle(drawerEl, 'marginBottom'));
          if(this.direction === 'rtl') {
            this.positionOffset = {
              ...this.positionOffset,
              left: 'auto',
              width: this.$utilElem.pixelsFtt(drawerOffsetWidth + drawerMarginLeft + drawerMarginRight)
            };
          } else if(this.direction === 'ltr') {
            this.positionOffset = {
              ...this.positionOffset,
              right: 'auto',
              width: this.$utilElem.pixelsFtt(drawerOffsetWidth + drawerMarginLeft + drawerMarginRight)
            };
          } else if(this.direction === 'btt') {
            this.positionOffset = {
              ...this.positionOffset,
              top: 'auto',
              height: this.$utilElem.pixelsFtt(drawerOffsetHeight + drawerMarginTop + drawerMarginBottom)
            };
          } else if(this.direction === 'ttb') {
            this.positionOffset = {
              ...this.positionOffset,
              bottom: 'auto',
              height: this.$utilElem.pixelsFtt(drawerOffsetHeight + drawerMarginTop + drawerMarginBottom)
            };
          } else {
            this.positionOffset = {
              ...this.positionOffset,
              left: 'auto',
              width: this.$utilElem.pixelsFtt(drawerOffsetWidth + drawerMarginLeft + drawerMarginRight)
            };
          }
        }
      },
      // 创建遮罩
      createMask() {
        if(!this.maskEl) {
          this.maskEl = document.createElement('div');
          this.maskEl.setAttribute('class', 'hdty-mask');
          this.$utilElem.insertAfter(this.maskEl, this.$el);
        } else {
          this.maskEl.style.display = '';
        }
      },
      // 隐藏遮罩
      hideMask() {
        if(this.maskEl) {
          this.maskEl.style.display = 'none';
        }
      },
      // 移除遮罩
      removeMask() {
        if(this.maskEl) {
          this.maskEl.remove();
          this.maskEl = null;
        }
      },
      // 插入正文
      insertToBody() {
        if(typeof(this.appendToBody) === 'boolean') {
          document.body.appendChild(this.$el);
        } else {
          let parentBodyClass = this.appendToBody.split(' ');
          if(parentBodyClass && parentBodyClass.length > 0) {
            for (let i = 0; i < parentBodyClass.length; i++) {
              let parentBodyEl = this.$utilElem.querySelectorParent(this.$el, parentBodyClass[i]);
              if(parentBodyEl) {
                parentBodyEl.appendChild(this.$el);
                break;
              }
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fadeInOut-enter-active, .fadeInOut-leave-active {
    @include transition(all 225ms);
  }
  .fadeInOut-enter, .fadeInOut-leave-to {
    opacity: 0;
  }
</style>
