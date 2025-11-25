<template>
  <el-dialog
    title="编辑"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
  >
    <hd-pane fit>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
        <biz-form-card title="当事人信息">
          <biz-form>
            <biz-form-row>
              <biz-form-item label="身份证号" :required="true" :span="24">
                <el-form-item prop="dsrCardId">
                  <el-input
                    disabled
                    strMode="upper"
                    v-model="formData.dsrCardId"
                    placeholder="请输入身份证号"
                    maxlength="18"
                  >
                  </el-input>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>
            <biz-form-row>
              <biz-form-item
                label="姓&emsp;&emsp;名"
                :required="true"
                :span="12"
              >
                <el-form-item prop="dsrName">
                  <el-input
                    v-model="formData.dsrName"
                    placeholder="请输入姓名"
                    maxlength="30"
                  >
                  </el-input>
                </el-form-item>
              </biz-form-item>

              <biz-form-item
                label="民&emsp;&emsp;族"
                :required="true"
                :span="12"
              >
                <el-form-item prop="dsrMz">
                  <hd-dict-select
                    v-model="formData.dsrMz"
                    :model-text.sync="formData.dsrMzText"
                    :dict-code="$global.dictType.nation"
                    type="button"
                  ></hd-dict-select>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>
            <biz-form-row>
              <biz-form-item label="联系电话" :required="true" :span="24">
                <el-form-item prop="dsrLxdh">
                  <el-input
                    v-model="formData.dsrLxdh"
                    placeholder="请输入联系电话"
                    maxlength="12"
                  >
                  </el-input>
                </el-form-item> </biz-form-item
            ></biz-form-row>
            <biz-form-row>
              <biz-form-item
                label="人员标签"
                :required="false"
                :span="24"
                pClass="p-divs"
              >
                <el-form-item prop="dsrRybqList">
                  <hd-dict-checkbox
                    v-model="formData.dsrRybqList"
                    :model-text.sync="formData.dsrRybqTextList"
                    :dict-code="$global.dictType.gzryType"
                    :isCustomApi="true"
                    :customApiUrl="$global.rybqApiConfig.url"
                    :customApiDefaultParams="
                      $global.rybqApiConfig.customApiDefaultParams
                    "
                    type="button"
                  ></hd-dict-checkbox>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>
            <biz-form-row>
              <biz-form-item
                label="人员等级"
                :required="false"
                :span="24"
                pClass="p-divs"
              >
                <el-form-item prop="dsrRydj">
                  <hd-dict-radio
                    v-model="formData.dsrRydj"
                    :model-text.sync="formData.dsrRydjText"
                    :dict-code="$global.dictType.gzryLevel"
                    type="button"
                  ></hd-dict-radio>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

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
                    v-model="formData.memo"
                    :autosize="{ minRows: 2, maxRows: 5 }"
                    placeholder="请输入备注"
                    maxlength="500"
                  ></el-input>
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
  name: "BizListEdit",
  provide() {
    return {
      BizListEdit: this
    };
  },
  inject: ["BizList"],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示与隐藏
      visible: false,
      // 表单信息
      formData: {
        dsrCardId: "",
        dsrName: "",
        dsrLxdh: "",
        dsrRybqList: [],
        dsrRybqTextList: [],
        dsrRydj: "",
        dsrRydjText: "",
        memo: ""
      },
      // 验证
      rules: {
        dsrCardId: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          { validator: this.$utilValidate.validateIdcard, trigger: "blur" }
        ],
        dsrName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            validator: this.$utilValidate.validateChineseName,
            trigger: "blur"
          },
          { min: 2, max: 30, message: "请正确输入真实姓名", trigger: "blur" }
        ],
        dsrLxdh: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            validator: this.$utilValidate.validateMobileAndTel,
            trigger: "blur"
          },
          {
            validator: this.$utilValidate.validateMobileAndTel2,
            trigger: "blur"
          }
        ],
        dsrMz: [{ required: true, message: "请选择民族", trigger: "change" }]
      },
      // 行
      row: {},
      currentIndex: 0
    };
  },
  methods: {
    // 加载之前
    beforeLoadForm() {
      this.$nextTick(() => {
        // 清空表单
        this.resetForm();
        // 加载表单
        this.loadForm();
      });
    },
    // 加载表单
    loadForm() {
      this.formData = JSON.parse(JSON.stringify(this.row));
    },
    // 确定
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.$emit("currentChange", _this.formData, this.currentIndex);
          _this.cancelForm();
        }
      });
    },

    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
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
