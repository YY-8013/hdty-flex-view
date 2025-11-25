<template>
  <div
    class="hdty-guide-item"
    :class="`is-${status}`"
    :title="tooltipText"
    @click="handleClick">
    <span>{{ label }}</span>
  </div>
</template>

<script>
  export default {
    name: "HdGuideItem",
    provide() {
      return {
        hdGuideItem: this
      };
    },
    props: {
      // 引导项的标签
      label: {
        type: String,
        default: ''
      },
      // 鼠标移入元素显示提示文本
      tooltipText: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        index: -1,
        status: ''
      }
    },
    beforeCreate() {
      if(this.$parent.$options.componentName === 'HdGuide') {
        this.$parent.nodes.push(this);
      }
    },
    beforeDestroy() {
      if(this.$parent.$options.componentName === 'HdGuide') {
        let nodes = this.$parent.nodes;
        let index = nodes.indexOf(this);
        if (index >= 0) {
          nodes.splice(index, 1);
        }
      }
    },
    mounted() {
      const unwatch = this.$watch('index', () => {
        this.$watch('$parent.active', this.updateStatus, { immediate: true });
        unwatch();
      });
    },
    methods: {
      updateStatus(val) {
        if (val > this.index) {
          this.status = 'complete';
        } else if (val === this.index) {
          this.status = 'active';
        } else {
          this.status = 'wait';
        }
      },
      handleClick() {
        this.$parent.emitChildClick(this.index);
      }
    }
  }
</script>

<style scoped>

</style>
