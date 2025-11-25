<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form
        :model="queryData"
        :rules="rules"
        ref="queryRef"
        inline
        @keyup.enter.native="handleQuery">
        <hd-component
          :model="extendData"
          ref="componentRef">
          <hd-query>
            <el-form-item label="配 置 项" prop="key">
              <hd-factor-input
                prop="keyFilterFactor"
                v-model="queryData.key"
                :model-control.sync="extendData.keyFilterFactor"
                placeholder="配置项编码或名称">
              </hd-factor-input>
            </el-form-item>
            <el-form-item label="配置项子项" prop="keyItem">
              <hd-factor-input
                prop="keyItemFilterFactor"
                v-model="queryData.keyItem"
                :model-control.sync="extendData.keyItemFilterFactor"
                placeholder="配置项子项编码或名称">
              </hd-factor-input>
            </el-form-item>
          </hd-query>
        </hd-component>
      </el-form>
      <hd-button-container>
        <hd-button
          name="query"
          type="info"
          icon="el-icon-search"
          @click="handleQuery">查询
        </hd-button>
        <hd-button
          icon="el-icon-delete"
          @click="handleClear">清空
        </hd-button>
        <hd-button
          name="add"
          type="success"
          icon="el-icon-circle-plus-outline"
          @click="handleAdd">新增
        </hd-button>
      </hd-button-container>
    </div>
    <div class="hdty-fit">
      <el-table
        :data="tableData"
        :empty-text="emptyText"
        row-key="vo.id"
        ref="tableRef"
        v-loading="loading"
        @sort-change="handleSortChange"
        border
        fit
        height="100%">
        <el-table-column
          fixed
          type="selection"
          reserve-selection
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          fixed
          type="index"
          :index="setIndex"
          label="序号"
          class-name="is-index"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          fixed
          label="操作"
          align="center"
          width="210">
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="detail"
                type="success"
                @click="handleDetail(scope.$index, scope.row)">
                详情
              </hd-button>
              <hd-button
                name="edit"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">
                编辑
              </hd-button>
              <hd-button
                name="delete"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">
                删除
              </hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.key"
          label="配置项"
          sortable="custom"
          header-align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="vo.keyName"
          label="配置项名称"
          sortable="custom"
          header-align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop="vo.keyItem"
          label="配置项子项"
          sortable="custom"
          header-align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="vo.keyItemName"
          label="子项名称"
          sortable="custom"
          header-align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop="vo.value"
          label="配置值"
          sortable="custom"
          header-align="center"
          width="300">
          <template slot-scope="scope">
            <div class="hdty-elip"
                 :title="scope.row.vo.value">
              {{scope.row.vo.value}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.memo"
          label="备注"
          sortable="custom"
          header-align="center"
          width="200">
          <template slot-scope="scope">
            <div class="hdty-elip"
                 :title="scope.row.vo.memo">
              {{scope.row.vo.memo}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.updateTime"
          label="更新时间"
          sortable="custom"
          header-align="center"
          min-width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span v-html="formatDatetime(scope.row.vo.updateTime)"></span>
          </template>
        </el-table-column>
      </el-table>
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
    <custom-add ref="addRef"></custom-add>
    <custom-detail ref="detailRef"></custom-detail>
    <custom-edit ref="editRef"></custom-edit>
  </div>
</template>

<script>
  import {hdList} from '@/utils/util-framework';
  import {page, singleDelete} from '@/api/custom';
  import CustomAdd from './CustomAdd';
  import CustomDetail from './CustomDetail';
  import CustomEdit from './CustomEdit';

  export default {
    name: "CustomList",
    provide() {
      return {
        hdList: this
      };
    },
    mixins: [hdList],
    components: {
      CustomAdd,
      CustomDetail,
      CustomEdit
    },
    data() {
      return {
        // 查询
        queryData: {
          keyItem: '',
          key: '',
          andor: this.$app.factorOptions.logicOpe.or
        },
        // 查询条件
        extendData: {
          keyFilterFactor: '',
          keyItemFilterFactor: ''
        },
        // 表格
        tableData: [],
        // 验证
        rules: {}
      }
    },
    mounted() {
      // 加载数据表格
      this.loadList();
    },
    methods: {
      // 加载数据表格
      loadList() {
        let _this = this;
        if (_this.AUTHORITY_QUERY) {
          _this.loading = true;
          // 参数
          let dataParams = {
            ..._this.extendData,
            ..._this.queryData,
            ..._this.pageOptions
          };
          // Lambda写法
          page(dataParams).then(response => {
            // 响应成功回调
            let {success, data} = response.data;
            if (success) {
              _this.pageOptions.total = data.total;
              _this.tableData = data.records;
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            _this.$refs.tableRef.doLayout();
            _this.loading = false;
          });
        }
      },
      // 查询
      handleQuery() {
        let _this = this;
        _this.$refs.queryRef.validate((valid) => {
          if (valid) {
            _this.pageOptions.current = 1;
            _this.loadList();
          }
        });
      },
      // 清空
      handleClear() {
        this.$refs.queryRef.resetFields();
        this.$refs.componentRef.resetFields();
      },
      // 新增
      handleAdd() {
        this.$refs.addRef.visible = true;
        this.$refs.addRef.beforeLoadForm();
      },
      // 详情
      handleDetail(index, row) {
        this.$refs.detailRef.visible = true;
        this.$refs.detailRef.row = row;
        this.$refs.detailRef.beforeLoadForm();
      },
      // 编辑
      handleEdit(index, row) {
        this.$refs.editRef.visible = true;
        this.$refs.editRef.row = row;
        this.$refs.editRef.beforeLoadForm();
      },
      // 删除
      handleDelete(index, row) {
        let _this = this;
        _this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 参数
          let dataParams = {
            id: row.vo.id
          };
          // Lambda写法
          singleDelete(dataParams).then(response => {
            // 响应成功回调
            let {success, msg} = response.data;
            if (success) {
              _this.$message({
                showClose: true,
                customClass: 'is-fixed',
                message: msg,
                type: 'success'
              });
              // 删除成功刷新列表
              _this.triggerDeletedReload();
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          });
        }).catch(() => {});
      }
    }
  }
</script>

<style scoped>

</style>
