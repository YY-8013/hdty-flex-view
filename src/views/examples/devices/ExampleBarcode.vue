<template>
  <div class="hdty-container hdty-scroll">
    <hd-barcode v-model="input" @currentChanged="handleBarcodeChange"></hd-barcode>
  </div>
</template>

<script>
  export default {
    name: "ExampleBarcode",
    data() {
      return {
        input: ''
      }
    },
    methods: {
      // 条码改变
      handleBarcodeChange(val) {
        console.log('条码改变：', val);
      }
    }
  }
</script>

<style scoped>

</style>
