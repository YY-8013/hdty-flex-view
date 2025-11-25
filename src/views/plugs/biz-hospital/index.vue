<template>
  <div class="con-biz-Hospital">
    <el-button
      class="con-add-btn"
      v-if="showAddBtn"
      type="success"
      icon="el-icon-circle-plus-outline"
      @click="handleAdd">
      添加
    </el-button>
    <div>
      <!--住院信息列表-->
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
          prop="hospitalName"
          label="医院名称"
          align="center"
          min-width="160">
        </el-table-column>

        <el-table-column
          prop="rysj"
          label="入院时间"
          header-align="center"
          align="center"
          width="180">
          <template slot-scope="scope">
            <span>{{ $utilDate.dateFtt(scope.row.rysj, 'yyyy-MM-dd') }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="cysj"
          label="出院时间"
          header-align="center"
          align="center"
          width="180">
          <template slot-scope="scope">
            <span>{{
                scope.row.cysj != null && scope.row.cysj != '' ? $utilDate.dateFtt(scope.row.cysj, 'yyyy-MM-dd') : "无"
              }}</span>
          </template>
        </el-table-column>


      </el-table>
    </div>
    <biz-Hospital-add ref="HospitalAddRef" @currentChange="handleGetHospitalDataAdd"></biz-Hospital-add>
    <biz-Hospital-edit ref="HospitalEditRef" @currentChange="handleGetHospitalDataEdit"></biz-Hospital-edit>
    <biz-Hospital-detail ref="HospitalDetailRef"></biz-Hospital-detail>
  </div>
</template>

<script>
import {hdList, hdForm} from "@/utils/util-framework";
import BizHospitalAdd from './BizHospitalAdd';
import BizHospitalEdit from './BizHospitalEdit';
import BizHospitalDetail from './BizHospitalDetail';

export default {
  name: 'Index',
  provide() {
    return {
      bizHospital: this
    };
  },
  inject: [],
  mixins: [hdList, hdForm],
  components: {
    BizHospitalAdd,
    BizHospitalEdit,
    BizHospitalDetail,
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
      // 住院列表
      tableData: [],
    }
  },
  watch: {},
  methods: {
    // 住院上传
    handleAdd() {
      this.$refs.HospitalAddRef.visible = true;
      this.$refs.HospitalAddRef.beforeLoadForm();
    },
    // 住院详情
    handleDetail(index, row) {
      this.$refs.HospitalDetailRef.visible = true;
      this.$refs.HospitalDetailRef.row = row;
      this.$refs.HospitalDetailRef.beforeLoadForm();
    },
    // 住院编辑
    handleEdit(index, row) {
      this.$refs.HospitalEditRef.visible = true;
      this.$refs.HospitalEditRef.row = row;
      this.$refs.HospitalEditRef.index = index;
      this.$refs.HospitalEditRef.beforeLoadForm();
    },
    // 住院删除
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
    // 获取住院信息
    handleGetHospitalDataAdd(val) {

      let _this = this;
      let hospitalInfo = JSON.parse(JSON.stringify(val));
      _this.tableData.push(hospitalInfo);
      _this.$message({
        showClose: true,
        customClass: 'is-fixed',
        message: '添加成功！',
        type: 'success'
      });
      _this.tableData = JSON.parse(JSON.stringify(_this.tableData));
    },
    // 获取住院信息
    handleGetHospitalDataEdit(val) {
      let _this = this;
      let hospital = JSON.parse(JSON.stringify(val));
      // 编辑已存在的住院
      _this.tableData.forEach((item, index) => {
        if (index === hospital.index) {
          // 如果有该住院的话，直接替换该位置上的住院内容
          _this.tableData[index] = hospital;
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
    },
  }
}
</script>

<style lang="scss" scoped>
.con-biz-Hospital {
  .con-add-btn {
    position: absolute;
    right: 0;
    top: -1px;
  }
}
</style>
