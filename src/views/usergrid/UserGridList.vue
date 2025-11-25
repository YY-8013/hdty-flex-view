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
          :model="factorData"
          ref="componentRef">
          <hd-expand>
            <hd-expand-header>
              <el-form-item label="身份证号" prop="gmsfhm">
                <hd-factor-input
                  prop="gmsfhmFilterFactor"
                  fuzzy="between"
                  v-model="queryData.gmsfhm"
                  :model-control.sync="factorData.gmsfhmFilterFactor"
                  placeholder="请输入身份证号">
                </hd-factor-input>
              </el-form-item>
              <el-form-item label="启用状态" prop="enable">
                <hd-dict-radio
                  v-model="queryData.enable"
                  :dict-code="$global.dictType.userEnable"
                  show-all-button>
                </hd-dict-radio>
              </el-form-item>
              <el-form-item prop="andor" slot="after">
                <hd-factor-logic
                  v-model="queryData.andor">
                </hd-factor-logic>
              </el-form-item>
              <el-form-item prop="orgId" slot="after">
                <hd-organ
                  v-model="queryData.orgId"
                  placeholder="高级过滤：请选择管辖机构">
                </hd-organ>
              </el-form-item>
            </hd-expand-header>
            <hd-expand-body>
              <el-row>
                <el-form-item label="真实姓名" prop="xm">
                  <hd-factor-input
                    prop="xmFilterFactor"
                    fuzzy="between"
                    v-model="queryData.xm"
                    :model-control.sync="factorData.xmFilterFactor"
                    placeholder="请输入真实姓名">
                  </hd-factor-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="telephone">
                  <hd-factor-input
                    prop="telephoneFilterFactor"
                    fuzzy="between"
                    v-model="queryData.telephone"
                    :model-control.sync="factorData.telephoneFilterFactor"
                    placeholder="请输入联系电话">
                  </hd-factor-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="注册时间" prop="createTime">
                  <hd-date-picker
                    v-model="queryData.createTime"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="请输入开始时间"
                    end-placeholder="请输入结束时间"
                    value-format="yyyyMMddHHmmss"
                    align="right">
                  </hd-date-picker>
                </el-form-item>
              </el-row>
            </hd-expand-body>
          </hd-expand>
        </hd-component>
      </el-form>
      <hd-button-container>
        <hd-button
          name="query"
          type="info"
          v-preventReClick
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
    </div>
    <div class="hdty-danger-color" style="font-size: 14px;font-weight: bold">提示：停用或删除网格员会导致【警辅通-智慧社区】无法使用，请谨慎操作！</div>
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
                :disabled="$utilPublic.getUserInfo().username === scope.row.vo.username"
                @click="handleDelete(scope.$index, scope.row)">
                删除
              </hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.xm"
          label="真实姓名"
          sortable="custom"
          header-align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="vo.gmsfhm"
          label="身份证号"
          sortable="custom"
          header-align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop="vo.telephone"
          label="联系电话"
          sortable="custom"
          header-align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="vox.orgId"
          label="管辖机构"
          sortable="custom"
          header-align="center"
          width="240">
        </el-table-column>
        <el-table-column
          prop="vo.expiredTime"
          label="有效期限"
          sortable="custom"
          header-align="center"
          width="150">
          <template slot-scope="scope">
            <span v-html="formatDate(scope.row, scope.column, scope.row.vo.expiredTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.createTime"
          label="注册时间"
          sortable="custom"
          header-align="center"
          min-width="180">
          <template slot-scope="scope">
            <span v-html="formatDatetime(scope.row.vo.createTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="重置密码"
          header-align="center"
          align="center"
          width="100">
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="reset"
                type="danger"
                @click="handleReset(scope.$index, scope.row)">
                重置
              </hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.enable"
          label="启用状态"
          header-align="center"
          width="100">
          <template slot-scope="scope">
            <div style="text-align: center;">
              <el-switch
                :width="50"
                active-value="1"
                inactive-value="0"
                @change="handleEnableChange(scope.row.vo.id, scope.row.vo.enable)"
                v-model="scope.row.vo.enable">
              </el-switch>
            </div>
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
    <user-grid-add ref="addRef"></user-grid-add>
    <user-grid-edit ref="editRef"></user-grid-edit>
    <user-grid-detail ref="detailRef"></user-grid-detail>
  </div>
</template>

<script>
  import {hdList} from "@/utils/util-framework";
  import {changeUserEnable, exports, page, resetPassword, singleDelete} from './api';
  import UserGridAdd from './UserGridAdd';
  import UserGridEdit from './UserGridEdit';
  import UserGridDetail from './UserGridDetail';

  export default {
    name: "UserGridList",
    provide() {
      return {
        hdList: this
      };
    },
    mixins: [hdList],
    components: {
      UserGridAdd,
      UserGridEdit,
      UserGridDetail,
    },
    data() {
      return {
        // 查询
        queryData: {
          username: '',
          enable: '',
          xm: '',
          gmsfhm: '',
          telephone: '',
          createTime: [],
          orgId: '',
          andor: this.$app.factorOptions.logicOpe.and
        },
        factorData: {
          usernameFilterFactor: this.$app.factorOptions.matchOpe.between,
          xmFilterFactor: this.$app.factorOptions.matchOpe.between,
          gmsfhmFilterFactor: this.$app.factorOptions.matchOpe.exact,
          telephoneFilterFactor: this.$app.factorOptions.matchOpe.between,
        },
        // 表格
        tableData: [],
        // 验证
        rules: {},
      }
    },
    mounted() {
      // 初始化数据表格
      this.loadList();
    },
    methods: {
      // 获取数据表格
      loadList() {
        let _this = this;
        if (_this.AUTHORITY_QUERY) {
          _this.loading = true;
          // 参数
          let dataParams = {
            ..._this.queryData,
            ..._this.factorData,
            ..._this.pageOptions
          };
          // Lambda写法
          page(dataParams).then(response => {
            // 响应成功回调
            let { success, data } = response.data;
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
      },
      // 导出
      handleExport() {
        let _this = this;
        // 导出前验证
        if (_this.exportValidator()) {
          _this.exporting = true;
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
            _this.exporting = false;
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
            let { success, msg } = response.data;
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
        });
      },
      // 密码重置
      handleReset(index, row) {
        let _this = this;
        this.$prompt('请输入重置密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,16}$/,
          inputErrorMessage: '请输入正确的密码[8~16位]，至少含有英文字母、数字或常用符号中的两种'
        }).then(({value}) => {
          _this.$confirm('确定要重置密码吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 参数
            let dataParams = {
              id: row.vo.id,
              password: _this.$crypto.md5(value),
            };
            // Lambda写法
            resetPassword(dataParams).then(response => {
              // 响应成功回调
              let {success, msg} = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
              }
            }).catch(error => {
              // 响应错误回调
              console.error(error);
            });
          });
        }).catch(() => {

        });
      },
      // 切换启用状态
      handleEnableChange(id, enable) {
        changeUserEnable({id: id, enable: enable});
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
