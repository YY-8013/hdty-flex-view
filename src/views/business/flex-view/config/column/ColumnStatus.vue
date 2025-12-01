<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    custom-class="hdty-dialog-medium new-form"
    append-to-body
  >
    <hd-pane fit>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
        <hd-component :model="extendData" ref="componentRef">
          <biz-form-card :title="dialogTitle">
            <biz-form>
              <biz-form-row>
                <biz-form-item
                  label="列&ensp;名&ensp;称"
                  :required="false"
                  :span="24"
                  pClass="p-divs"
                >
                  <el-form-item>
                    <el-input v-model="row.label" disabled></el-input>
                  </el-form-item>
                </biz-form-item>
              </biz-form-row>
              <biz-form-row>
                <biz-form-item
                  :label="remarkLabel"
                  :required="true"
                  :span="24"
                  pClass="p-divs"
                >
                  <el-form-item prop="remark">
                    <el-input
                      type="textarea"
                      :rows="3"
                      v-model="formData.remark"
                      :placeholder="`请输入${remarkLabel}`"
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
import { reSetEnable } from "./api";

export default {
  name: "ColumnStatus",
  provide() {
    return {};
  },
  mixins: [hdList, hdForm],
  inject: ["hdList"],
  data() {
    return {
      // 显示
      visible: false,
      // 表单加载提示
      loadingForForm: false,

      // 表单
      formData: {
        remark: ""
      },
      // 表单扩展
      extendData: {},
      // 验证
      rules: {
        remark: [{ required: true, message: "请输入操作原因", trigger: "blur" }]
      },

      // 行
      row: {
        vo: {},
        vox: {}
      },

      // 状态：0-停用，1-启用
      status: ""
    };
  },
  computed: {
    // 弹窗标题
    dialogTitle() {
      return this.status === "1" ? "启用列配置" : "停用列配置";
    },
    // 备注标签
    remarkLabel() {
      return this.status === "1" ? "启用原因" : "停用原因";
    }
  },
  mounted() {},
  updated() {},
  methods: {
    // 加载之前
    beforeLoadForm() {
      this.$nextTick(() => {
        // 重置表单
        this.resetForm();
        // 更新验证消息
        this.rules.remark[0].message = `请输入${this.remarkLabel}`;
      });
    },
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.loading = true;
          // 参数
          let dataParams = {
            id: _this.row.id,
            status: _this.status,
            remark: _this.formData.remark
          };
          // Lambda写法
          reSetEnable(dataParams)
            .then((response) => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg,
                  type: "success"
                });
                _this.cancelForm();
                _this.hdList.loadList();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.error(error);
            })
            .finally(() => {
              _this.loading = false;
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
