<template>
  <div class="con-biz-car">
    <el-button
      class="con-add-btn"
      v-if="showAddBtn"
      type="success"
      icon="el-icon-circle-plus-outline"
      @click="handleAdd"
      >添加</el-button
    >
    <div>
      <!--车辆信息列表-->
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
              >详情</el-button
            >
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
                /> </span
            ></el-button>
            <el-button
              v-if="showDeleteBtn"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="carNum"
          label="车牌号"
          align="center"
          min-width="120"
        ></el-table-column>
        <el-table-column
          v-if="false"
          show-overflow-tooltip
          prop="frameNum"
          label="车架号"
          align="center"
          min-width="160"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="colorText"
          label="车身颜色"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="carBrand"
          label="车辆品牌"
          align="center"
          min-width="160"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="carTypeText"
          label="车辆型号"
          align="center"
          min-width="160"
        ></el-table-column>
        <el-table-column
          prop="sjlyText"
          label="数据来源"
          align="center"
          width="110"
        ></el-table-column>
      </el-table>
    </div>
    <biz-car-add
      ref="carAddRef"
      @currentChange="handleGetCarDataAdd"
    ></biz-car-add>
    <biz-car-edit
      ref="carEditRef"
      @currentChange="handleGetCarDataEdit"
    ></biz-car-edit>
    <biz-car-detail ref="carDetailRef"></biz-car-detail>
  </div>
</template>

<script>
import { hdForm, hdList } from "@/utils/util-framework";
import BizCarAdd from "./BizCarAdd";
import BizCarEdit from "./BizCarEdit";
import BizCarDetail from "./BizCarDetail";

export default {
  name: "Index",
  provide() {
    return {
      bizCar: this
    };
  },
  inject: [],
  mixins: [hdList, hdForm],
  components: {
    BizCarAdd,
    BizCarEdit,
    BizCarDetail
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
      // 车辆信息列表
      tableData: []
    };
  },
  watch: {},
  methods: {
    // 车辆信息新增
    handleAdd() {
      this.$refs.carAddRef.visible = true;
      this.$refs.carAddRef.beforeLoadForm();
    },
    // 车辆信息详情
    handleDetail(index, row) {
      this.$refs.carDetailRef.visible = true;
      this.$refs.carDetailRef.row = row;
      this.$refs.carDetailRef.beforeLoadForm();
    },
    // 车辆信息编辑
    handleEdit(index, row) {
      this.$refs.carEditRef.visible = true;
      this.$refs.carEditRef.row = row;
      this.$refs.carEditRef.rowIndex = index;
      this.$refs.carEditRef.beforeLoadForm();
    },
    // 车辆信息删除
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
    // 获取车辆信息信息
    handleGetCarDataAdd(val) {
      let _this = this;
      let car = JSON.parse(JSON.stringify(val));
      // 先判断车辆信息列表中有没有该车辆信息（根据身份证号确定，已存在的车辆信息不允许再次添加）
      let hasNotThisCar = true;
      _this.tableData.forEach((item, index) => {
        if (item.carNum === car.carNum) {
          // 车辆信息列表中有该车辆信息
          hasNotThisCar = false;
        }
      });
      // 判断该车辆信息是否存在
      if (!hasNotThisCar) {
        _this.$message({
          showClose: true,
          customClass: "is-fixed",
          message: "该车辆信息信息已存在！",
          type: "warning"
        });
      } else {
        _this.tableData.push(car);
        _this.$message({
          showClose: true,
          customClass: "is-fixed",
          message: "添加成功！",
          type: "success"
        });
      }
      _this.tableData = JSON.parse(JSON.stringify(_this.tableData));
    },
    // 获取车辆信息信息
    handleGetCarDataEdit(val, index) {
      let _this = this;
      let car = JSON.parse(JSON.stringify(val));
      // 编辑已存在的车辆信息

      // 如果有该车辆信息的话，直接替换该位置上的车辆信息内容
      _this.tableData[index] = car;
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
.con-biz-car {
  .con-add-btn {
    position: absolute;
    right: 0;
    top: -1px;
  }
}
</style>
