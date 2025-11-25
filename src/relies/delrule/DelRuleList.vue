<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form
        :model="queryData"
        :rules="rules"
        ref="queryRef"
        inline
        @submit.native.prevent
        @keyup.enter.native="handleQuery">
        <hd-component
          :model="extendData"
          ref="componentRef">
          <hd-query>
            <hd-query-fixed>
              <el-form-item
                label="删除类型"
                prop="typeString">
                <hd-dict-select
                  v-model="queryData.typeString"
                  :dict-code="$global.dictType.delType"
                  placeholder="请输入删除类型">
                </hd-dict-select>
              </el-form-item>
              <el-form-item label="数据源名称" prop="dataSource">
                <hd-build-select
                  :api="dataSourceSelectOptions.api"
                  v-model="queryData.dataSource"
                  placeholder="请输入数据源名称">
                </hd-build-select>
              </el-form-item>
            </hd-query-fixed>
            <hd-query-expand>
              <el-row>
                <el-form-item label="创建时间" prop="createTime">
                  <hd-date-picker type="datetimerange" v-model="queryData.createTime"></hd-date-picker>
                </el-form-item>
              </el-row>
            </hd-query-expand>
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
        <hd-button
          name="add"
          type="success"
          icon="el-icon-circle-plus-outline"
          @click="handleAdd">
          新增
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
          width="275">
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
              <hd-button
                name="run"
                type="primary"
                @click="handleExecute(scope.$index, scope.row)">
                执行
              </hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.remarks"
          label="操作记录"
          header-align="center"
          align="center"
          width="80">
          <template slot-scope="scope">
            <a href="javascript:;" class="hdty-success-color" @click="handleItem(scope.row)">{{ scope.row.vo.record }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.remarks"
          label="数据备注"
          sortable="custom"
          header-align="center"
          min-width="280">
        </el-table-column>
        <el-table-column
          prop="vo.dataSource"
          label="数据源名称"
          sortable="custom"
          header-align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="vox.createUserId"
          label="创建人"
          sortable="custom"
          header-align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="vo.createTime"
          sortable="custom"
          label="创建时间"
          header-align="center"
          min-width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span v-html="formatDatetime(scope.row.vo.createTime)"></span>
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
    <del-rule-add ref="addRef"></del-rule-add>
    <del-rule-detail ref="detailRef"></del-rule-detail>
    <del-rule-edit ref="editRef"></del-rule-edit>
    <del-rule-record ref="recordRef"></del-rule-record>
  </div>
</template>

<script>
  import { hdList } from '@/utils/util-framework';
  import { page, singleDelete, execute, getDatasourceList, getTableNameList } from '@/api/delrule';
  import DelRuleAdd from './DelRuleAdd';
  import DelRuleDetail from './DelRuleDetail';
  import DelRuleEdit from './DelRuleEdit';
  import DelRuleRecord from './DelRuleRecord';
  export default {
    name: 'DelRuleList',
    provide() {
      return {
        hdList: this
      };
    },
    mixins: [hdList],
    components: {
      DelRuleAdd,
      DelRuleDetail,
      DelRuleEdit,
      DelRuleRecord
    },
    data() {
      return {
        // 数据源下拉选择器配置项
        dataSourceSelectOptions: {
          api: getDatasourceList
        },
        // 数据表选择器配置项
        databaseSelectOptions: {
          api: getTableNameList,
          props: {
            value: 'id',
            label: 'value',
            response: 'records'
          },
          columns: [
            {
              field: 'value',
              label: '表名',
              sortable: 'custom',
              minWidth: '250'
            },
            {
              field: 'key',
              label: '表注释',
              sortable: 'custom',
              minWidth: '400'
            }
          ],
          searches: [
            [
              {
                field: 'ds',
                pattern: 'fixed'
              }
            ]
          ]
        },
        // 查询
        queryData: {
          typeString: '',
          wildcard: '',
          condition: '',
          reductionTime: '',
          dataSource: '',
          dataRange: '',
          remarks: '',
          createUserId: '',
          createTime: [],
          andor: this.$app.factorOptions.logicOpe.and
        },
        // 查询条件
        extendData: {
          inputFilterFactor: ''
        },
        // 表格
        tableData: [],
        // 验证
        rules: {}
      };
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
            //响应成功回调
            let {success, data} = response.data;
            if (success) {
              _this.pageOptions.total = data.total;
              _this.tableData = data.records;
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            _this.loading = false;
          });
        }
      },
      // 查询
      handleQuery() {
        let _this = this;
        _this.$refs.queryRef.validate(valid => {
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
      // 导出
      handleExport() {
        let _this = this;
        if (_this.validateExport()) {
          _this.exporting = true;
          // 参数
          let dataParams = {
            ..._this.extendData,
            ..._this.queryData
          };
          exports(dataParams).then(response => {
            // 响应成功回调
            _this.download(response);
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            _this.exporting = false;
          });
        }
      },
      //跳转到记录中
      handleItem(row) {
        if (row.vo.record > 0) {
          this.$refs.recordRef.visible = true;
          this.$refs.recordRef.row = row;
          this.$refs.recordRef.loadList();
        }
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
        _this
          .$confirm('确定要删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            // 参数
            let dataParams = {
              id: row.vo.id
            };
            // Lambda写法
            singleDelete(dataParams)
              .then(response => {
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
              })
              .catch(error => {
                // 响应错误回调
                console.error(error);
              });
          });
      },
      // 执行规则
      handleExecute(index, row) {
        let _this = this;
        _this
          .$confirm('确定要执行删除操作吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            // 参数
            let dataParams = {
              id: row.vo.id
            };
            // Lambda写法
            execute(dataParams)
              .then(response => {
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
              })
              .catch(error => {
                // 响应错误回调
                console.error(error);
              });
          });
      }
    }
  };
</script>
