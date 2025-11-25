<template>
  <div class="hdty-container hdty-scroll">
    <hd-camera
      ref="cameraRef"
      @currentOpened="handleOpened"
      @currentPhotographed="handlePhotographed"
      @currentReader="handleReader"
      @currentWitnessed="handleWitnessed">
    </hd-camera>
  </div>
</template>

<script>
  export default {
    name: "ExampleCamera",
    methods: {
      // 打开
      handleOpened(val) {
        console.log('摄像头开启成功：', val)
      },
      // 拍照
      handlePhotographed(val, filename, url, size) {
        console.log('当前拍摄照片：', val, '名称：', filename, '地址：', url, '尺寸：', size + 'KB');
      },
      // 读卡
      handleReader(val) {
        console.log('当前读取二代证结果：', val);
      },
      // 核验
      handleWitnessed(val) {
        console.log('当前人证核验结果：', val);
      }
    }
  }
</script>

<style scoped>

</style>
