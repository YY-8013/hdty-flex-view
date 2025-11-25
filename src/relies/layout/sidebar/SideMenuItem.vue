<template>
  <div class="hdty-menu-material">
    <div v-for="item in navigations" :key="item.id" class="hdty-menu-block">
      <el-submenu
        v-if="item.children"
        :index="String(item.code)"
        popper-class="hdty-scroll">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </template>
        <side-menu-item :navigations="item.children" class="hdty-menu-nest"></side-menu-item>
      </el-submenu>
      <el-menu-item
        v-else
        :index="String(item.code)">
        <i :class="item.icon"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SideMenuItem",
    props: {
      navigations: [Array, Object]
    }
  }
</script>

<style scoped>

</style>
