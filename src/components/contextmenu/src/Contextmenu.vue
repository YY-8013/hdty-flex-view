<template>
  <div
    v-show="visible"
    class="hdty-contextmenu">
    <sub-contextmenu :menus="options.menus"></sub-contextmenu>
  </div>
</template>

<script>
  import SubContextmenu from "./SubContextmenu";
  export default {
    name: "Contextmenu",
    provide() {
      return {
        hdContextmenu: this
      };
    },
    components: {
      SubContextmenu
    },
    data() {
      return {
        options: {
          // 菜单选项
          menus: [],
          // 右键点击事件
          event: {},
          // 关闭回调
          onclose: null,
        },
        currentTarget: {},
        visible: false
      }
    },
    watch: {
      visible: {
        handler(val) {
          if(!val) {
            this.handleClose();
          }
        },
        immediate: false
      }
    },
    mounted() {
      let _this = this;
      // 绑定元素
      _this.currentTarget = _this.options.event.currentTarget;
      // 鼠标坐标
      let mx = _this.options.event.clientX;
      let my = _this.options.event.clientY;
      // 网页的宽高
      let pageWidth = document.documentElement.clientWidth;
      let pageHeight = document.documentElement.clientHeight;
      // 显示右键菜单
      _this.visible = true;
      _this.$nextTick(() => {
        // 菜单宽高
        let rmWidth = _this.$el.offsetWidth;
        let rmHeight = _this.$el.offsetHeight;
        // 判断：如果鼠标的位置+菜单的宽度>网页的宽度，那么就改为右边定位
        if ((mx + rmWidth) < pageWidth) {
          _this.$el.style.left = mx + 'px';
        } else {
          _this.$el.style.right = (pageWidth - mx) + 'px';
        }
        // 判断：如果鼠标的位置+菜单的高度>网页的高度，那么就改为底部定位
        if ((my + rmHeight) < pageHeight) {
          _this.$el.style.top = my + 'px';
        } else {
          _this.$el.style.bottom = (pageHeight - my)  + 'px';
        }
      });

      // 点击其他位置隐藏右键菜单
      document.documentElement.onclick = e => {
        if(!_this.$el.contains(e.target)) {
          _this.visible = false;
          document.documentElement.onclick = null;
        }
      };
      document.documentElement.oncontextmenu = e => {
        if(!_this.options.event.target.contains(e.target)) {
          _this.visible = false;
          document.documentElement.oncontextmenu = null;
        }
      };
    },
    methods: {
      handleClose() {
        if (typeof(this.options.onclose) === 'function') {
          return this.options.onclose(this.options, this.currentTarget);
        }
      }
    }
  }
</script>

<style scoped>

</style>
