<template>
  <div class="hdty-container hdty-flex" style="min-height: 600px">
    <div class="hdty-header">
      <el-form
        :inline="true"
        :model="queryData"
        :rules="rules"
        ref="queryRef"
        size="small"
        @keyup.enter.native="handleQuery"
      >
        <el-form-item label="单位名称" prop="dwmc">
          <hd-factor-input
            fuzzy="between"
            v-model="queryData.dwmc"
            :model-control.sync="factorData.dwmcFilterFactor"
            placeholder="请输入单位名称"
          ></hd-factor-input>
        </el-form-item>
        <el-form-item label="管辖机构" prop="sjgsdwdm">
          <hd-organ
            v-model="queryData.sjgsdwdm"
            :model-text.sync="queryData.sjgsdwdmName"
            placeholder="请选择管辖机构"
          >
          </hd-organ>
        </el-form-item>
      </el-form>
      <div class="hdty-btn-group">
        <el-button
          type="info"
          size="small"
          v-preventReClick
          icon="el-icon-search"
          @click="handleQuery"
          >查询</el-button
        >
        <el-button siza="small" icon="el-icon-delete" @click="handleClear"
          >清空</el-button
        >
      </div>
    </div>
    <div class="hdty-fit">
      <el-table
        ref="tableRef"
        row-key="companyId"
        v-loading="loading"
        :data="tableData"
        @sort-change="handleSortChange"
        border
        fit
        height="100%"
      >
        <el-table-column fixed label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleChecked(scope.$index, scope.row)"
            >
              选择
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          sortable="custom"
          type="index"
          label="序号"
          :index="setIndex"
          align="center"
          width="50"
        >
        </el-table-column>
        <el-table-column
          prop="vo.dwmc"
          label="单位名称"
          sortable="custom"
          header-align="center"
          min-width="150"
        >
        </el-table-column>
        <el-table-column
          prop="vo.dwdzQhnxxdz"
          label="单位地址"
          sortable="custom"
          header-align="center"
          min-width="460"
        >
        </el-table-column>
        <el-table-column
          prop="vo.frxm"
          label="法定代表人姓名"
          header-align="center"
          width="110"
        >
        </el-table-column>
        <el-table-column
          prop="vo.frgmsfhm"
          label="法定代表人证件号码"
          header-align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="vo.frlxdh"
          label="法定代表人联系电话"
          header-align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="vox.sjgsdwdm"
          label="数据归属单位"
          header-align="center"
          width="200"
        >
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
        :total="pageOptions.total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { hdComponent, hdForm, hdList, hdMethod } from "@/utils/util-framework";
import { sydwPage } from "./api";
export default {
  name: "BizSydwSelect",
  provide() {
    return {
      BizSydwSelect: this
    };
  },
  mixins: [hdComponent, hdList, hdForm, hdMethod],
  props: {
    prop: String,
    // 业务类别
    ywlb: {
      type: Array,
      default: ["50"]
    }
  },
  data() {
    return {
      // 查询
      queryData: {
        dwmc: "",
        uscc: "",
        zxbs: "0",
        //ywlb: ['50'],
        sjgsdwdm: this.$utilPublic.getUserOrgId(),
        sjgsdwdmName: this.$utilPublic.getUserInfo().orgName
      },
      // 查询条件
      factorData: {
        dwmcFilterFactor: ""
      },
      // 验证
      rules: {},
      // 表格数据
      tableData: []
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    // 获取数据列表
    loadList() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        ..._this.queryData,
        ..._this.factorData,
        ..._this.pageOptions,
        ywlb: _this.ywlb
      };
      sydwPage(dataParams)
        .then((response) => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.pageOptions.total = data.total;
            _this.tableData = data.records;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
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
    // 单选
    handleChecked(index, row) {
      this.visible = false;
      this.input = row.vo.xm;
      this.$emit("input", row.vo.id); //触发 input 事件，并传入新值
      this.$emit("update:modelText", row.vo.xm);
      this.$emit("currentChanged", row.vo);
      this.triggerValidateField();
    },
    // 取消
    cancelForm() {
      this.visible = false;
    }
  }
};
</script>

<style scoped></style>
