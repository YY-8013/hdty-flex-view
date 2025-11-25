<template>
  <div class="hdty-content">
    <div class="hdty-btn-container">
      <el-radio-group v-model="radio" size="medium">
        <el-radio-button label="北京"></el-radio-button>
        <el-radio-button label="上海"></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="radio" size="default">
        <el-radio-button label="北京"></el-radio-button>
        <el-radio-button label="上海"></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="radio" size="small">
        <el-radio-button label="北京"></el-radio-button>
        <el-radio-button label="上海"></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="radio" size="mini">
        <el-radio-button label="北京"></el-radio-button>
        <el-radio-button label="上海"></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Button12",
    data() {
      return {
        radio: ''
      }
    }
  }
</script>

<style scoped>

</style>
