<template>
  <el-dialog
    title="注销表单项配置"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
  >
    <hd-pane fit>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
        <hd-component :model="extendData" ref="componentRef">
          <biz-form-card title="注销表单项配置">
            <biz-form>
              <biz-form-row>
                <biz-form-item
                  label="组件标签"
                  :required="false"
                  :span="24"
                  pClass="p-divs"
                >
                  <el-form-item>
                    <el-input v-model="row.vo.itemLabel" disabled></el-input>
                  </el-form-item>
                </biz-form-item>
              </biz-form-row>
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
      <el-button type="primary" @click="submitForm" v-preventReClick
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";
import { logout } from "./api";

export default {
  name: "FormItemLogout",
  provide() {
    return {};
  },
  mixins: [hdList, hdForm],
  inject: ["hdList"],
  data() {
    return {
      visible: false,
      loadingForForm: false,
      formData: {
        zxyy: ""
      },
      extendData: {},
      rules: {
        zxyy: [{ required: true, message: "请输入注销原因", trigger: "blur" }]
      },
      row: {
        vo: {},
        vox: {}
      }
    };
  },
  methods: {
    beforeLoadForm() {
      this.$nextTick(() => {
        this.resetForm();
      });
    },

    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.loading = true;
          let dataParams = {
            id: _this.row.vo.id,
            zxyy: _this.formData.zxyy
          };

          logout(dataParams)
            .then((response) => {
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg,
                  type: "success"
                });
                _this.cancelForm();
                _this.$emit("refresh");
              }
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              _this.loading = false;
            });
        }
      });
    },

    cancelForm() {
      this.visible = false;
      this.resetForm();
    },

    resetForm() {
      this.$refs.formRef.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped></style>
