<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form
        ref="queryRef"
        :model="queryData"
        :rules="rules"
        inline
        @submit.native.prevent
        @keyup.enter.native="handleQuery">
        <hd-component
          :model="extendData"
          ref="componentRef">
          <hd-query>
            <el-form-item label="查询条件" prop="input">
              <hd-factor-input prop="inputFilterFactor" v-model="queryData.input" :model-control.sync="extendData.inputFilterFactor" placeholder="请输入查询条件"></hd-factor-input>
            </el-form-item>
          </hd-query>
        </hd-component>
      </el-form>
      <hd-button-container>
        <hd-button
          name="query"
          type="info"
          icon="el-icon-search"
          @click="handleQuery">
          查询
        </hd-button>
        <hd-button
          icon="el-icon-delete"
          @click="handleClear">
          清空
        </hd-button>
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
        show-selection
        show-index
        show-operation
        show-expand
        show-summary
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
    <div class="hdty-footer">
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
    name: "Table1",
    provide() {
      return {
        hdList: this
      };
    },
    mixins: [hdList],
    data() {
      return {
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
        // 查询
        queryData: {
          input: '',
        },
        // 查询扩展
        extendData: {
          inputFilterFactor: ''
        },
        // 验证
        rules: {}
      }
    },
    methods: {
      // 查询
      handleQuery() {
        this.$refs.queryRef.validate((valid) => {
          if (valid) {
            this.pageOptions.current = 1;
            this.buildTableOptions.params = {
              ...this.extendData,
              ...this.queryData
            };
          }
        });
      },
      // 清空
      handleClear() {
        this.$refs.queryRef.resetFields();
        this.$refs.componentRef.resetFields();
      },
      // 自定义按钮点击
      handleClick(index, row) {
        console.log('自定义按钮点击', index, row)
      }
    }
  }
</script>

<style scoped>

</style>
