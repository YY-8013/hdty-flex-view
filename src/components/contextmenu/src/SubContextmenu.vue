<template>
  <ul class="hdty-contextmenu-body">
    <li
      v-for="item in menus"
      class="hdty-contextmenu-item"
      :divided="item.divided">
      <button
        type="button"
        :disabled="item.disabled"
        :class="{ 'is-disabled': item.disabled }"
        @mouseenter="handleMouseenter($event)"
        @mouseleave="handleMouseleave($event)"
        @click="handleClick(item, $event)">
        <i
          v-if="item.icon"
          class="hdty-contextmenu-icon"
          :class="item.icon">
        </i>
        {{ item.label }}
        <i
          v-if="item.children && !item.disabled"
          class="hdty-contextmenu-icon--arrow el-icon-arrow-right">
        </i>
      </button>
      <div
        v-if="item.children"
        class="hdty-contextmenu-sublist">
        <sub-contextmenu :menus="item.children"></sub-contextmenu>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "SubContextmenu",
    provide() {
      return {
        hdSubContextmenu: this
      };
    },
    inject: ['hdContextmenu'],
    props: {
      menus: [Array, Object]
    },
    methods: {
      handleMouseenter(e) {
        let _this = this;
        let childEl = e.target.nextElementSibling;
        if(childEl) {
          // 父元素的偏移量
          let offset = _this.$utilElem.getOffset(e.target);
          let offsetLeft = offset.left;
          let offsetTop= offset.top;
          // 父菜单宽高
          let rmWidth = _this.$el.offsetWidth;
          let rmHeight = _this.$el.offsetHeight;
          // 网页的宽高
          let pageWidth = document.documentElement.clientWidth;
          let pageHeight = document.documentElement.clientHeight;
          childEl.style.display = 'block';
          _this.$nextTick(() => {
            // 菜单宽高
            let cmWidth = childEl.offsetWidth;
            let cmHeight = childEl.offsetHeight;
            // 判断：如果父元素的偏移量+父菜单的宽度+菜单的宽度>网页的宽度，那么就改为右边定位
            if ((offsetLeft + rmWidth + cmWidth) < pageWidth) {
              childEl.style.left = '100%';
            } else {
              childEl.style.right = '100%';
            }
            // 判断：如果父元素的偏移量+父菜单的高度+菜单的高度>网页的高度，那么就改为底部定位
            if ((offsetTop + rmHeight + cmHeight) < pageHeight) {
              childEl.style.top = '0';
            } else {
              childEl.style.bottom = '0';
            }
          });
        }
      },
      handleMouseleave(e) {
        let child = e.target.nextElementSibling;
        if(child) {
          child.style.display = 'none';
        }
      },
      handleClick(val, e) {
        if (val && typeof(val.onclick) === 'function') {
          this.hdContextmenu.visible = false;
          return val.onclick(val, e, this.hdContextmenu.currentTarget);
        }
      }
    }
  }
</script>

<style scoped>

</style>
