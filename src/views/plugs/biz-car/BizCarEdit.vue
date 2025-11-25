<template>
  <el-dialog
    title="编辑"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
    width="50%"
  >
    <hd-pane fit>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
        <biz-form-card title="车辆信息">
          <biz-form>
            <!-- 车牌号 -->
            <biz-form-row>
              <biz-form-item
                label="车&ensp;牌&ensp;号"
                :required="true"
                :span="24"
              >
                <el-form-item prop="carNum">
                  <el-input
                    v-model="formData.carNum"
                    placeholder="请输入车牌号"
                    maxlength="20"
                  />
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 车牌颜色 -->
            <biz-form-row>
              <biz-form-item label="车牌颜色" :required="false" :span="24">
                <el-form-item prop="carNumColor">
                  <hd-dict-select
                    v-model="formData.carNumColor"
                    :model-text.sync="formData.carNumColorText"
                    :dict-code="$global.dictType.carNumColor"
                    filterable
                    placeholder="请选择车牌颜色"
                  />
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 车架号 -->
            <biz-form-row v-if="false">
              <biz-form-item
                label="车&ensp;架&ensp;号"
                :required="false"
                :span="24"
              >
                <el-form-item prop="frameNum">
                  <el-input
                    v-model="formData.frameNum"
                    placeholder="请输入车架号"
                    maxlength="30"
                  />
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 车身颜色 -->
            <biz-form-row>
              <biz-form-item label="车身颜色" :required="true" :span="24">
                <el-form-item prop="color">
                  <hd-dict-select
                    v-model="formData.color"
                    :model-text.sync="formData.colorText"
                    :dict-code="$global.dictType.carColor"
                    filterable
                    placeholder="请选择车身颜色"
                  />
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 车辆品牌 -->
            <biz-form-row>
              <biz-form-item label="车辆品牌" :required="true" :span="24">
                <el-form-item prop="carBrand">
                  <el-input
                    v-model="formData.carBrand"
                    placeholder="请输入车辆品牌"
                    maxlength="30"
                  />
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 车辆型号 -->
            <biz-form-row>
              <biz-form-item label="车辆型号" :required="true" :span="24">
                <el-form-item prop="carType">
                  <hd-dict-select
                    v-model="formData.carType"
                    :model-text.sync="formData.carTypeText"
                    :dict-code="$global.dictType.clhpzl"
                    filterable
                    placeholder="请选择车辆型号"
                  />
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 车主姓名 -->
            <biz-form-row>
              <biz-form-item label="车主姓名" :required="true" :span="24">
                <el-form-item prop="carOwner">
                  <el-input
                    v-model="formData.carOwner"
                    placeholder="请输入车主姓名"
                    maxlength="15"
                  />
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 车主电话 -->
            <biz-form-row>
              <biz-form-item label="车主电话" :required="true" :span="24">
                <el-form-item prop="lxdh">
                  <el-input
                    v-model="formData.lxdh"
                    placeholder="请输入车主电话"
                    maxlength="15"
                  />
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 身份证号 -->
            <biz-form-row>
              <biz-form-item label="身份证号" :required="true" :span="24">
                <el-form-item prop="carOwnerGmsfzh">
                  <el-input
                    v-model="formData.carOwnerGmsfzh"
                    placeholder="请输入身份证号"
                    maxlength="18"
                  />
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!--车身照片-->
            <biz-form-row>
              <biz-form-item
                label="车身照片"
                :required="false"
                :span="24"
                pClass="p-divs"
              >
                <el-form-item prop="docIds">
                  <biz-form-upload
                    v-if="visible && showFile"
                    v-model="formData.docIds"
                    :oldFileList.sync="formData.fileList"
                    ref="fileListRef"
                    busType="62"
                    :limit="10"
                    :acceptSize="5"
                  ></biz-form-upload>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 备注 -->
            <biz-form-row>
              <biz-form-item
                label="备&emsp;&emsp;注"
                :required="false"
                :span="24"
                pClass="p-divs"
              >
                <el-form-item prop="memo">
                  <el-input
                    type="textarea"
                    :rows="3"
                    v-model="formData.memo"
                    placeholder="请输入备注"
                    maxlength="100"
                  />
                </el-form-item>
              </biz-form-item>
            </biz-form-row>
          </biz-form>
        </biz-form-card>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";

export default {
  name: "BizCarEdit",
  provide() {
    return {
      BizGxrEdit: this
    };
  },
  inject: ["bizCar"],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示与隐藏
      visible: false,
      // 表单信息
      formData: {
        carNum: "",
        frameNum: "",
        color: "",
        colorText: "",
        carType: "",
        carTypeText: "",
        carOwner: "",
        lxdh: "",
        carOwnerGmsfzh: "",
        memo: "",
        carNumColor: "",
        carBrand: "",
        docIds: [],
        fileList: []
      },
      rowIndex: 0,
      // 验证
      rules: {
        carNum: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
          { validator: this.$utilValidate.validateCarcard, trigger: "blur" }
        ],
        carBrand: [
          { required: true, message: "请输入车辆品牌", trigger: "blur" }
        ],
        color: [
          { required: true, message: "请选择车身颜色", trigger: "change" }
        ],
        carNumColor: [
          { required: false, message: "请选择车牌颜色", trigger: "change" }
        ],
        carType: [
          { required: true, message: "请选择车辆型号", trigger: "change" }
        ],
        carOwnerGmsfzh: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          { validator: this.$utilValidate.validateIdcard, trigger: "blur" }
        ],
        carOwner: [
          { required: true, message: "请输入车主姓名", trigger: "blur" },
          {
            validator: this.$utilValidate.validateChineseName,
            trigger: "blur"
          },
          { min: 2, max: 30, message: "请正确输入真实姓名", trigger: "blur" }
        ],
        lxdh: [
          { required: true, message: "请输入车主电话", trigger: "blur" },
          {
            validator: this.$utilValidate.validateMobileAndTel,
            trigger: "blur"
          },
          {
            validator: this.$utilValidate.validateMobileAndTel2,
            trigger: "blur"
          }
        ]
      },
      // 行
      row: {},
      showFile: false
    };
  },
  methods: {
    // 加载之前
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
      _this.formData = JSON.parse(JSON.stringify(_this.row));

      _this.$nextTick(() => {
        _this.showFile = true;
      });
    },
    // 确定
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (_this.formData.carOwnerGmsfzh) {
            _this.formData.carOwnerGmsfzh =
              _this.formData.carOwnerGmsfzh.toUpperCase();
          }
          if (_this.formData.carOwner) {
            _this.formData.carOwner = _this.$utilAll.getNameForDot(
              _this.formData.carOwner
            );
          }
          _this.$set(_this.formData, "needEdit", false);
          _this.$emit("currentChange", _this.formData, _this.rowIndex);
          _this.cancelForm();
        }
      });
    },
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
      this.formData.colorText = "";
      this.formData.carTypeText = "";
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    }
  }
};
</script>

<style lang="scss" scoped></style>
