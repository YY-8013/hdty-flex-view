<template>
  <div class="hdty-container hdty-flex">
    这是总览页面
  </div>
</template>
<script>
  import {hdList} from '@/utils/util-framework';

  export default {
    name: "NewTaskCenterDisLisView",
    provide() {
      return {
        NewTaskCenterDisLisView: this
      };
    },
    inject: ['hdList'],
    mixins: [hdList],
    components: {},
    data() {
      return {}
    },
    mounted() {

    },
    methods: {}
  }
</script>

<style lang="scss" scoped>

</style>
