<template>
  <div class="con-biz-qtwkry">
    <el-button
      class="con-add-btn"
      v-if="showAddBtn"
      type="success"
      icon="el-icon-circle-plus-outline"
      @click="handleAdd"
    >添加</el-button>
    <div>
      <!--其他稳控人列表-->
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
        ></el-table-column>
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
            >详情</el-button>
            <el-button
              v-if="showEditBtn"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              v-if="showDeleteBtn"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="refTypeText"
          label="人员类型"
          align="center"
          min-width="160"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="人员姓名"
          align="center"
          min-width="160"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="cardId"
          label="身份证号"
          align="center"
          width="190"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="phoneNum"
          label="联系电话"
          align="center"
          width="160"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="duty" label="人员职务" align="center" width="160"></el-table-column>
      </el-table>
    </div>
    <biz-qtwkry-add ref="qtwkryAddRef" @currentChange="handleGetQtwkryDataAdd"></biz-qtwkry-add>
    <biz-qtwkry-edit ref="qtwkryEditRef" @currentChange="handleGetQtwkryDataEdit"></biz-qtwkry-edit>
    <biz-qtwkry-detail ref="qtwkryDetailRef"></biz-qtwkry-detail>
  </div>
</template>

<script>
import { hdList, hdForm } from '@/utils/util-framework';
import BizQtwkryAdd from './BizQtwkryAdd';
import BizQtwkryEdit from './BizQtwkryEdit';
import BizQtwkryDetail from './BizQtwkryDetail';

export default {
  name: 'Index',
  provide() {
    return {
      bizQtwkry: this
    };
  },
  inject: [],
  mixins: [hdList, hdForm],
  components: {
    BizQtwkryAdd,
    BizQtwkryEdit,
    BizQtwkryDetail
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
      // 其他稳控人列表
      tableData: []
    };
  },
  watch: {},
  methods: {
    // 其他稳控人上传
    handleAdd() {
      this.$refs.qtwkryAddRef.visible = true;
      this.$refs.qtwkryAddRef.beforeLoadForm();
    },
    // 其他稳控人详情
    handleDetail(index, row) {
      this.$refs.qtwkryDetailRef.visible = true;
      this.$refs.qtwkryDetailRef.row = row;
      this.$refs.qtwkryDetailRef.beforeLoadForm();
    },
    // 其他稳控人编辑
    handleEdit(index, row) {
      this.$refs.qtwkryEditRef.visible = true;
      this.$refs.qtwkryEditRef.row = row;
      this.$refs.qtwkryEditRef.beforeLoadForm();
    },
    // 其他稳控人删除
    handleDelete(index, row) {
      let _this = this;
      _this
        .$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _this.tableData.splice(index, 1);
          _this.$message({
            showClose: true,
            customClass: 'is-fixed',
            message: '删除成功',
            type: 'success'
          });
        });
    },
    // 获取其他稳控人信息
    handleGetQtwkryDataAdd(val) {
      let _this = this;
      let qtwkry = JSON.parse(JSON.stringify(val));
      // 先判断其他稳控人列表中有没有该其他稳控人（根据身份证号确定，已存在的其他稳控人不允许再次添加）
      let hasNotThisQtwkry = _this.tableData.some((item, index) => {
        return item.cardId === qtwkry.cardId;
      });

      // 判断该其他稳控人是否存在
      if (hasNotThisQtwkry) {
        _this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: '该其他稳控人信息已存在！',
          type: 'warning'
        });
      } else {
        _this.tableData.push(qtwkry);
        _this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: '添加成功！',
          type: 'success'
        });
      }
      _this.tableData = JSON.parse(JSON.stringify(_this.tableData));
    },
    // 获取其他稳控人信息
    handleGetQtwkryDataEdit(val) {
      let _this = this;
      let qtwkry = JSON.parse(JSON.stringify(val));
      // 编辑已存在的其他稳控人
      _this.tableData.forEach((item, index) => {
        if (item.cardId === qtwkry.cardId) {
          // 如果有该其他稳控人的话，直接替换该位置上的其他稳控人内容
          _this.tableData[index] = qtwkry;
        }
      });
      _this.$message({
        showClose: true,
        customClass: 'is-fixed',
        message: '编辑成功！',
        type: 'success'
      });
      _this.tableData = JSON.parse(JSON.stringify(_this.tableData));
    },
    // 获取操作列宽度
    getOperateColWidth() {
      let res = '90';
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
.con-biz-qtwkry {
  .con-add-btn {
    position: absolute;
    right: 0;
    top: -1px;
  }
}
</style>
