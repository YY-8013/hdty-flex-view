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
            <hd-query-fixed>
              <el-form-item label="输 入 框" prop="input">
                <hd-factor-input prop="inputFilterFactor" v-model="queryData.input" :model-control.sync="extendData.inputFilterFactor" placeholder="请输入查询条件"></hd-factor-input>
              </el-form-item>
              <el-form-item prop="andor" slot="after">
                <hd-factor-logic v-model="queryData.andor"></hd-factor-logic>
              </el-form-item>
              <el-form-item prop="organ1" slot="after">
                <hd-organ v-model="queryData.organ1" placeholder="高级过滤：请选择管辖机构"></hd-organ>
              </el-form-item>
            </hd-query-fixed>
            <hd-query-expand>
              <el-row>
                <el-form-item label="单 选 框" prop="radio">
                  <hd-dict-radio v-model="queryData.radio" :dict-code="$global.dictType.gender" show-all-button></hd-dict-radio>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="复 选 框" prop="checkbox">
                  <hd-dict-checkbox v-model="queryData.checkbox" :dict-code="$global.dictType.gender" show-all-button></hd-dict-checkbox>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="计 数 器" prop="number">
                  <hd-input-number v-model="queryData.number" controls-position="right" :min="1" :max="100"></hd-input-number>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="机  构" prop="organ2">
                  <hd-organ v-model="queryData.organ2" multiple placeholder="请选择查询条件"></hd-organ>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="地  区" prop="region">
                  <hd-region v-model="queryData.region" multiple placeholder="请选择查询条件"></hd-region>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="下拉选择" prop="select">
                  <hd-dict-select v-model="queryData.select" :dict-code="$global.dictType.msgCategory" multiple placeholder="请选择查询条件" filterable></hd-dict-select>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="级联选择" prop="cascade">
                  <hd-dict-cascader v-model="queryData.cascade" :dict-code="$global.dictType.msgTopic" multiple placeholder="请选择查询条件" filterable></hd-dict-cascader>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="表格选择" prop="table">
                  <hd-table-select
                    :data="[{
                      id: '00001',
                      name: '模拟数据00001'
                    }]"
                    :api="tableSelectOptions.api"
                    :props="tableSelectOptions.props"
                    :columns="tableSelectOptions.columns"
                    :searches="tableSelectOptions.searches"
                    v-model="queryData.table"
                    multiple
                    placeholder="请选择查询条件">
                  </hd-table-select>
                  <!-- 另一种方式-单独业务单独编写表格选择组件
                  <biz-table-select-example
                    v-model="queryData.table"
                    multiple
                    placeholder="请选择查询条件">
                  </biz-table-select-example>-->
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="数量范围" prop="numberrange">
                  <hd-number-range v-model="queryData.numberrange"></hd-number-range>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="时间范围" prop="datetimerange1">
                  <hd-date-picker type="datetimerange" v-model="queryData.datetimerange1"></hd-date-picker>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="时间范围" prop="datetimerange2">
                  <hd-date-picker type="datetimerange" v-model="queryData.datetimerange2"></hd-date-picker>
                </el-form-item>
              </el-row>
            </hd-query-expand>
          </hd-query>
      </hd-component>
      </el-form>
      <!-- 新写法-->
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
        <hd-button
          name="export"
          type="warning"
          icon="el-icon-upload2"
          :loading="exporting"
          @click="handleExport">
          导出
        </hd-button>
      </hd-button-container>
      <!-- 旧写法-同时兼容
      <hd-btn-authority>
        <template slot-scope="props">
          <el-button
            name="query"
            type="info"
            icon="el-icon-search"
            :disabled="props.disabled.query"
            @click="handleQuery">查询</el-button>
          <el-button
            icon="el-icon-delete"
            @click="handleClear">清空</el-button>
          <el-button
            name="add"
            type="success"
            icon="el-icon-circle-plus-outline"
            :disabled="props.disabled.add"
            @click="handleAdd">新增</el-button>
          <el-button
            name="export"
            type="warning"
            icon="el-icon-upload2"
            :loading="exporting"
            :disabled="props.disabled.export"
            @click="handleExport">导出</el-button>
        </template>
      </hd-btn-authority>-->
    </div>
    <div class="hdty-fit">
      <el-table
        v-loading="loading"
        ref="tableRef"
        :data="tableData"
        row-key="vo.id"
        :empty-text="emptyText"
        border
        fit
        height="100%"
        @sort-change="handleSortChange">
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
            <!-- 旧写法-同时兼容
            <hd-btn-authority>
              <template slot-scope="props">
                <el-button
                  name="detail"
                  type="success"
                  :disabled="props.disabled.detail"
                  @click="handleDetail(scope.$index, scope.row)">详情</el-button>
                <el-button
                  name="edit"
                  type="primary"
                  :disabled="props.disabled.edit"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  name="delete"
                  type="danger"
                  :disabled="props.disabled.delete"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </hd-btn-authority>-->
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.item1"
          label="列表项1"
          sortable="custom"
          header-align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="vo.item2"
          label="列表项2"
          sortable="custom"
          header-align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="vo.item3"
          label="列表项3"
          sortable="custom"
          header-align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="vo.item4"
          label="列表项4"
          sortable="custom"
          header-align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="vo.item5"
          label="列表项5"
          sortable="custom"
          header-align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="vo.item6"
          label="列表项6"
          sortable="custom"
          header-align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="vo.item7"
          label="时间"
          sortable="custom"
          header-align="center"
          min-width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span v-html="formatDatetime(scope.row.vo.item7)"></span>
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
    <example-add ref="addRef"></example-add>
    <example-detail ref="detailRef"></example-detail>
    <example-edit ref="editRef"></example-edit>
  </div>
