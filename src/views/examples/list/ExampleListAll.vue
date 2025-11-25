<template>
  <div class="hdty-container hdty-flex">
    <el-tabs v-model="activeName" type="border-card" fill style="width: 100%">
      <el-tab-pane name="1">
        <template #label>列表样式1</template>
        <Example1List />
      </el-tab-pane>
      <el-tab-pane name="2">
        <template #label>列表样式2</template>
        <Example2List />
      </el-tab-pane>
      <el-tab-pane name="3">
        <template #label>列表样式3</template>
        <Example3List />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Example1List from './Example1List.vue';
import Example2List from './Example2List.vue';
import Example3List from './Example3List.vue';
export default {
  name: 'ExampleListALl',
  components: { Example1List, Example2List, Example3List },
  provide() {
    return {
      ZyzxMsgList: this
    };
  },
  created() {},
  data() {
    return {
      activeName: '1'
    };
  },
  mounted() {}
};
</script>

<style scoped>
.subPage {
  padding: 0;
}
::v-deep .el-tabs__content {
  height: calc(100% - 25px) !important;
}
::v-deep .el-tab-pane {
  height: 100% !important;
}
</style>
