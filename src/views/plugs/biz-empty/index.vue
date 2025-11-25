<template>
  <div class="hdty-empty empty-list" :class="{'hdty-empty-black': isBlack}">
    <div class="hdty-empty-title" v-if="title">{{ title }}</div>
    <div class="hdty-empty-body">
      <i class="el-icon-warning hdty-warning-color" style="font-size: 45px"></i>
      <div>{{ content }}</div>
      <div>{{ guidingContent }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  props: {
    prop: String,
    // 标题
    title: {
      type: String,
      default: "",
    },
    // 提示内容
    content: {
      type: String,
      default: "暂无数据",
    },
    // 引导内容
    guidingContent: {
      type: String,
      default: "请点击【新增】采集数据",
    },
    isBlack: {
      type: Boolean,
      default: false,
    }
  },
};
</script>

<style scoped>
.hdty-empty {
  border: 1px solid #c7c7c7;
  padding-top: 0;
  padding-bottom: 30px;
  background-color: #f5f6f6;
  /* //display: flex; */
  /* //align-items: center; */
  /* //justify-content: center; */
}
.hdty-empty-black {
  border: none;
  padding-top: 0;
  background-color: transparent;
}

.hdty-empty-black .hdty-empty-body {
  color: #a0a0a0;
}

.hdty-empty-title {
  width: 100%;
  color: #5c5c5c;
  text-align: center;
  padding-left: 10px;
  height: 40px;
  border-bottom: 1px solid #c7c7c7;
  line-height: 40px;
  display: flex;
  margin-bottom: 30px;
}
.hdty-empty-body {
  padding: 50px 0;
  text-align: center;
  color: #7f7f7f;
  font-size: 16px;
}
</style>
