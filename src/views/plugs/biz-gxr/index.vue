<template>
  <div class="con-biz-gxr">
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
              <span class="btn-text">
                编辑
                <img
                  v-show="scope.row.needEdit"
                  class="required-img"
                  src="../../images/required.png"
                  alt
                />
              </span>
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
          prop="rygxlxText"
          label="人员关系"
          align="center"
          min-width="160"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="xm"
          label="人员姓名"
          align="center"
          min-width="160"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="gmsfhm"
          label="身份证号"
          align="center"
          width="190"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="lxdh"
          label="联系电话"
          align="center"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="sjlyText"
          label="数据来源"
          align="center"
          width="110"
        ></el-table-column>
      </el-table>
    </div>
    <biz-gxr-add
      ref="gxrAddRef"
      @currentChange="handleGetGxrDataAdd"
    ></biz-gxr-add>
    <biz-gxr-edit
      ref="gxrEditRef"
      @currentChange="handleGetGxrDataEdit"
    ></biz-gxr-edit>
    <biz-gxr-detail ref="gxrDetailRef"></biz-gxr-detail>
  </div>
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";
import BizGxrAdd from "./BizGxrAdd";
import BizGxrEdit from "./BizGxrEdit";
import BizGxrDetail from "./BizGxrDetail";

export default {
  name: "Index",
  provide() {
    return {
      bizGxr: this
    };
  },
  inject: [],
  mixins: [hdList, hdForm],
  components: {
    BizGxrAdd,
    BizGxrEdit,
    BizGxrDetail
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
      // 先判断关系人列表中有没有该关系人（根据身份证号确定，已存在的关系人不允许再次添加）
      let hasNotThisGxr = true;
      _this.tableData.forEach((item, index) => {
        if (item.gmsfhm === gxr.gmsfhm) {
          // 关系人列表中有该关系人
          hasNotThisGxr = false;
        }
      });
      // 判断该关系人是否存在
      if (!hasNotThisGxr) {
        _this.$message({
          showClose: true,
          customClass: "is-fixed",
          message: "该关系人信息已存在！",
          type: "warning"
        });
      } else {
        _this.tableData.push(gxr);
        _this.$message({
          showClose: true,
          customClass: "is-fixed",
          message: "添加成功！",
          type: "success"
        });
      }
      _this.tableData = JSON.parse(JSON.stringify(_this.tableData));
    },
    // 获取关系人信息
    handleGetGxrDataEdit(val) {
      let _this = this;
      let gxr = JSON.parse(JSON.stringify(val));
      // 编辑已存在的关系人
      _this.tableData.forEach((item, index) => {
        if (item.gmsfhm === gxr.gmsfhm) {
          // 如果有该关系人的话，直接替换该位置上的关系人内容
          _this.tableData[index] = gxr;
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
.con-biz-gxr {
  .con-add-btn {
    position: absolute;
    right: 0;
    top: -1px;
  }
}
</style>
