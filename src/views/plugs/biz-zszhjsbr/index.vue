<template>
  <div class="con-biz-zszhjsbr">
    <div class="con-add-btn">
      <el-button
        class="con-add-btn"
        v-if="showAddBtn"
        :disabled="tableData && tableData.length >= zszhNumMax"
        :title="(tableData && tableData.length >= zszhNumMax) ? `【肇事肇祸精神病人扩展信息】最多只允许添加${zszhNumMax}条` : ''"
        type="success"
        icon="el-icon-circle-plus-outline"
        @click="handleAdd"
      >添加</el-button>
    </div>
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
          prop="qzjsjblx"
          label="精神疾病类型"
          align="center"
          min-width="160"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="qzyyMc"
          label="确诊医院名称"
          align="center"
          min-width="160"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="wsgldw"
          label="卫生管理单位"
          align="center"
          min-width="160"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="sfzxqzylPdbsText"
          label="是否实行强制医疗"
          align="center"
          min-width="160"
        ></el-table-column>
      </el-table>
    </div>
    <biz-zszhjsbr-add ref="zszhjsbrAddRef" @currentChange="handleGetZszhjsbrDataAdd"></biz-zszhjsbr-add>
    <biz-zszhjsbr-edit ref="zszhjsbrEditRef" @currentChange="handleGetZszhjsbrDataEdit"></biz-zszhjsbr-edit>
    <biz-zszhjsbr-detail ref="zszhjsbrDetailRef"></biz-zszhjsbr-detail>
  </div>
</template>

<script>
import { hdList, hdForm } from '@/utils/util-framework';
import BizZszhjsbrAdd from './BizZszhjsbrAdd';
import BizZszhjsbrEdit from './BizZszhjsbrEdit';
import BizZszhjsbrDetail from './BizZszhjsbrDetail';

export default {
  name: 'Index',
  provide() {
    return {
      bizZszhjsbr: this
    };
  },
  inject: [],
  mixins: [hdList, hdForm],
  components: {
    BizZszhjsbrAdd,
    BizZszhjsbrEdit,
    BizZszhjsbrDetail
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
      tableData: [],
      //  肇事肇祸精神病人扩展信息最大数
      zszhNumMax: 1
    };
  },
  watch: {},
  methods: {
    // 上传
    handleAdd() {
      let _this = this;
      if (this.tableData && this.tableData.length >= _this.zszhNumMax) {
        _this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: `【肇事肇祸精神病人扩展信息】最多只允许添加${_this.zszhNumMax}条`,
          type: 'warning'
        });
        return;
      }
      this.$refs.zszhjsbrAddRef.visible = true;
      this.$refs.zszhjsbrAddRef.beforeLoadForm();
    },
    // 详情
    handleDetail(index, row) {
      this.$refs.zszhjsbrDetailRef.visible = true;
      this.$refs.zszhjsbrDetailRef.row = row;
      this.$refs.zszhjsbrDetailRef.beforeLoadForm();
    },
    // 编辑
    handleEdit(index, row) {
      this.$refs.zszhjsbrEditRef.visible = true;
      this.$refs.zszhjsbrEditRef.row = row;
      this.$refs.zszhjsbrEditRef.rowIndex = index;
      this.$refs.zszhjsbrEditRef.beforeLoadForm();
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
    handleGetZszhjsbrDataAdd(val) {
      let _this = this;
      let zszhjsbr = JSON.parse(JSON.stringify(val));
      _this.tableData.push(zszhjsbr);
      _this.$message({
        showClose: true,
        customClass: 'is-fixed',
        message: '添加成功！',
        type: 'success'
      });
      _this.tableData = JSON.parse(JSON.stringify(_this.tableData));
    },
    // 获取信息
    handleGetZszhjsbrDataEdit(val, valIndex) {
      let _this = this;
      let zszhjsbr = JSON.parse(JSON.stringify(val));
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
.con-biz-zszhjsbr {
  .con-add-btn {
    position: absolute;
    right: 0;
    top: -1px;
  }
}
</style>
