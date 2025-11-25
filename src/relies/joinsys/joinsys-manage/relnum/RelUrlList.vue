<template>
  <el-dialog
    :title="'【' + row.vo.systemName + '】配置数列表'"
    :visible.sync="visible"
    custom-class="hdty-dialog-large"
    append-to-body>
    <hd-pane>
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
              :model="factorData"
              ref="componentRef">
              <hd-expand>
                <hd-expand-header>
                  <el-form-item label="所属机构" prop="orgId">
                    <hd-organ v-model="queryData.orgId" placeholder="请选择所属机构"></hd-organ>
                  </el-form-item>
                  <el-form-item label="客 户 端" prop="clientType">
                    <hd-dict-radio
                      v-model="queryData.clientType"
                      :dict-code="$global.dictType.clientType"
                      show-all-button>
                    </hd-dict-radio>
                  </el-form-item>
                  <el-form-item prop="andor" slot="after">
                    <hd-factor-logic v-model="queryData.andor"></hd-factor-logic>
                  </el-form-item>
                </hd-expand-header>
                <hd-expand-body>
                  <el-row>
                    <el-form-item label="前端地址" prop="systemWebAddress">
                      <hd-factor-input
                        prop="systemWebAddressFilterFactor"
                        fuzzy="between"
                        v-model="queryData.systemWebAddress"
                        :model-control.sync="factorData.systemWebAddressFilterFactor"
                        placeholder="请输入前端地址">
                      </hd-factor-input>
                    </el-form-item>
                    <el-form-item label="服务端地址" prop="systemApiAddress">
                      <hd-factor-input
                        prop="systemApiAddressFilterFactor"
                        fuzzy="between"
                        v-model="queryData.systemApiAddress"
                        :model-control.sync="factorData.systemApiAddressFilterFactor"
                        placeholder="请输入服务端地址">
                      </hd-factor-input>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item label="是否启用" prop="enable">
                      <hd-dict-radio
                        v-model="queryData.enable"
                        :dict-code="$global.dictType.isOrNot"
                        show-all-button>
                      </hd-dict-radio>
                    </el-form-item>
                    <el-form-item label="添加时间" prop="createTime">
                      <el-date-picker
                        v-model="queryData.createTime"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="请输入开始时间"
                        end-placeholder="请输入结束时间"
                        value-format="yyyyMMddHHmmss"
                        align="right">
                      </el-date-picker>
                    </el-form-item>
                  </el-row>
                </hd-expand-body>
              </hd-expand>
            </hd-component>
          </el-form>
          <hd-btn-authority>
            <template slot-scope="props">
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
              <!--<hd-button-->
              <!--name="export"-->
              <!--type="warning"-->
              <!--icon="el-icon-upload2"-->
              <!--:loading="exportLoading"-->
              <!--@click="handleExport">-->
              <!--导出-->
              <!--</hd-button>-->
            </template>
          </hd-btn-authority>
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
              width="220">
              <template slot-scope="scope">
                <hd-btn-authority>
                  <template slot-scope="props">
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
                  </template>
                </hd-btn-authority>
              </template>
            </el-table-column>
            <el-table-column
              prop="vox.orgId"
              label="所属机构"
              sortable="custom"
              header-align="center"
              width="240">
            </el-table-column>
            <el-table-column
              prop="vo.systemWebAddress"
              label="前端地址"
              sortable="custom"
              header-align="center"
              width="220">
            </el-table-column>
            <el-table-column
              prop="vo.systemApiAddress"
              label="服务端地址"
              sortable="custom"
              header-align="center"
              width="220">
            </el-table-column>
            <el-table-column
              prop="vox.clientType"
              label="客户端类型"
              sortable="custom"
              header-align="center"
              width="120">
            </el-table-column>
            <el-table-column
              prop="vox.enable"
              label="是否启用"
              sortable="custom"
              header-align="center"
              width="120">
              <template slot-scope="scope">
                <el-tag :type="scope.row.vo.enable === $global.dictItem.isOrNot.is ? 'success' : 'danger'">
                  {{ scope.row.vox.enable }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="vo.createUsername"
              label="添加人"
              sortable="custom"
              header-align="center"
              width="140">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="添加时间"
              sortable="custom"
              header-align="center"
              min-width="180">
              <template slot-scope="scope">
                <span v-html="formatTime(scope.row, scope.column, scope.row.vo.createTime)"></span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="hdty-footer">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageOptions.current"
            :page-sizes="pageOptions.sizes"
            :page-size="pageOptions.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageOptions.total">
          </el-pagination>
        </div>
      </div>
      <rel-url-add ref="addRef"></rel-url-add>
      <rel-url-edit ref="editRef"></rel-url-edit>
      <rel-url-detail ref="detailRef"></rel-url-detail>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {hdList} from "@/utils/util-framework";
import {page, exports, singleDelete} from './api';
import RelUrlAdd from './RelUrlAdd';
import RelUrlEdit from './RelUrlEdit';
import RelUrlDetail from './RelUrlDetail';

export default {
  name: "RelUrlList",
  provide() {
    return {
      hdList: this
    };
  },
  inject: ['hdList'],
  mixins: [hdList],
  components: {
    RelUrlAdd,
    RelUrlEdit,
    RelUrlDetail,
  },
  data() {
    return {
      // 查询
      queryData: {
        subSystemId: '',
        orgId: '',
        clientType: '',
        systemWebAddress: '',
        systemApiAddress: '',
        enable: '',
        createTime: [],
        andor: this.$app.factorOptions.logicOpe.and
      },
      factorData: {
        systemWebAddressFilterFactor: this.$app.factorOptions.matchOpe.between,
      },
      // 表格
      tableData: [],
      // 验证
      rules: {},
      // 行
      row: {
        vo: {},
        vox: {},
      },
      // 显示
      visible: false
    }
  },
  methods: {
    // 获取数据表格
    loadList() {
      let _this = this;
      _this.loading = true;
      if (_this.queryData.subSystemId && _this.queryData.subSystemId !== _this.row.vo.id) {
        _this.pageOptions.current = 1;
        _this.$nextTick(() => {
          _this.handleClear();
        });
      }
      _this.queryData.subSystemId = _this.row.vo.id;
      // 参数
      let dataParams = {
        ..._this.queryData,
        ..._this.factorData,
        ..._this.pageOptions,
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
      this.$refs.addRef.row = this.row;
      this.$refs.addRef.beforeLoadForm();
    },
    // 导出
    handleExport() {
      let _this = this;
      _this.exportLoading = true;
      // 参数
      let dataParams = {
        ..._this.queryData,
        ..._this.factorData,
      };
      // Lambda写法
      exports(dataParams).then(response => {
        // 响应成功回调
        _this.download(response);
      }).catch(error => {
        // 响应错误回调
        console.error(error);
      }).finally(() => {
        _this.exportLoading = false;
      });
    },
    // 详情
    handleDetail(index, row) {
      row.vo.systemName = this.row.vo.systemName;
      this.$refs.detailRef.visible = true;
      this.$refs.detailRef.row = row;
      this.$refs.detailRef.beforeLoadForm();
    },
    // 编辑
    handleEdit(index, row) {
      row.vo.systemName = this.row.vo.systemName;
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
        type: 'warning',
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
            _this.hdList.handleQuery();
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        });
      });
    },
    // 取消
    cancelForm() {
      this.handleClear();
      this.visible = false;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
