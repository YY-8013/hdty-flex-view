<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="60%"
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
                <el-form-item label="身份证号" prop="gmsfhm">
                  <hd-factor-input
                    prop="gmsfhmFilterFactor"
                    fuzzy="between"
                    v-model="queryData.gmsfhm"
                    :model-control.sync="factorData.gmsfhmFilterFactor"
                    placeholder="请输入身份证号">
                  </hd-factor-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="xm">
                  <hd-factor-input
                    prop="xmFilterFactor"
                    fuzzy="between"
                    v-model="queryData.xm"
                    :model-control.sync="factorData.xmFilterFactor"
                    placeholder="请输入真实姓名">
                  </hd-factor-input>
                </el-form-item>
              </hd-expand>
            </hd-component>
          </el-form>
          <!-- 新写法-->
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
              type="warning"
              icon="el-icon-document"
              :loading="exporting"
              @click="handleExport">
              导出
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
            height="100%"
            fit>
            <el-table-column
              fixed
              sortable="custom"
              type="index"
              label="序号"
              :index="setIndex"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              prop="vo.xm"
              label="真实姓名"
              header-align="center"
              width="120">
              <template slot-scope="scope">
            <span class="hdty-main-color" title="点击查看详情" style="cursor: pointer" @click="handleDetail(scope.$index, scope.row)">
              {{scope.row.vo.xm}}
            </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="vo.gmsfhm"
              label="身份证号"
              header-align="center"
              width="200">
              <template slot-scope="scope">
            <span class="hdty-main-color" title="点击查看详情" style="cursor: pointer" @click="handleDetail(scope.$index, scope.row)">
              {{scope.row.vo.gmsfhm}}
            </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="vo.telephone"
              label="联系电话"
              header-align="center"
              width="120">
            </el-table-column>
            <el-table-column
              prop="vox.orgId"
              label="管辖机构"
              header-align="center"
              show-overflow-tooltip
              min-width="240">
            </el-table-column>
            <el-table-column
              prop="vo.expiredTime"
              label="有效期限"
              header-align="center"
              width="120">
              <template slot-scope="scope">
                <span v-html="formatDate(scope.row, scope.column, scope.row.vo.expiredTime)"></span>
              </template>
            </el-table-column>
            <el-table-column
              prop="vo.enable"
              label="启用状态"
              header-align="center"
              width="90">
              <template slot-scope="scope">
                <div style="text-align: center;">
                  <el-switch
                    :width="50"
                    active-value="1"
                    inactive-value="0"
                    disabled
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
      </div>
    </hd-pane>
    <user-grid-detail ref="detailRef"></user-grid-detail>
  </el-dialog>
</template>

<script>
  import {hdList} from '@/utils/util-framework';
  import {exports, page} from "@/views/usergrid/api";
  import UserGridDetail from '@/views/usergrid/UserGridDetail';
  export default {
    name: "UserGridListDiag",
    data() {
      return{
        title: '网格员',
        visible: false,
        row:{
          vo:{
            agencyid: ''
          }
        },
        // 查询
        queryData: {
          xm: '',
          gmsfhm: '',
          orgId : '',
          zxbs: '0',
          enable: '1',
          andor: this.$app.factorOptions.logicOpe.and,
        },
        // 查询条件
        factorData: {
          xmFilterFactor: this.$app.factorOptions.matchOpe.between,
          gmsfhmFilterFactor: this.$app.factorOptions.matchOpe.exact,
        },
        // 验证
        rules: {},
        tableData: [],
      }
    },
    mixins: [hdList],
    provide() {
      return {
        hdList: this
      };
    },
    components: {
      UserGridDetail
    },
    methods: {
      // 加载表单之前
      beforeLoadForm() {
        this.$nextTick(() => {
          // 初始化分页值
          this.pageOptions = {
            current: 1,
            sizes: [10, 20, 50, 100],
            size: 10,
            total: 0,
          };
          this.queryData.orgId = this.row.vo.agencyid;
          this.loadList();
        });
      },
      // 加载数据表格
      loadList() {
        let _this = this;
        _this.loading = true;
        // 参数
        let dataParams = {
          ..._this.queryData,
          ..._this.factorData,
          ..._this.pageOptions,
        };
        // Lambda写法
        page(dataParams).then(response => {
          //响应成功回调
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
      },
      // 查询
      handleQuery() {
        let _this = this;
        // _this.$refs.queryRef.validate((valid) => {
        //   if (valid) {
        _this.pageOptions.current = 1;
        _this.loadList();
        // }
        // });
      },
      // 清空
      handleClear() {
        this.$refs.queryRef.resetFields();
        this.$refs.componentRef.resetFields();
      },
      // 导出
      handleExport() {
        let _this = this;
        //导出前验证
        if (_this.exportValidator()) {
          _this.exporting = true;
          // 参数
          let dataParams = {
            ..._this.queryData,
            ..._this.factorData,
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
      // 详情
      handleDetail(index, row) {
        this.$refs.detailRef.visible = true;
        this.$refs.detailRef.row = row;
        this.$refs.detailRef.beforeLoadForm();
      },
    }
  }
</script>

<style scoped>

</style>
