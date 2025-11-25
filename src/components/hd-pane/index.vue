<template>
  <div class="hdty-scroll" :fit="fit" :fill="fill" :style="activePaneStyle">
    <slot v-if="rendered">
    </slot>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: {
      // 高度自适应
      fit: {
        type: Boolean,
        default: false
      },
      // 高度撑满
      fill: {
        type: Boolean,
        default: false
      },
      // 默认高度（fit和fill都为false时生效）
      height: {
        type: [Number, String],
        default: 700
      },
      // 默认最大高度
      maxHeight: {
        type: [Number, String],
        default: null
      },
      // 是否启用上文做工作区
      aboveIsScreen: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 渲染
        rendered: false,
        // 初始化完成
        initComplete: false,
        // 当前高度
        currentHeight: null,
        // 当前最大高度
        currentMaxHeight: null,
        // 屏幕可见区域高度
        screenHeight: document.documentElement.clientHeight,
        // 可用工作区高度
        workspaceHeight: 0,
        // 布局占用高度
        occupyHeight: 0,
        // 元素的真实高度
        paneOffsetHeight: 0,
        // 渲染前父级元素的真实高度
        beforeParentOffsetHeight: 0,
        // 父级元素的真实高度
        parentOffsetHeight: 0,
        // 父级元素的留白高度
        parentSpaceHeight: 0,
        // 父级元素子元素的总高度
        parentChildrenTotalHeight: 0,
        // 渲染前最近的进行过绝对定位的父级元素的真实高度
        beforeAbsoluteParentOffsetHeight: 0,
        // 最近的进行过绝对定位的父级元素的真实高度
        absoluteParentOffsetHeight: 0,
        // 最近的进行过绝对定位的父级元素的留白高度
        absoluteParentSpaceHeight: 0,
        // 最近的进行过绝对定位的父级元素子元素的总高度
        absoluteParentChildrenTotalHeight: 0,
        // 渲染前最近的进行过溢出滚动的父级元素的真实高度
        beforeScrollParentOffsetHeight: 0,
        // 最近的进行过溢出滚动的父级元素的真实高度
        scrollParentOffsetHeight: 0,
        // 最近的进行过溢出滚动的父级元素的留白高度
        scrollParentSpaceHeight: 0,
        // 最近的进行过溢出滚动的父级元素子元素的总高度
        scrollParentChildrenTotalHeight: 0,
        // 默认绑定样式
        defaultPaneStyle: {
          // 绑定高度值
          height: 'auto',
          // 绑定最大高度值
          maxHeight: 'none'
        }
      }
    },
    computed: {
      paneElement() {
        return this.$el;
      },
      parentElement() {
        return this.$utilElem.querySelectorParent(this.paneElement);
      },
      parentChildren() {
        return this.parentElement && this.parentElement.children;
      },
      absoluteParentElement() {
        let currentAbsoluteParentElement = this.$utilElem.queryAbsoluteOffsetParent(this.paneElement);
        if(this.parentElement && !this.parentElement.contains(currentAbsoluteParentElement)) {
          return currentAbsoluteParentElement;
        }
      },
      absoluteParentChildren() {
        return this.absoluteParentElement && this.absoluteParentElement.children;
      },
      scrollParentElement() {
        let currentScrollParentElement = this.$utilElem.querySelectorParent(this.parentElement, '.hdty-scroll') || this.$utilElem.querySelectorParent(this.parentElement, '.hdty-scrollbar');
        if(this.parentElement && !this.parentElement.contains(currentScrollParentElement)) {
          if(!this.absoluteParentElement || this.absoluteParentElement.contains(currentScrollParentElement) && this.absoluteParentElement !== currentScrollParentElement) {
            return currentScrollParentElement;
          }
        }
      },
      scrollParentChildren() {
        return this.scrollParentElement && this.scrollParentElement.children;
      },
      activePaneStyle() {
        let paneStyle = {
          height: this.$utilElem.pixelsFtt(this.currentHeight),
          maxHeight: this.$utilElem.pixelsFtt(this.currentMaxHeight)
        };
        return Object.assign(this.defaultPaneStyle, this.$utilStr.clearObjUndef(paneStyle));
      }
    },
    mounted() {
      if(this.parentElement) {
        this.beforeParentOffsetHeight = this.parentElement.offsetHeight;
      }
      if(this.absoluteParentElement) {
        this.beforeAbsoluteParentOffsetHeight = this.absoluteParentElement.offsetHeight;
      }
      if(this.scrollParentElement) {
        this.beforeScrollParentOffsetHeight = this.scrollParentElement.offsetHeight;
      }
      this.rendered = true;
      this.$nextTick(() => {
        this.init();
      });
    },
    destroyed() {
      this.$erd.uninstall(this.paneElement);
      window.removeEventListener('resize', this.listenScreenResize);
    },
    methods: {
      // 初始化
      init() {
        if(this.paneElement.scrollWidth || this.paneElement.scrollHeight) {
          this.setInitContent();
        } else {
          this.$erd.listenTo(this.paneElement, this.setInitContent);
        }
      },
      // 设置初始化内容
      setInitContent(element) {
        if(element) {
          this.$erd.removeListener(this.paneElement, this.setInitContent);
        }
        this.setScroll();
        window.addEventListener('resize', this.listenScreenResize);
        if(!this.initComplete) {
          this.initComplete = true;
        }
      },
      // 设置滚动
      setScroll() {
        if(!isNaN(parseFloat(this.maxHeight) && Number(this.maxHeight))) {
          this.currentMaxHeight = this.maxHeight;
        } else if(!isNaN(parseFloat(this.maxHeight))) {
          this.currentMaxHeight = this.maxHeight;
        } else {
          this.setReferenceHeight();
          this.setWorkspaceHeight();
          this.setOccupyHeight();
          this.currentMaxHeight = this.workspaceHeight - this.occupyHeight;
        }
        if(this.fill) {
          this.currentHeight = this.currentMaxHeight;
        } else if(this.fit) {
          this.currentHeight = null;
        } else {
          this.currentHeight = this.height;
        }
        if(this.paneElement.mask) {
          this.paneElement.style.setProperty('position', 'static', 'important');
          this.parentElement.style.position = 'relative';
        }
      },
      // 设置参照元素高度
      setReferenceHeight() {
        this.paneOffsetHeight = this.paneElement.offsetHeight;
        if(this.parentElement) {
          this.parentOffsetHeight = this.parentElement.offsetHeight;
          let bTop = parseInt(this.$utilElem.getStyle(this.parentElement, 'borderTop'));
          let bBottom = parseInt(this.$utilElem.getStyle(this.parentElement, 'borderBottom'));
          let pTop = parseInt(this.$utilElem.getStyle(this.parentElement, 'paddingTop'));
          let pBottom = parseInt(this.$utilElem.getStyle(this.parentElement, 'paddingBottom'));
          this.parentSpaceHeight = bTop + bBottom + pTop + pBottom;
          this.parentChildrenTotalHeight = 0;
          Array.from(this.parentChildren).forEach(e => {
            if(['absolute', 'fixed'].indexOf(this.$utilElem.getStyle(e, 'position')) === -1) {
              let mTop = parseInt(this.$utilElem.getStyle(e, 'marginTop'));
              let mBottom = parseInt(this.$utilElem.getStyle(e, 'marginBottom'));
              this.parentChildrenTotalHeight += (e.offsetHeight + mTop + mBottom);
            }
          });
        }
        if(this.absoluteParentElement) {
          this.absoluteParentOffsetHeight = this.absoluteParentElement.offsetHeight;
          let bTop = parseInt(this.$utilElem.getStyle(this.absoluteParentElement, 'borderTop'));
          let bBottom = parseInt(this.$utilElem.getStyle(this.absoluteParentElement, 'borderBottom'));
          let pTop = parseInt(this.$utilElem.getStyle(this.absoluteParentElement, 'paddingTop'));
          let pBottom = parseInt(this.$utilElem.getStyle(this.absoluteParentElement, 'paddingBottom'));
          this.absoluteParentSpaceHeight = bTop + bBottom + pTop + pBottom;
          this.absoluteParentChildrenTotalHeight = 0;
          Array.from(this.absoluteParentChildren).forEach(e => {
            if(['absolute', 'fixed'].indexOf(this.$utilElem.getStyle(e, 'position')) === -1) {
              let mTop = parseInt(this.$utilElem.getStyle(e, 'marginTop'));
              let mBottom = parseInt(this.$utilElem.getStyle(e, 'marginBottom'));
              this.absoluteParentChildrenTotalHeight += (e.offsetHeight + mTop + mBottom);
            }
          });
        }
        if(this.scrollParentElement) {
          this.scrollParentOffsetHeight = this.scrollParentElement.offsetHeight;
          let bTop = parseInt(this.$utilElem.getStyle(this.scrollParentElement, 'borderTop'));
          let bBottom = parseInt(this.$utilElem.getStyle(this.scrollParentElement, 'borderBottom'));
          let pTop = parseInt(this.$utilElem.getStyle(this.scrollParentElement, 'paddingTop'));
          let pBottom = parseInt(this.$utilElem.getStyle(this.scrollParentElement, 'paddingBottom'));
          this.scrollParentSpaceHeight = bTop + bBottom + pTop + pBottom;
          this.scrollParentChildrenTotalHeight = 0;
          Array.from(this.scrollParentChildren).forEach(e => {
            if(['absolute', 'fixed'].indexOf(this.$utilElem.getStyle(e, 'position')) === -1) {
              let mTop = parseInt(this.$utilElem.getStyle(e, 'marginTop'));
              let mBottom = parseInt(this.$utilElem.getStyle(e, 'marginBottom'));
              this.scrollParentChildrenTotalHeight += (e.offsetHeight + mTop + mBottom);
            }
          });
        }
      },
      // 设置可用工作区高度
      setWorkspaceHeight() {
        if(this.aboveIsScreen) {
          if(this.scrollParentElement) {
            if(this.absoluteParentElement) {
              if(this.beforeAbsoluteParentOffsetHeight === this.absoluteParentOffsetHeight) {
                this.workspaceHeight = this.absoluteParentOffsetHeight;
              } else {
                this.workspaceHeight = this.screenHeight - this.$utilElem.getOffset(this.absoluteParentElement).top;
              }
            } else if(this.beforeScrollParentOffsetHeight === this.scrollParentOffsetHeight) {
              this.workspaceHeight = this.scrollParentOffsetHeight;
            } else {
              this.workspaceHeight = this.screenHeight - this.$utilElem.getOffset(this.scrollParentElement).top;
            }
          } else if(this.absoluteParentElement) {
            if(this.beforeAbsoluteParentOffsetHeight === this.absoluteParentOffsetHeight) {
              this.workspaceHeight = this.absoluteParentOffsetHeight;
            } else {
              this.workspaceHeight = this.screenHeight - this.$utilElem.getOffset(this.absoluteParentElement).top;
            }
          } else if(this.parentElement) {
            if(this.beforeParentOffsetHeight === this.parentOffsetHeight) {
              this.workspaceHeight = this.parentOffsetHeight;
            } else {
              this.workspaceHeight = this.screenHeight - this.$utilElem.getOffset(this.parentElement).top;
            }
          } else {
            this.workspaceHeight = this.screenHeight;
          }
        } else {
          this.workspaceHeight = this.screenHeight;
        }
      },
      // 设置布局占用高度
      setOccupyHeight() {
        if(this.scrollParentElement) {
          if(this.absoluteParentElement) {
            if(this.scrollParentOffsetHeight - this.scrollParentSpaceHeight === this.scrollParentChildrenTotalHeight) {
              this.occupyHeight = this.absoluteParentChildrenTotalHeight - this.paneOffsetHeight + this.absoluteParentSpaceHeight;
            } else {
              this.occupyHeight = this.absoluteParentChildrenTotalHeight - this.scrollParentOffsetHeight - this.paneOffsetHeight + this.scrollParentChildrenTotalHeight + this.scrollParentSpaceHeight + this.absoluteParentSpaceHeight;
            }
          } else {
            this.occupyHeight = this.scrollParentChildrenTotalHeight - this.paneOffsetHeight + this.scrollParentSpaceHeight;
          }
        } else if(this.absoluteParentElement) {
          if(this.parentOffsetHeight - this.parentSpaceHeight === this.parentChildrenTotalHeight) {
            this.occupyHeight = this.absoluteParentChildrenTotalHeight - this.paneOffsetHeight + this.absoluteParentSpaceHeight;
          } else {
            this.occupyHeight = this.absoluteParentChildrenTotalHeight - this.parentOffsetHeight - this.paneOffsetHeight + this.parentChildrenTotalHeight + this.parentSpaceHeight + this.absoluteParentSpaceHeight;
          }
        } else if(this.parentElement) {
          this.occupyHeight = this.parentChildrenTotalHeight - this.paneOffsetHeight + this.parentSpaceHeight;
        } else {
          this.occupyHeight = parseInt(this.$utilElem.getStyle(this.paneElement, 'marginTop')) + parseInt(this.$utilElem.getStyle(this.paneElement, 'marginBottom'));
        }
      },
      // 监听屏幕可见区域大小变化
      listenScreenResize() {
        if(this.initComplete) {
          if(this.paneElement.scrollWidth || this.paneElement.scrollHeight) {
            this.resetScroll();
          } else {
            window.removeEventListener('resize', this.listenScreenResize);
            this.$erd.listenTo(this.paneElement, this.resetScroll);
          }
        }
      },
      // 重置滚动
      resetScroll(element) {
        this.screenHeight = document.documentElement.clientHeight;
        if(element) {
          this.$erd.uninstall(this.paneElement);
          // this.$erd.removeListener(this.paneElement, this.resetScroll);
          this.initComplete = false;
          this.currentHeight = null;
          this.currentMaxHeight = null;
          this.$nextTick(() => {
            this.setScroll();
            window.addEventListener('resize', this.listenScreenResize);
            if(!this.initComplete) {
              this.initComplete = true;
            }
          });
        } else {
          this.setScroll();
        }
      }
    }
  }
</script>

<style scoped>

</style>
