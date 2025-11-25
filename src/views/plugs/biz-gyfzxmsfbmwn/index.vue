<template>
  <div class="con-biz-gyfzxmsfbmwn">
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
          prop="ajmc"
          label="案件名称"
          align="center"
          min-width="150"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="ajlbText"
          label="案件类别"
          align="center"
          min-width="200"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="jyaql"
          label="简要案情"
          align="center"
          min-width="200"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="sfsj"
          label="释放时间"
          align="center"
          min-width="200"
        >
          <template slot-scope="scope">
            <span v-html="formatDate(scope.row, scope.column, scope.row.sfsj)"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <biz-gyfzxmsfbmwn-add ref="gyfzxmsfbmwnAddRef" @currentChange="handleGetGyfzxmsfbmwnDataAdd"></biz-gyfzxmsfbmwn-add>
    <biz-gyfzxmsfbmwn-edit ref="gyfzxmsfbmwnEditRef" @currentChange="handleGetGyfzxmsfbmwnDataEdit"></biz-gyfzxmsfbmwn-edit>
    <biz-gyfzxmsfbmwn-detail ref="gyfzxmsfbmwnDetailRef"></biz-gyfzxmsfbmwn-detail>
  </div>
</template>

<script>
import { hdList, hdForm } from '@/utils/util-framework';
import BizGyfzxmsfbmwnAdd from './BizGyfzxmsfbmwnAdd.vue';
import BizGyfzxmsfbmwnDetail from './BizGyfzxmsfbmwnDetail.vue';
import BizGyfzxmsfbmwnEdit from './BizGyfzxmsfbmwnEdit.vue';

export default {
  name: 'Index',
  provide() {
    return {
      bizgyfzxmsfbmwn: this
    };
  },
  inject: [],
  mixins: [hdList, hdForm],
  components: {
    BizGyfzxmsfbmwnAdd,
    BizGyfzxmsfbmwnDetail,
    BizGyfzxmsfbmwnEdit
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
      this.$refs.gyfzxmsfbmwnAddRef.visible = true;
      // this.$refs.gyfzxmsfbmwnAddRef.beforeLoadForm();
    },
    // 详情
    handleDetail(index, row) {
      this.$refs.gyfzxmsfbmwnDetailRef.visible = true;
      this.$refs.gyfzxmsfbmwnDetailRef.row = row;
      this.$refs.gyfzxmsfbmwnDetailRef.beforeLoadForm();
    },
    // 编辑
    handleEdit(index, row) {
      this.$refs.gyfzxmsfbmwnEditRef.visible = true;
      this.$refs.gyfzxmsfbmwnEditRef.row = row;
      this.$refs.gyfzxmsfbmwnEditRef.rowIndex = index;
      this.$refs.gyfzxmsfbmwnEditRef.beforeLoadForm();
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
    handleGetGyfzxmsfbmwnDataAdd(val) {
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
    handleGetGyfzxmsfbmwnDataEdit(val, valIndex) {
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
    },
    // 查询资源库
    handleZyk() {
      this.$message({
        showClose: true,
        customClass: 'is-fixed',
        message: '暂未对接资源库',
        type: 'warning'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.con-biz-gyfzxmsfbmwn {
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