</template>

<script>
  import { hdList } from '@/utils/util-framework';
  import { page, exports, singleDelete } from './api';
  import ExampleAdd from './ExampleAdd';
  import ExampleDetail from './ExampleDetail';
  import ExampleEdit from './ExampleEdit';
  export default {
    name: "ExampleList",
    moduleName: "ExampleList",
    provide() {
      return {
        hdList: this
      };
    },
    mixins: [hdList],
    components: {
      ExampleAdd,
      ExampleDetail,
      ExampleEdit
    },
    data() {
      return {
        // 表格选择器配置项
        tableSelectOptions: {
          api: page,
          props: {
            value: 'id',
            label: 'name',
            response: 'records'
          },
          columns: [
            {
              field: 'id',
              label: '编码',
              fixed: true,
              sortable: 'custom',
              width: '200'
            },
            {
              field: 'name',
              label: '名称',
              sortable: 'custom',
              width: '200'
            },
            {
              field: 'memo',
              label: '描述',
              sortable: 'custom',
              minWidth: '200'
            }
          ],
          searches: [
            [
              {
                field: 'name',
                label: '名  称',
                type: 'factorInput',
                placeholder: '请输入名称'
              }
            ]
          ]
        },
        // 查询
        queryData: {
          input: '',
          radio: '',
          checkbox: [],
          number: 1,
          organ1: '',
          organ2: [],
          region: [],
          select: [],
          cascade: [],
          table: [],
          numberrange: [],
          datetimerange1: [],
          datetimerange2: [this.$utilDate.dateFtt(new Date(), 'yyyyMMdd000000'), this.$utilDate.dateFtt(new Date(), 'yyyyMMdd235959')],
          andor: this.$app.factorOptions.logicOpe.and
        },
        // 查询扩展
        extendData: {
          inputFilterFactor: ''
        },
        // 表格
        tableData: [
          {
            vo: {
              id: '1',
              item1: '示例',
              item2: '示例',
              item3: '示例',
              item4: '示例',
              item5: '示例',
              item6: '示例',
              item7: '00000000000000'
            }
          }
        ],
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
        if (this.AUTHORITY_QUERY) {
          this.loading = true;
          // 参数
          let dataParams = {
            ...this.extendData,
            ...this.queryData,
            ...this.pageOptions
          };
          // Lambda写法
          page(dataParams).then(response => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              this.pageOptions.total = data.total;
              this.tableData = data.records;
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            this.$refs.tableRef.doLayout();
            this.loading = false;
          });
        }
      },
      // 查询
      handleQuery() {
        this.$refs.queryRef.validate((valid) => {
          if (valid) {
            this.pageOptions.current = 1;
            this.loadList();
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
        if (this.validateExport()) {
          this.exporting = true;
          // 参数
          let dataParams = {
            ...this.extendData,
            ...this.queryData
          };
          exports(dataParams).then(response => {
            // 响应成功回调
            this.download(response);
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            this.exporting = false;
          });
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
        this.$confirm('确定要删除吗?', '提示', {
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
            let { success, msg } = response.data;
            if (success) {
              this.$message({
                showClose: true,
                customClass: 'is-fixed',
                message: msg,
                type: 'success'
              });
              // 删除成功刷新列表
              this.triggerDeletedReload();
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
