<template>
  <div class="con-biz">
    <el-button
      class="con-add-btn"
      v-if="showAddBtn"
      type="success"
      icon="el-icon-circle-plus-outline"
      @click="handleAdd"
    >
      添加
    </el-button>
    <div>
      <!--关系人列表-->
      <el-table
        class="new-table"
        :data="tableData"
        empty-text="暂无数据"
        row-key="id"
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
        >
        </el-table-column>
        <el-table-column
          v-if="showDetailBtn || showEditBtn || showDeleteBtn"
          label="操作"
          align="center"
          :width="getOperateColWidth()"
        >
          <template slot-scope="scope">
            <el-button
              v-if="showDetailBtn"
              type="success"
              @click="handleDetail(scope.$index, scope.row)"
            >
              详情
            </el-button>
            <el-button
              v-if="showEditBtn"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="showDeleteBtn"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="lydText"
          label="来源地"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="ddsj"
          label="到达日期"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            {{ formatDate(scope.row.ddsj) }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="lwsmd"
          label="来我市目的"
          align="center"
          min-width="190"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="mddText"
          label="目的地"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="lksj"
          label="离开日期"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            {{ formatDate(scope.row.lksj) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <biz-add ref="gxrAddRef" @currentChange="handleGetGxrDataAdd"></biz-add>
    <biz-edit ref="gxrEditRef" @currentChange="handleGetGxrDataEdit"></biz-edit>
    <biz-detail ref="gxrDetailRef"></biz-detail>
  </div>
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";
import BizAdd from "./BizAdd";
import BizEdit from "./BizEdit";
import BizDetail from "./BizDetail";

export default {
  name: "Index",
  provide() {
    return {
      BizList: this
    };
  },
  inject: [],
  mixins: [hdList, hdForm],
  components: {
    BizAdd,
    BizEdit,
    BizDetail
  },
  props: {
    // 显示新增按钮
    showAddBtn: {
      type: Boolean,
      default: true
    },
    // 显示详情按钮
    showDetailBtn: {
      type: Boolean,
      default: true
    },
    // 显示编辑按钮
    showEditBtn: {
      type: Boolean,
      default: true
    },
    // 显示删除按钮
    showDeleteBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 关系人列表
      tableData: []
    };
  },
  watch: {},
  methods: {
    // 关系人上传
    handleAdd() {
      this.$refs.gxrAddRef.visible = true;
      this.$refs.gxrAddRef.beforeLoadForm();
    },
    // 关系人详情
    handleDetail(index, row) {
      this.$refs.gxrDetailRef.visible = true;
      this.$refs.gxrDetailRef.row = row;
      this.$refs.gxrDetailRef.beforeLoadForm();
    },
    // 关系人编辑
    handleEdit(index, row) {
      this.$refs.gxrEditRef.visible = true;
      this.$refs.gxrEditRef.row = row;
      this.$refs.gxrEditRef.currentIndex = index;
      this.$refs.gxrEditRef.beforeLoadForm();
    },
    // 关系人删除
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
    // 获取关系人信息
    handleGetGxrDataAdd(val) {
      let _this = this;
      let gxr = JSON.parse(JSON.stringify(val));
      _this.tableData.push(gxr);
      _this.$message({
        showClose: true,
        customClass: "is-fixed",
        message: "添加成功！",
        type: "success"
      });
      _this.tableData = JSON.parse(JSON.stringify(_this.tableData));
    },
    // 获取关系人信息
    handleGetGxrDataEdit(val, index) {
      let _this = this;
      let gxr = JSON.parse(JSON.stringify(val));
      // 编辑已存在的关系人
      _this.tableData[index] = gxr;
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
.con-biz {
  .con-add-btn {
    position: absolute;
    right: 0;
    top: -1px;
  }
}
</style>
