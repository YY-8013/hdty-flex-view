<template>
  <div class="con-biz-xwgj">
    <el-button
      class="con-add-btn"
      v-if="showAddBtn"
      type="success"
      icon="el-icon-circle-plus-outline"
      style="float: right"
      @click="handleAdd"
      >添加</el-button
    >
    <div>
      <el-table
        class="new-table"
        :data="tableData"
        empty-text="暂无数据"
        row-key="vo.id"
        ref="tableRef"
        border
      >
        <el-table-column
          sortable="custom"
          type="index"
          label="序号"
          :index="setIndex"
          align="center"
          width="60"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="70">
          <template slot-scope="scope">
            <el-button
              type="success"
              @click="handleDetail(scope.$index, scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
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
      </el-table>
      <div class="hdty-form-footer">
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
    </div>
    <biz-xwgj-add
      ref="xwgjAddRef"
      @currentChange="handleGetXwgjDataAdd"
    ></biz-xwgj-add>
    <biz-xwgj-edit
      ref="xwgjEditRef"
      @currentChange="handleGetXwgjDataEdit"
    ></biz-xwgj-edit>
    <biz-xwgj-detail ref="xwgjDetailRef"></biz-xwgj-detail>
  </div>
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";
import BizXwgjAdd from "./BizXwgjAdd";
import BizXwgjEdit from "./BizXwgjEdit";
import BizXwgjDetail from "./BizXwgjDetail";

import { page } from "./api";

export default {
  name: "Index",
  provide() {
    return {
      bizXwgj: this
    };
  },
  inject: [],
  mixins: [hdList, hdForm],
  components: {
    BizXwgjAdd,
    BizXwgjEdit,
    BizXwgjDetail
  },
  props: {
    // 显示新增按钮
    showAddBtn: {
      type: Boolean,
      default: false
    },
    // 显示详情按钮
    showDetailBtn: {
      type: Boolean,
      default: true
    },
    // 显示编辑按钮
    showEditBtn: {
      type: Boolean,
      default: false
    },
    // 显示删除按钮
    showDeleteBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 流动轨迹列表
      tableData: [],
      queryData: {},
      extendData: {},
      row: { vo: {}, vox: {} }
    };
  },
  watch: {},
  methods: {
    beforeLoadForm() {
      let _this = this;
      _this.$nextTick(() => {
        _this.loadList();
      });
    },
    // 获取数据表格
    loadList() {
      let _this = this;
      _this.loading = true;
      const params = {
        ..._this.queryData,
        ..._this.extendData,
        ..._this.pageOptions,
        gzryId: _this.row.vo.zdrybm
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
          _this.loading = false;
          _this.$nextTick(() => {
            _this.$refs.tableRef.doLayout();
          });
        });
    },
    // 流动轨迹上传
    handleAdd() {
      this.$refs.xwgjAddRef.visible = true;
      this.$refs.xwgjAddRef.beforeLoadForm();
    },
    // 流动轨迹详情
    handleDetail(index, row) {
      this.$refs.xwgjDetailRef.visible = true;
      this.$refs.xwgjDetailRef.row = row;
      this.$refs.xwgjDetailRef.beforeLoadForm();
    },
    // 流动轨迹编辑
    handleEdit(index, row) {
      this.$refs.xwgjEditRef.visible = true;
      this.$refs.xwgjEditRef.row = row;
      this.$refs.xwgjEditRef.index = index;
      this.$refs.xwgjEditRef.beforeLoadForm();
    },
    // 流动轨迹删除
    handleDelete(index, row) {
      let _this = this;
      _this
        .$confirm("确定要删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.tableData.splice(index, 1);
          _this.$message({
            showClose: true,
            customClass: "is-fixed",
            message: "删除成功",
            type: "success"
          });
        });
    },
    // 获取流动轨迹信息
    handleGetXwgjDataAdd(val) {
      let _this = this;
      let xwgj = JSON.parse(JSON.stringify(val));
      _this.tableData.push(xwgj);
      _this.$message({
        showClose: true,
        customClass: "is-fixed",
        message: "添加成功！",
        type: "success"
      });
      _this.tableData = JSON.parse(JSON.stringify(_this.tableData));
    },

    handleGetXwgjDataEdit(val) {
      let _this = this;
      let xwgj = JSON.parse(JSON.stringify(val));
      // 编辑已存在的住院
      _this.tableData.forEach((item, index) => {
        if (index === xwgj.index) {
          // 如果有该住院的话，直接替换该位置上的住院内容
          _this.tableData[index] = xwgj;
        }
      });
      _this.$message({
        showClose: true,
        customClass: "is-fixed",
        message: "编辑成功！",
        type: "success"
      });
      _this.tableData = JSON.parse(JSON.stringify(_this.tableData));
    },
    // 获取操作列宽度
    getOperateColWidth() {
      let res = "90";
      let btnNum = 0;
      if (this.showDetailBtn) {
        btnNum += 1;
      }
      if (this.showEditBtn) {
        btnNum += 1;
      }
      if (this.showDeleteBtn) {
        btnNum += 1;
      }
      if (btnNum === 2) {
        res = String(150);
      }
      if (btnNum === 3) {
        res = String(220);
      }
      return res;
    }
  }
};
</script>

<style lang="scss" scoped>
.con-biz-xwgj {
  position: relative;
  .con-add-btn {
    position: absolute;
    right: -16px;
    top: -60px;
    z-index: 10;
  }
}
</style>
