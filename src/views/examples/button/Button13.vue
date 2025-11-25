<template>
  <div class="hdty-content">
    <div class="hdty-btn-container">
      <el-checkbox-group v-model="checkbox" size="medium">
        <el-checkbox-button label="北京"></el-checkbox-button>
        <el-checkbox-button label="上海"></el-checkbox-button>
        <el-checkbox-button label="广州"></el-checkbox-button>
        <el-checkbox-button label="深圳"></el-checkbox-button>
      </el-checkbox-group>
      <el-checkbox-group v-model="checkbox" size="default">
        <el-checkbox-button label="北京"></el-checkbox-button>
        <el-checkbox-button label="上海"></el-checkbox-button>
        <el-checkbox-button label="广州"></el-checkbox-button>
        <el-checkbox-button label="深圳"></el-checkbox-button>
      </el-checkbox-group>
      <el-checkbox-group v-model="checkbox" size="small">
        <el-checkbox-button label="北京"></el-checkbox-button>
        <el-checkbox-button label="上海"></el-checkbox-button>
        <el-checkbox-button label="广州"></el-checkbox-button>
        <el-checkbox-button label="深圳"></el-checkbox-button>
      </el-checkbox-group>
      <el-checkbox-group v-model="checkbox" size="mini">
        <el-checkbox-button label="北京"></el-checkbox-button>
        <el-checkbox-button label="上海"></el-checkbox-button>
        <el-checkbox-button label="广州"></el-checkbox-button>
        <el-checkbox-button label="深圳"></el-checkbox-button>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Button13",
    data() {
      return {
        checkbox: []
      }
    }
  }
</script>

<style scoped>

</style>
