<template>
  <el-dialog
    :title="`人员流动轨迹 - 姓名【${row.vo.xm}】身份证号【${row.vo.gmsfhm}】`"
    :visible.sync="visible"
    custom-class="hdty-dialog-medium new-form"
    @close="cancelForm"
    append-to-body
  >
    <hd-pane>
      <div class="hdty-container hdty-flex new-list">
        <div class="hdty-header">
          <el-form
            :model="queryData"
            :rules="rules"
            ref="queryRef"
            inline
            @submit.native.prevent
            @keyup.enter.native="handleQuery"
          >
            <hd-component :model="extendData" ref="componentRef">
              <hd-query>
                <hd-query-fixed>
                  <el-row>
                    <el-form-item label="流动时间" prop="ldsj">
                      <hd-date-picker
                        type="datetimerange"
                        v-model="queryData.ldsj"
                      ></hd-date-picker>
                    </el-form-item>
                    <el-form-item label="审批状态" prop="spzt">
                      <hd-dict-select
                        v-model="queryData.spzt"
                        :dictCode="$global.dictType.ldSpzt"
                        filterable
                        multiple
                        placeholder="请选择审批状态"
                      ></hd-dict-select>
                    </el-form-item>
                  </el-row>
                </hd-query-fixed>
              </hd-query>
            </hd-component>
          </el-form>
          <hd-button-container>
            <hd-button
              name="query"
              type="info"
              icon="el-icon-search"
              @click="handleQuery"
              >查询</hd-button
            >
            <hd-button icon="el-icon-delete" @click="handleClear"
              >清空</hd-button
            >
          </hd-button-container>
        </div>
        <div class="hdty-fit">
          <el-table
            :data="tableData"
            :empty-text="emptyText"
            row-key="id"
            ref="tableRef"
            class="new-table"
            v-loading="loading"
            border
            fit
            height="100%"
          >
            <el-table-column
              sortable="custom"
              type="index"
              label="序号"
              :index="setIndex"
              align="center"
              width="60"
            ></el-table-column>

            <el-table-column
              show-overflow-tooltip
              prop="vox.ldType"
              label="流动类型"
              align="center"
              width="90"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="vox.lcdOrgId"
              label="流出地机构"
              min-width="150"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="vox.lrdOrgId"
              label="流入地机构"
              min-width="150"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="vo.ldyy"
              label="流动原因"
              min-width="150"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="vox.ldsj"
              label="流动时间"
              align="center"
              width="160"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="vox.spzt"
              label="审批状态"
              align="center"
              width="90"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.vo.spzt === '0'" class="text-color-1">{{
                  scope.row.vox.spzt
                }}</span>
                <span v-if="scope.row.vo.spzt === '1'" class="text-color-6">{{
                  scope.row.vox.spzt
                }}</span>
                <span v-if="scope.row.vo.spzt === '2'" class="text-color-4">{{
                  scope.row.vox.spzt
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="70"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="success"
                  @click="handleDetail(scope.$index, scope.row)"
                  >详情</el-button
                >
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
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
        <biz-xwgj-detail ref="detailRef"></biz-xwgj-detail>
      </div>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList } from "@/utils/util-framework";
import { page } from "./api";

import BizXwgjDetail from "./BizXwgjDetail";

export default {
  name: "BizXwgjList",
  provide() {
    return {
      BizXwgjList: this,
      bizXwgj: this
    };
  },
  mixins: [hdList],
  inject: ["hdList"],
  components: {
    BizXwgjDetail
  },
  data() {
    return {
      visible: false,
      // 查询
      queryData: {
        spzt: [],
        ldsj: [],
        zxbs: "0"
      },
      // 查询扩展
      extendData: {},
      // 表格
      tableData: [],
      // 验证
      rules: {},
      // 行
      row: {
        vo: {},
        vox: {}
      }
    };
  },
  computed: {
    canEdit() {
      return this.row && this.row.vo && this.row.vo.zxbs === "0";
    }
  },
  methods: {
    beforeLoadList() {
      this.handleClear();
      this.loadList();
    },
    // 获取数据表格
    loadList() {
      let _this = this;
      if (_this.AUTHORITY_QUERY) {
        _this.loading = true;
        // 处理日期范围查询参数
        const params = {
          ..._this.queryData,
          ..._this.extendData,
          ..._this.pageOptions,
          gzrySfzhm: _this.row.vo.gmsfhm
        };

        page(params)
          .then((response) => {
            let { success, data } = response.data;
            if (success) {
              _this.pageOptions.total = data.total;
              _this.tableData = data.records;
            }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            _this.$nextTick(() => {
              _this.$refs.tableRef.doLayout();
            });
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
    // 取消
    cancelForm() {
      this.visible = false;
      this.handleClear();
    },
    // 清空
    handleClear() {
      if (this.$refs.queryRef) {
        this.$refs.queryRef.resetFields();
      }
    },

    // 详情
    handleDetail(index, row) {
      this.$refs.detailRef.visible = true;
      this.$refs.detailRef.row = row;
      this.$refs.detailRef.beforeLoadForm();
    },
    // 导出
    handleExport() {
      let _this = this;
      if (_this.validateExport()) {
        _this.exporting = true;
        const params = {
          ..._this.queryData
        };

        exports(params)
          .then((response) => {
            _this.download(response);
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            _this.exporting = false;
          });
      }
    }
  }
};
</script>

<style scoped>
.table-link {
  color: #409eff;
  cursor: pointer;
}
.table-link:hover {
  text-decoration: underline;
}
</style>
