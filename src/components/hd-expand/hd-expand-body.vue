<template>
  <div
    v-if="mode === 'expand'"
    class="hdty-query-expand"
    :class="{ 'is-expand': opened }">
    <slot></slot>
  </div>
  <hd-drawer
    v-else
    ref="expandDrawerRef"
    :visible.sync="opened"
    title="全部筛选"
    class="hdty-drawer-search"
    append-to-body=".hdty-body .el-dialog__body .el-drawer__body"
    @currentClose="handleClose">
    <hd-pane
      above-is-screen
      fill>
      <slot></slot>
    </hd-pane>
    <div class="hdty-drawer-footer">
      <el-button
        @click="handleReset">
        重 置
      </el-button>
      <hd-button
        type="primary"
        @click="handleEnter">
        确 定
      </hd-button>
    </div>
  </hd-drawer>
</template>

<script>
  export default {
    name: "HdExpandBody",
    componentName: 'HdExpandBody',
    data() {
      return {
        // 打开
        opened: false
      }
    },
    computed: {
      expand() {
        let parent = this.$parent;
        let parentName = parent.$options.componentName;
        while (parentName !== 'HdExpand') {
          parent = parent.$parent;
          if(!parent) break;
          parentName = parent.$options.componentName;
        }
        return parent;
      },
      expandHeader() {
        let children = this.expand.$children;
        if(children && children.length > 0) {
          return (function find(components) {
            for(let i = 0, iLen = components.length; i < iLen; i++) {
              let componentName = components[i].$options.componentName;
              if(componentName === 'HdExpandHeader') {
                return components[i];
              } else {
                let componentChildren = components[i].$children;
                if(componentChildren && componentChildren.length > 0) {
                  let findComponent = find(componentChildren);
                  if(findComponent) {
                    return findComponent;
                  }
                }
              }
            }
          })(children);
        }
      },
      mode() {
        return this.expand.mode;
      }
    },
    methods: {
      handleEnter() {
        this.expandHeader.handleMore();
        this.expand.handleEnter();
      },
      handleReset() {
        this.expand.handleReset();
      },
      handleClose() {
        this.expandHeader.handleMore();
      }
    }
  }
</script>

<style scoped>

</style>
