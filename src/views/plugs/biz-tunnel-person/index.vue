<template>
  <div class="con-biz-person">
    <el-button
      class="con-add-btn"
      v-if="showAddBtn"
      type="success"
      @click="handleAdd"
      >添加</el-button
    >
    <div>
      <el-table
        class="new-table"
        ref="tableRef"
        :data="tableData"
        row-key="id"
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
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              v-if="showDetailBtn"
              type="success"
              @click="handleDetail(scope.$index, scope.row)"
              >详情</el-button
            >
            <el-button
              v-if="showEditBtn"
              :disabled="scope.row.signState === '4'"
              :title="scope.row.signState === '4' ? '已签收' : ''"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="showDeleteBtn"
              :disabled="scope.row.signState === '4'"
              :title="scope.row.signState === '4' ? '已签收' : ''"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="姓名"
          align="center"
          min-width="120"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="cardId"
          label="身份证号"
          align="center"
          min-width="190"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="zdrylxText"
          label="人员标签"
          align="center"
          min-width="200"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.zdrylxText" class="hdty-elip">
              {{ $utilStr.splitArray(scope.row.zdrylxText) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="gkdwlxText"
          label="管控单位类型"
          align="center"
          min-width="160"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="orgIdText"
          label="机构"
          header-align="center"
          width="280"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="isNecessary"
          label="是否必须签收为关注人员"
          header-align="center"
          width="280"
        >
          <template slot-scope="scope">
            <span>
              <span v-if="scope.row.isNecessary === '1'">是</span>
              <span v-else-if="scope.row.isNecessary === '0'">否</span>
              <span v-else>按下发批次</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <biz-person-add ref="personAddRef"></biz-person-add>
    <biz-person-edit ref="personEditRef"></biz-person-edit>
    <biz-person-detail ref="personDetailRef"></biz-person-detail>
  </div>
</template>
<script>
import { hdForm, hdList } from "@/utils/util-framework";
import BizPersonAdd from "./BizPersonAdd";
import BizPersonEdit from "./BizPersonEdit";
import BizPersonDetail from "./BizPersonDetail";

export default {
  name: "Index",
  provide() {
    return {
      bizTunnelPerson: this
    };
  },
  inject: ["ZdryTnnnelManage"],
  mixins: [hdList, hdForm],
  components: {
    BizPersonAdd,
    BizPersonEdit,
    BizPersonDetail
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
      // 人员信息列表
      tableData: []
    };
  },
  methods: {
    // 新增
    handleAdd() {
      this.$refs.personAddRef.visible = true;
      this.$refs.personAddRef.beforeLoadForm();
    },
    // 人员信息详情
    handleDetail(index, row) {
      this.$refs.personDetailRef.visible = true;
      this.$refs.personDetailRef.row = row;
      this.$refs.personDetailRef.beforeLoadForm();
    },
    // 人员信息编辑
    handleEdit(index, row) {
      this.$refs.personEditRef.visible = true;
      this.$refs.personEditRef.row = row;
      this.$refs.personEditRef.beforeLoadForm();
    },
    // 删除
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
        })
        .finally(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.con-biz-person {
  .con-add-btn {
    position: absolute;
    right: 0;
    top: -1px;
  }
}
</style>
