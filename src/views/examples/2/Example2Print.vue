<template>
  <hd-print
    :visible.sync="visible"
    rotated="landscape"
    @closed="handleClose">
    <div class="hdty-fluid">
      <p>这是打印内容</p>
    </div>
  </hd-print>
</template>

<script>
  export default {
    name: "Example2Print",
    provide() {
      return {
        hdPrint: this
      };
    },
    inject: ['hdList'],
    data() {
      return {
        // 显示
        visible: false
      }
    },
    methods: {
      // 打印关闭
      handleClose() {
        console.log('打印已经关闭');
      }
    }
  }
</script>

<style scoped>

</style>
