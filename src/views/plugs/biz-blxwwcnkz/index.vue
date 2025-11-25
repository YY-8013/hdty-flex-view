<template>
  <div class="con-biz-blxwwcnkz">
    <el-button
      class="con-add-btn"
      v-if="showAddBtn"
      type="success"
      icon="el-icon-circle-plus-outline"
      @click="handleAdd"
    >添加</el-button>
    <div>
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
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="yzwhshxwlbText"
          label="严重危害社会行为类别"
          align="center"
          min-width="200"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="fmzkText"
          label="父母状况"
          align="center"
          min-width="200"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="jtjhzkText"
          label="家庭监护状况"
          align="center"
          min-width="200"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="sjyqkText"
          label="受教育情况"
          align="center"
          min-width="200"
        ></el-table-column>
      </el-table>
    </div>
    <biz-blxwwcnkz-add ref="blxwwcnkzAddRef" @currentChange="handleGetBlxwwcnkzDataAdd"></biz-blxwwcnkz-add>
    <biz-blxwwcnkz-edit ref="blxwwcnkzEditRef" @currentChange="handleGetBlxwwcnkzDataEdit"></biz-blxwwcnkz-edit>
    <biz-blxwwcnkz-detail ref="blxwwcnkzDetailRef"></biz-blxwwcnkz-detail>
  </div>
</template>

<script>
import { hdList, hdForm } from '@/utils/util-framework';
import BizBlxwwcnkzAdd from './BizBlxwwcnkzAdd.vue';
import BizBlxwwcnkzDetail from './BizBlxwwcnkzDetail.vue';
import BizBlxwwcnkzEdit from './BizBlxwwcnkzEdit.vue';

export default {
  name: 'Index',
  provide() {
    return {
      bizblxwwcnkz: this
    };
  },
  inject: [],
  mixins: [hdList, hdForm],
  components: {
    BizBlxwwcnkzAdd,
    BizBlxwwcnkzDetail,
    BizBlxwwcnkzEdit
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
      // 列表
      tableData: []
    };
  },
  watch: {},
  methods: {
    // 上传
    handleAdd() {
      this.$refs.blxwwcnkzAddRef.visible = true;
      this.$refs.blxwwcnkzAddRef.beforeLoadForm();
    },
    // 详情
    handleDetail(index, row) {
      this.$refs.blxwwcnkzDetailRef.visible = true;
      this.$refs.blxwwcnkzDetailRef.row = row;
      this.$refs.blxwwcnkzDetailRef.beforeLoadForm();
    },
    // 编辑
    handleEdit(index, row) {
      this.$refs.blxwwcnkzEditRef.visible = true;
      this.$refs.blxwwcnkzEditRef.row = row;
      this.$refs.blxwwcnkzEditRef.rowIndex = index;
      this.$refs.blxwwcnkzEditRef.beforeLoadForm();
    },
    // 删除
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
    // 获取信息
    handleGetBlxwwcnkzDataAdd(val) {
      let _this = this;
      _this.tableData.push(JSON.parse(JSON.stringify(val)));
      _this.$message({
        showClose: true,
        customClass: 'is-fixed',
        message: '添加成功！',
        type: 'success'
      });
      _this.tableData = JSON.parse(JSON.stringify(_this.tableData));
    },
    // 获取信息
    handleGetBlxwwcnkzDataEdit(val, valIndex) {
      let _this = this;
      _this.tableData[valIndex] = JSON.parse(JSON.stringify(val));
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
.con-biz-blxwwcnkz {
  .con-zyk-btn {
    position: absolute;
    right: 86px;
    top: -1px;
  }
  .con-add-btn {
    position: absolute;
    right: 0;
    top: -1px;
  }
}
</style>
