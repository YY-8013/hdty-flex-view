<template>
  <div class="hdty-sort-group">
    <slot></slot>
  </div>
</template>

<script>
  import { hdComponent } from '@/utils/util-framework';
  export default {
    name: "HdSortGroup",
    componentName: 'HdSortGroup',
    provide() {
      return {
        hdSortGroup: this
      };
    },
    mixins: [hdComponent],
    props: {
      prop: String,
      value: Object
    },
    created() {
      this.$on('handleChange', value => {
        this.$emit('currentChanged', value);
      });
    }
  }
</script>

<style scoped>

</style>
