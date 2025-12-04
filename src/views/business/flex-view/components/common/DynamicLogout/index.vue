<template>
  <el-dialog
    title="注销确认"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
    width="600px"
  >
    <hd-pane fit>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
        <hd-component :model="extendData" ref="componentRef">
          <biz-form-card title="注销信息">
            <biz-form>
              <biz-form-row>
                <biz-form-item
                  label="注销原因"
                  :required="true"
                  :span="24"
                  pClass="p-divs"
                >
                  <el-form-item prop="zxyy">
                    <el-input
                      type="textarea"
                      :rows="3"
                      v-model="formData.zxyy"
                      placeholder="请输入注销原因"
                      maxlength="200"
                    ></el-input>
                  </el-form-item>
                </biz-form-item>
              </biz-form-row>
            </biz-form>
          </biz-form-card>
        </hd-component>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm" v-preventReClick>
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";

export default {
  name: "DynamicLogout",
  provide() {
    return {};
  },
  mixins: [hdList, hdForm],
  data() {
    return {
      // 显示
      visible: false,
      // 表单加载提示
      loadingForForm: false,

      // 表单
      formData: {
        zxyy: ""
      },
      // 表单扩展
      extendData: {},
      // 验证
      rules: {
        zxyy: [{ required: true, message: "请输入注销原因", trigger: "blur" }]
      },

      // 行
      row: {
        vo: {},
        vox: {}
      }
    };
  },
  mounted() {},
  updated() {},
  methods: {
    // 加载之前
    beforeLoadForm() {
      this.$nextTick(() => {
        // 重置表单
        this.resetForm();
      });
    },
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.loading = true;
          // 触发父组件传入的注销接口
          _this.$emit("submit", {
            id: _this.row.vo.id,
            zxyy: _this.formData.zxyy,
            callback: (success, msg) => {
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg || "注销成功",
                  type: "success"
                });
                _this.cancelForm();
              }
              _this.loading = false;
            }
          });
        }
      });
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped></style>
