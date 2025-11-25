<template>
  <div>
    <biz-tabs
      slot="reference"
      v-model="currentTab"
      class="biz-popover-tabs"
      ref="bizTabRef"
      type="card"
      @tab-click="clickTab"
      @tab-remove="removeTab"
      @tab-right-click="rightClick"
    >
      <biz-tab-pane
        v-for="item in tabData"
        :key="item.tabName"
        :label="item.tabLabel"
        :name="item.tabName"
        :closable="item.tabClosable"
      ></biz-tab-pane>
    </biz-tabs>
    <div class="popover-menu-mask" v-show="contextMenuVisible"></div>
    <div class="popover-menu" v-show="contextMenuVisible" ref="popoverMenuRef">
      <el-menu :default-active="activeMenu" @select="handleSelect">
        <el-menu-item
          v-for="(menuItem,index) in rightMenuList"
          :key="menuItem.value"
          :index="menuItem.value"
          @click="handleRight(menuItem.value)"
        >{{ menuItem.label }}</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageTabs',
  props: {
    active: String,
    data: [Array, Object]
  },
  data() {
    return {
      activeMenu: '',
      rightMenu: [
        {
          label: '关闭',
          value: 'close',
          show: true
        },
        {
          label: '关闭其他标签页',
          value: 'closeOther',
          show: true
        },
        {
          label: '关闭所有标签页',
          value: 'closeAll',
          show: true
        },
        {
          label: '关闭左侧标签页',
          value: 'closeLeft',
          show: true
        },
        {
          label: '关闭右侧标签页',
          value: 'closeRight',
          show: true
        }
      ],
      triggerMode: 'manual',
      offsetX: 0,
      contextMenuVisible: false,
      contextMenuPosition: { x: 0, y: 0 },
      currentTab: this.active, // currentTab接收父组件传来的active值；
      tabData: this.data, // tabData接收父组件传来的data值；
      currentRightTab: ''
    };
  },
  computed: {
    rightMenuList() {
      return this.rightMenu.filter((item) => item.show);
    }
  },
  watch: {
    active: {
      handler(val) {
        this.currentTab = val;
      },
      immediate: true
    },
    data: {
      handler(val) {
        this.tabData = val;
      },
      immediate: true
    }
  },
  methods: {
    popoverHandle(type) {
      this.triggerMode = type;
    },
    clickTab(val) {
      let currentPageTab = this.tabData.find((e) => e.tabName === val.name);
      if (currentPageTab) {
        this.$router.push(currentPageTab.tabRoute);
      } else {
        this.$router.push('/');
      }
    },
    rightClick(name, pane, event) {
      // 优化：如果只有一个tab，并且是不可删除的
      if (this.tabData.length === 1 && !this.tabData[0].tabClosable) return;
      // 优化：  动态根据当前右键位置，来确定右键菜单内容
      let tabIndex = this.tabData.findIndex((item) => item.tabName === name);
      let tabInfo = this.tabData[tabIndex];
      this.$set(this.rightMenu[0], 'show', tabInfo.tabClosable);
      this.$set(this.rightMenu[1], 'show', this.tabData.length > 1);
      this.$set(this.rightMenu[2], 'show', this.tabData.length > 1);
      this.$set(
        this.rightMenu[3],
        'show',
        this.tabData.length > 1 && tabIndex > 0
      );
      this.$set(
        this.rightMenu[4],
        'show',
        this.tabData.length > 1 && tabIndex < this.tabData.length - 1
      );
      // 动态计算下拉框位置 = 鼠标点击距离浏览器左边距离 - el-tabs距离浏览器左边距离
      // 鼠标距离浏览器的位置 - 鼠标距离当前tabItem左侧的距离
      this.offsetX = event.clientX - event.offsetX;
      let tabEl = document.querySelector('.hdty-pagetabs');
      if (tabEl) {
        this.offsetX = this.offsetX - tabEl.offsetLeft;
      }
      let popoverEl = document.querySelector('.popover-menu');
      popoverEl.style.left = this.offsetX + 'px';
      this.currentRightTab = name;
      this.contextMenuVisible = true;
      if (this.contextMenuVisible) {
        document.addEventListener('click', this.hidePopoverOutside);
        document.addEventListener('contextmenu', this.hidePopoverOutside); // 监听右键事件
      }
    },
    handleRight(type) {
      // 当前右键点击所在的索引位置
      let tabIndex = this.tabData.findIndex(
        (item) => item.tabName === this.currentRightTab
      );
      // 关闭当前页签
      if (type === 'close') {
        this.removeTab(this.currentRightTab);
        return;
      }
      let tabResult = this.tabData.reduce(
        (pre, cur, index) => {
          // 关闭其他标签
          if (type === 'closeOther') {
            if (index === tabIndex || !cur.tabClosable) {
              pre.filter.push(cur);
            } else {
              pre.remove.push(cur);
            }
          }
          // 关闭所有标签页
          if (type === 'closeAll') {
            if (!cur.tabClosable) {
              pre.filter.push(cur);
            } else {
              pre.remove.push(cur);
            }
          }
          // 关闭左侧标签页
          if (type === 'closeLeft') {
            if (index >= tabIndex || !cur.tabClosable) {
              pre.filter.push(cur);
            } else {
              pre.remove.push(cur);
            }
          }
          // 关闭右侧标签页
          if (type === 'closeRight') {
            if (index <= tabIndex || !cur.tabClosable) {
              pre.filter.push(cur);
            } else {
              pre.remove.push(cur);
            }
          }
          return pre;
        },
        {
          remove: [],
          filter: []
        }
      );

      if (tabResult.filter.find((item) => item.tabName === this.currentTab)) {
        // 将remove内的移除
      } else {
        // 如果当前打开的标签页被删除，那么判断filter是否为空，不为空的话跳转至数组的第一个，为空的话，默认跳转至 /
        if (tabResult.filter && tabResult.filter.length > 0) {
          this.$router.push(tabResult.filter[0].tabRoute);
        } else {
          this.$router.push('/');
        }
        // 将remove内的移除
      }
      this.$emit('currentClose', tabResult.filter);
      if (tabResult.remove && tabResult.remove.length > 0) {
        tabResult.remove.forEach((tabItem) => {
          this.$store.dispatch('delCachedView', tabItem.tabName);
          this.$store.dispatch('delCachedComponent', tabItem.tabName);
          // 清除同类缓冲视图
          if (!this.tabData.find((e) => e.tabClass === tabItem.tabClass)) {
            this.$store.dispatch('delSameClassCachedView', tabItem.tabClass);
            this.$store.dispatch(
              'delSameClassCachedComponent',
              tabItem.tabClass
            );
          }
        });
      }
      this.contextMenuVisible = false;
      document.removeEventListener('click', this.hidePopoverOutside);
      document.removeEventListener('contextmenu', this.hidePopoverOutside); // 监听右键事件
      this.activeMenu = '';
    },
    hidePopoverOutside(event) {
      this.contextMenuVisible = false;
    },
    handleSelect(e) {
      this.activeMenu = '';
    },
    removeTab(val) {
      let currentRemovePageTab = this.tabData.find((e) => e.tabName === val);
      this.tabData = this.tabData.filter((e) => e.tabName !== val);
      this.$emit('currentClose', this.tabData);
      let currentPageTab = this.tabData.find(
        (e) => e.tabName === this.currentTab
      );
      if (currentPageTab) {
        this.$router.push(currentPageTab.tabRoute);
      } else {
        if (this.tabData && this.tabData.length > 0) {
          this.$router.push(this.tabData[this.tabData.length - 1].tabRoute);
        } else {
          this.$router.push('/');
        }
      }
      this.$store.dispatch('delCachedView', val);
      this.$store.dispatch('delCachedComponent', val);
      if (
        !this.tabData.find((e) => e.tabClass === currentRemovePageTab.tabClass)
      ) {
        this.$store.dispatch(
          'delSameClassCachedView',
          currentRemovePageTab.tabClass
        );
        this.$store.dispatch(
          'delSameClassCachedComponent',
          currentRemovePageTab.tabClass
        );
      }
    }
  }
};
</script>

<style lang="scss">
.popover-menu {
  position: absolute !important;
  padding: 0 !important;
  background-color: #f5f6f6;
  z-index: 999;
  width: 130px;
  border-radius: 5px;
  overflow: hidden;
  .el-menu {
    .el-menu-item {
      height: 36px;
      line-height: 36px;
      &.is-active {
        color: #303133;
      }
    }
  }
}
.popover-menu-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 998; /* 确保遮罩层显示在其他内容之上 */
}
</style>
