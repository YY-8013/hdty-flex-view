<template>
  <div class="con-biz-yybfshtr">
    <el-button
      class="con-add-btn"
      v-if="showAddBtn"
      type="success"
      icon="el-icon-circle-plus-outline"
      @click="handleAdd">
      添加
    </el-button>
    <div>
      <el-table
        class="new-table"
        :data="tableData"
        empty-text="暂无数据"
        row-key="id"
        ref="tableRef"
        border>
        <el-table-column
          sortable="custom"
          type="index"
          label="序号"
          :index="setIndex"
          align="center"
          width="60">
        </el-table-column>
        <el-table-column
          v-if="showDetailBtn || showEditBtn || showDeleteBtn"
          label="操作"
          align="center"
          :width="getOperateColWidth()">
          <template slot-scope="scope">
            <el-button
              v-if="showDetailBtn"
              type="success"
              @click="handleDetail(scope.$index, scope.row)">
              详情
            </el-button>
            <el-button
              v-if="showEditBtn"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button
              v-if="showDeleteBtn"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="yytjText"
          label="扬言途径"
          align="center"
          min-width="160">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="zygkcsdmText"
          label="管控措施"
          align="center"
          min-width="160">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="yybfshyy"
          label="扬言报复社会原因"
          align="center"
          min-width="160">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="yxnr"
          label="具体言行表现"
          align="center"
          min-width="160">
        </el-table-column>
      </el-table>
    </div>
    <biz-yybfshtr-add ref="yybfshtrAddRef" @currentChange="handleGetYybfshtrDataAdd"></biz-yybfshtr-add>
    <biz-yybfshtr-edit ref="yybfshtrEditRef" @currentChange="handleGetYybfshtrDataEdit"></biz-yybfshtr-edit>
    <biz-yybfshtr-detail ref="yybfshtrDetailRef"></biz-yybfshtr-detail>
  </div>
</template>

<script>
  import {hdList, hdForm} from "@/utils/util-framework";
  import BizYybfshtrAdd from './BizYybfshtrAdd';
  import BizYybfshtrEdit from './BizYybfshtrEdit';
  import BizYybfshtrDetail from './BizYybfshtrDetail';

  export default {
    name: 'Index',
    provide() {
      return {
        bizYybfshtr: this
      };
    },
    inject: [],
    mixins: [hdList, hdForm],
    components: {
      BizYybfshtrAdd,
      BizYybfshtrEdit,
      BizYybfshtrDetail,
    },
    props: {
      // 显示新增按钮
      showAddBtn: {
        type: Boolean,
        default: true,
      },
      // 显示详情按钮
      showDetailBtn: {
        type: Boolean,
        default: true
      },
      // 显示编辑按钮
      showEditBtn: {
        type: Boolean,
        default: true,
      },
      // 显示删除按钮
      showDeleteBtn: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        // 列表
        tableData: [],
      }
    },
    watch: {},
    methods: {
      // 上传
      handleAdd() {
        this.$refs.yybfshtrAddRef.visible = true;
        this.$refs.yybfshtrAddRef.beforeLoadForm();
      },
      // 详情
      handleDetail(index, row) {
        this.$refs.yybfshtrDetailRef.visible = true;
        this.$refs.yybfshtrDetailRef.row = row;
        this.$refs.yybfshtrDetailRef.beforeLoadForm();
      },
      // 编辑
      handleEdit(index, row) {
        this.$refs.yybfshtrEditRef.visible = true;
        this.$refs.yybfshtrEditRef.row = row;
        this.$refs.yybfshtrEditRef.rowIndex = index;
        this.$refs.yybfshtrEditRef.beforeLoadForm();
      },
      // 删除
      handleDelete(index, row) {
        let _this = this;
        _this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
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
      handleGetYybfshtrDataAdd(val) {
        let _this = this;
        let yybfshtr = JSON.parse(JSON.stringify(val));
        _this.tableData.push(yybfshtr);
        _this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: '添加成功！',
          type: 'success'
        });
      _this.tableData = JSON.parse(JSON.stringify(_this.tableData));
      },
      // 获取信息
      handleGetYybfshtrDataEdit(val, valIndex) {
        let _this = this;
        let yybfshtr = JSON.parse(JSON.stringify(val));
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
    }
  }
</script>

<style lang="scss" scoped>
  .con-biz-yybfshtr {
    .con-add-btn {
      position: absolute;
      right: 0;
      top: -1px;
    }
  }
</style>
