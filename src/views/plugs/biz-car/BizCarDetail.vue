<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
  >
    <hd-pane fit v-loading="handleLoading">
      <biz-form-card title="车辆信息">
        <biz-form>
          <!-- 车牌号 -->
          <biz-form-row>
            <biz-form-item label="车&ensp;牌&ensp;号" :span="24">
              <div class="text-div">{{ formData.carNum }}</div>
            </biz-form-item>
          </biz-form-row>

          <!-- 车牌颜色 -->
          <biz-form-row>
            <biz-form-item label="车牌颜色" :span="24">
              <div class="text-div">{{ formData.carNumColorText }}</div>
            </biz-form-item>
          </biz-form-row>

          <!-- 车架号 -->
          <biz-form-row v-if="false">
            <biz-form-item label="车&ensp;架&ensp;号" :span="24">
              <div class="text-div">{{ formData.frameNum }}</div>
            </biz-form-item>
          </biz-form-row>

          <!-- 车身颜色 -->
          <biz-form-row>
            <biz-form-item label="车身颜色" :span="24">
              <div class="text-div">{{ formData.colorText }}</div>
            </biz-form-item>
          </biz-form-row>

          <!-- 车辆品牌 -->
          <biz-form-row>
            <biz-form-item label="车辆品牌" :span="24">
              <div class="text-div">{{ formData.carBrand }}</div>
            </biz-form-item>
          </biz-form-row>

          <!-- 车辆型号 -->
          <biz-form-row>
            <biz-form-item label="车辆型号" :span="24">
              <div class="text-div">{{ formData.carTypeText }}</div>
            </biz-form-item>
          </biz-form-row>

          <!-- 车主姓名 -->
          <biz-form-row>
            <biz-form-item label="车主姓名" :span="24">
              <div class="text-div">{{ formData.carOwner }}</div>
            </biz-form-item>
          </biz-form-row>

          <!-- 车主电话 -->
          <biz-form-row>
            <biz-form-item label="车主电话" :span="24">
              <div class="text-div">{{ formData.lxdh }}</div>
            </biz-form-item>
          </biz-form-row>

          <!-- 身份证号 -->
          <biz-form-row>
            <biz-form-item label="身份证号" :span="24">
              <div class="text-div">{{ formData.carOwnerGmsfzh }}</div>
            </biz-form-item>
          </biz-form-row>

          <biz-form-row>
            <biz-form-item label="车身照片" :span="24" pClass="p-divs">
              <biz-photo-list
                v-if="visible && showFile"
                :value="formData.fileList"
              ></biz-photo-list>
            </biz-form-item>
          </biz-form-row>

          <!-- 备注 -->
          <biz-form-row>
            <biz-form-item label="备&emsp;&emsp;注" :span="24" pClass="p-divs">
              <biz-html :value="formData.memo"></biz-html>
            </biz-form-item>
          </biz-form-row>

          <div class="form-row">
            <div class="form-item-24 form-item">
              <label class="label">数据来源</label>
              <div class="p-div p-divs">
                <div class="text-div">
                  {{ formData.sjlyText }}
                </div>
              </div>
            </div>
          </div>
        </biz-form>
      </biz-form-card>
    </hd-pane>

    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";

export default {
  name: "BizCarDetail",
  provide() {
    return {
      BizCarDetail: this
    };
  },
  inject: ["bizCar"],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示
      visible: false,
      // 表单
      formData: {},
      // 行
      row: {},

      showFile: false
    };
  },
  methods: {
    // 初始化执行的方法
    beforeLoadForm() {
      this.showFile = false;
      this.$nextTick(() => {
        // 清空表单
        this.resetForm();
        // 加载表单
        this.loadForm();
      });
    },
    // 加载表单
    loadForm() {
      let _this = this;
      _this.handleLoading = true;
      _this.formData = _this.row;
      _this.handleLoading = false;

      _this.$nextTick(() => {
        _this.showFile = true;
      });
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.formData = {};
    }
  }
};
</script>

<style lang="scss" scoped></style>
