<template>
  <div class="hdty-fill">
    <table1 v-if="dirActiveIndex === 0">
    </table1>
    <table2 v-else-if="dirActiveIndex === 1">
    </table2>
    <table3 v-else-if="dirActiveIndex === 2">
    </table3>
    <table4 v-else-if="dirActiveIndex === 3">
    </table4>
    <div class="hdty-dir is-inside-right">
      <div class="hdty-dir-title">
        目录
      </div>
      <ul class="hdty-dir-content">
        <li
          v-for="(item, index) in dirData"
          :key="index"
          class="hdty-dir-item"
          :class="{ 'is-active': dirActiveIndex === index }">
          <a href="javascript:;" @click="dirActiveIndex = index">
            {{ item.label }}
          </a>
        </li>
        <div
          class="hdty-dir-item hdty-center">
          <a href="javascript:;" @click="dirActiveIndex = 0">
            返回默认
            <i class="icon-caret-top">
            </i>
          </a>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
  import Table1 from './Table1';
  import Table2 from './Table2';
  import Table3 from './Table3';
  import Table4 from './Table4';
  export default {
    name: "ExampleBuildTable",
    components: {
      Table1,
      Table2,
      Table3,
      Table4
    },
    data() {
      return {
        dirActiveIndex: 0,
        dirData: [
          {
            label: '前端构造渲染表格列和数据'
          },
          {
            label: '请求接口渲染数据'
          },
          {
            label: '请求接口渲染表格列和数据'
          },
          {
            label: '带查询表单和分页选择'
          }
        ]
      }
    }
  }
</script>

<style scoped>
  .hdty-dir.is-inside-right {
    margin-right: 32px;
  }
</style>
