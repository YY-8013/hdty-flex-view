<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <hd-button-container>
        <el-button-group>
          <el-button @click="pageOptions = !pageOptions?$app.paginationOptions:null">{{ !pageOptions?'开启':'关闭' }}分页</el-button>
          <el-button @click="showSelection = !showSelection">{{ !showSelection?'开启':'关闭' }}多选框</el-button>
          <el-button @click="showIndex = !showIndex">{{ !showIndex?'开启':'关闭' }}索引</el-button>
          <el-button @click="showOperation = !showOperation">{{ !showOperation?'开启':'关闭' }}操作栏</el-button>
          <el-button @click="showExpand = !showExpand">{{ !showExpand?'开启':'关闭' }}展开行</el-button>
          <el-button @click="showHeader = !showHeader">{{ !showHeader?'开启':'关闭' }}表头</el-button>
          <el-button @click="showSummary = !showSummary">{{ !showSummary?'开启':'关闭' }}合计行</el-button>
        </el-button-group>
      </hd-button-container>
    </div>
    <div class="hdty-fit">
      <hd-build-table
        ref="tableRef"
        :api="buildTableOptions.api"
        :params="buildTableOptions.params"
        :page-options="pageOptions"
        :props="buildTableOptions.props"
        :default-operation-width="112"
        :show-selection="showSelection"
        :show-index="showIndex"
        :show-operation="showOperation"
        :show-expand="showExpand"
        :show-header="showHeader"
        :show-summary="showSummary"
        height="100%"
        :summary-method="handleSummaryMethod"
        @sort-change="handleSortChange">
        <slot slot="operation" slot-scope="scope">
          <hd-button-container>
            <hd-button
              type="success"
              @click="handleClick(scope.$index, scope.row)">
              自定义按钮
            </hd-button>
          </hd-button-container>
        </slot>
        <slot slot="expand" slot-scope="scope">
          <div>{{ scope.row }}</div>
        </slot>
      </hd-build-table>
    </div>
    <div v-if="pageOptions" class="hdty-footer">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pageOptions.current"
        :page-sizes="pageOptions.sizes"
        :page-size="pageOptions.size"
        :total="pageOptions.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { hdList } from '@/utils/util-framework';
  import { page } from './api';
  export default {
    name: "Table3",
    provide() {
      return {
        hdList: this
      };
    },
    mixins: [hdList],
    data() {
      return {
        // 是否开启多选框，默认false
        showSelection: false,
        // 是否开启索引，默认true
        showIndex: true,
        // 是否开启操作栏，默认false
        showOperation: false,
        // 是否开启展开行，默认false
        showExpand: false,
        // 是否开启表头，默认true
        showHeader: true,
        // 是否开启合计行，默认false
        showSummary: false,
        // 渲染表格的配置选项
        buildTableOptions: {
          // 渲染表格数据对象的请求接口
          api: page,
          // 渲染表格数据对象的请求参数
          params: null,
          /* 渲染表格数据对象的配置选项
            rowKey: '',  // 指定表格每行的唯一标识对应表格数据对象中的属性值
            rowIndex: '',  // 指定表格每行的索引对应表格数据对象中的属性值
            response: 'records',  // 指定表格的数据对象对应响应数据对象中的属性值，默认records
            total: 'total',  // 指定表格的总条目数对应响应数据对象中的属性值，默认total
            render: '',  // 指定表格列的渲染配置对象对应响应数据对象中的属性值
            currentKey: '',  // 指定表格高亮显示的行的唯一标识对应响应数据对象中的属性值
            expandKeys: '',  // 指定表格展开的行的唯一标识集合对应响应数据对象中的属性值
            colKey: 'key',  // 指定表格每列的唯一标识对应表格列的渲染配置对象中的属性值，默认key
            colChildren: 'children',  // 指定表格表头子列对应表格列的渲染配置对象中的属性值，默认children
            authority: 'query',  // 指定表格权限验证的权限标识对应权限数据对象中的属性值，默认query
            module: ''  // 指定表格权限验证的模块标识对应权限数据对象中的属性值
          */
          props: {
            rowKey: 'vo.id',
            response: 'records',
            total: 'total',
            render: 'columns',
            colKey: 'key',
            colChildren: 'children'
          }
        },
        // 分页选项
        pageOptions: null
      }
    },
    methods: {
      // 自定义按钮点击
      handleClick(index, row) {
        console.log('自定义按钮点击', index, row)
      }
    }
  }
</script>

<style scoped>

</style>
