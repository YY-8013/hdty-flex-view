<template>
  <div class="hdty-query">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "index",
    componentName: 'HdQuery',
    props: {
      // 模式（expand / drawer）
      mode: {
        type: String,
        default: ''
      },
      // 展开/收起按钮尺寸（medium / small / mini）
      expandButtonSize: {
        type: String,
        default: ''
      }
    },
    computed: {
      queryWrapper() {
        let parent = this.$parent;
        if(parent) {
          let parentName = parent.$options.componentName;
          while (parentName !== 'HdQueryWrapper') {
            parent = parent.$parent;
            if(parent) {
              parentName = parent.$options.componentName;
            } else {
              break;
            }
          }
        }
        return parent;
      },
      _queryWrapperMode() {
        return this.queryWrapper && this.queryWrapper.mode;
      },
      _queryWrapperExpandButtonSize() {
        return this.queryWrapper && this.queryWrapper.expandButtonSize;
      },
      queryMode() {
        return this.mode || this._queryWrapperMode || 'expand';
      },
      queryExpandButtonSize() {
        return this.expandButtonSize || this._queryWrapperExpandButtonSize || '';
      },
    },
    methods: {
      handleReset(evt) {
        this.$emit('currentReset', evt);
        if(this.queryWrapper) {
          this.queryWrapper.handleReset();
        }
      },
      handleEnter(evt) {
        this.$emit('currentEnter', evt);
        if(this.queryWrapper) {
          this.queryWrapper.handleEnter();
        }
      }
    }
  }
</script>

<style scoped>

</style>
